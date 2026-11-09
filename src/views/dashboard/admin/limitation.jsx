import { useMemo, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getAdmins } from '../../../api/admins';
import { getLimitOverview, removeLimit } from '../../../api/limits';
import { getUsers } from '../../../api/users';
import AsyncContent from '../../../components/AsyncContent';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import PageLayout from '../../../components/PageLayout';
import RefreshButton from '../../../components/RefreshButton';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';
import { isUnlimited } from '../status/format';
import { LIMIT_FIELDS, formatLimit } from './limits/limitFormat';
import LimitModal from './limits/LimitModal';

// Limits from the DaaS backend plus the account names from the Java backend.
const loadLimitPage = async ({ signal }) => {
  const [overview, users, admins] = await Promise.all([
    getLimitOverview({ signal }),
    getUsers({ signal }),
    getAdmins({ signal }),
  ]);
  return { ...overview, accounts: [...users, ...admins] };
};

// Value cell: "Unlimited" is shown softer than a real number.
function LimitValue({ value, unit }) {
  const { t } = useTranslation();
  return isUnlimited(value) ? (
    <span className="text-muted">{t('limit-unlimited')}</span>
  ) : (
    formatLimit(value, unit, t('limit-unlimited'))
  );
}

// A named set of limits (the default or the system maximum) as a compact card.
function LimitCard({ title, hint, limit }) {
  const { t } = useTranslation();
  return (
    <div className="panel">
      <h3 className="panel-title">{title}</h3>
      <p className="text-muted small">{hint}</p>
      <dl className="limit-summary">
        {LIMIT_FIELDS.map(({ key, label, unit }) => (
          <div key={key}>
            <dt>{t(label)}</dt>
            <dd>
              <LimitValue value={limit?.[key]} unit={unit} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Per-user resource limits: who may start how many VMs and containers, with how much
// CPU, memory and disk. Users without their own entry get the default limit.
function Limitation() {
  const { t } = useTranslation();
  const { data, status, reload } = useResource(loadLimitPage);
  const [editing, setEditing] = useState(undefined); // undefined: closed, null: new, object: edit
  const [removing, setRemoving] = useState(null);

  const accountsById = useMemo(() => new Map((data?.accounts ?? []).map((account) => [account.id, account])), [data]);
  // Known accounts first (by name), then entries whose account no longer exists.
  const rows = useMemo(
    () =>
      (data?.limits ?? [])
        .map((limit) => ({ limit, account: accountsById.get(limit.id_owner) }))
        .sort((a, b) => {
          if (Boolean(a.account) !== Boolean(b.account)) {
            return a.account ? -1 : 1;
          }
          return (a.account?.name ?? '').localeCompare(b.account?.name ?? '') || a.limit.id_owner - b.limit.id_owner;
        }),
    [data, accountsById],
  );
  const accountName = (row) => row.account?.name ?? t('limit-unknown-account', { id: row.limit.id_owner });
  const reloadSilently = () => reload({ silent: true });

  return (
    <PageLayout
      id="settingsOverviewAdminAssign"
      title={t('limitation')}
      backTo={ROUTES.admin.root}
      actions={
        <>
          <RefreshButton inline onClick={() => reload()} />
          <Button size="sm" onClick={() => setEditing(null)} disabled={status !== 'loaded'}>
            <i className="fa-solid fa-plus me-2" aria-hidden="true" />
            {t('limit-create-title')}
          </Button>
        </>
      }
    >
      <p className="page-intro">{t('limit-intro')}</p>
      <AsyncContent status={status} onRetry={reload}>
        {() => (
          <>
            <div className="card-columns-2">
              <LimitCard title={t('limit-default-title')} hint={t('limit-default-hint')} limit={data.fallback} />
              <LimitCard title={t('limit-system-title')} hint={t('limit-system-hint')} limit={data.syslimit} />
            </div>

            <div className="panel">
              <h3 className="panel-title">{t('limit-users-title')}</h3>
              {rows.length === 0 ? (
                <p className="empty-state">{t('limit-users-empty')}</p>
              ) : (
                <Table hover responsive className="data-table">
                  <thead>
                    <tr>
                      <th>{t('limit-account')}</th>
                      {LIMIT_FIELDS.map(({ key, label }) => (
                        <th key={key} className="text-end">
                          {t(label)}
                        </th>
                      ))}
                      <th aria-label={t('actions', 'Actions')} />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.limit.id_owner} className={row.account ? undefined : 'row-muted'}>
                        <td>
                          <div className="fw-medium">{accountName(row)}</div>
                          {row.account && <div className="small text-muted">{row.account.email}</div>}
                        </td>
                        {LIMIT_FIELDS.map(({ key, unit }) => (
                          <td key={key} className="text-end text-nowrap">
                            <LimitValue value={row.limit[key]} unit={unit} />
                          </td>
                        ))}
                        <td className="text-end text-nowrap">
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`${t('limit-edit-title')} ${accountName(row)}`}
                            title={t('limit-edit-title')}
                            onClick={() => setEditing(row.limit)}
                            disabled={!row.account}
                          >
                            <i className="fa-solid fa-pen" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`${t('limit-remove')} ${accountName(row)}`}
                            title={t('limit-remove')}
                            onClick={() => setRemoving(row)}
                          >
                            <i className="fa-solid fa-trash" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>

            <LimitModal
              show={editing !== undefined}
              onHide={() => setEditing(undefined)}
              limit={editing}
              defaults={data.fallback}
              accounts={data.accounts}
              onSaved={reloadSilently}
            />
          </>
        )}
      </AsyncContent>
      <ConfirmDeleteModal
        show={removing !== null}
        onHide={() => setRemoving(null)}
        title={t('limit-remove')}
        message={removing ? t('limit-remove-confirm', { name: accountName(removing) }) : ''}
        onConfirm={() => removeLimit(removing.limit.id_owner)}
        onDeleted={reloadSilently}
      />
    </PageLayout>
  );
}

export default Limitation;
