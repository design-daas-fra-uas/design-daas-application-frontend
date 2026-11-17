import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import AsyncContent from '../../../components/AsyncContent';
import FormField from '../../../components/FormField';
import FormModal from '../../../components/FormModal';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getDesktops, createDesktop } from '../../../api/desktops';
import { getDesktopGroups } from '../../../api/desktopGroups';
import { namesOf } from './desktopFormat';

const INITIAL_VALUES = { description: '', subDescription: '' };

function Desktops() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { t } = useTranslation();
  const { data, status, reload } = useResource(getDesktops);
  // Only used to show group names; the list works without them.
  const { data: groups, reload: reloadGroups } = useResource(getDesktopGroups);
  const desktops = data ?? [];

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        description: Yup.string()
          .trim()
          .required(t('error-desktop-main-description', 'Desktop main description invalid')),
        subDescription: Yup.string()
          .trim()
          .required(t('error-desktop-sub-description', 'Desktop sub description invalid')),
      }),
    [t],
  );

  return (
    <PageLayout
      backTo={ROUTES.admin.root}
      id="desktops"
      title={t('desktops')}
      actions={
        <Button size="sm" onClick={() => setCreateModalOpen(true)}>
          <i className="fa-solid fa-plus me-2" aria-hidden="true" />
          {t('desktop-new')}
        </Button>
      }
    >
      <section className="panel" aria-labelledby="desktops-list-title">
        <h2 id="desktops-list-title" className="panel-title">
          {t('desktops')} <span className="count-badge">{desktops.length}</span>
        </h2>
        <AsyncContent status={status} onRetry={reload}>
          {desktops.length === 0 ? (
            <p className="empty-state">{t('desktop-empty')}</p>
          ) : (
            <ul className="entity-list">
              {desktops.map((desktop) => (
                <li key={desktop.id}>
                  <div className="entity-main">
                    <span className="entity-name">{desktop.description}</span>
                    <span className="entity-meta">
                      {desktop.groups?.length
                        ? t('desktop-in-groups', { names: namesOf(desktop.groups, groups) })
                        : t('desktop-no-groups')}
                    </span>
                  </div>
                  <Link className="btn btn-outline-primary btn-sm" to={ROUTES.admin.desktopDetail(desktop.id)}>
                    {t('details')}
                    <span className="visually-hidden">: {desktop.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AsyncContent>
      </section>
      <FormModal
        show={createModalOpen}
        onHide={() => setCreateModalOpen(false)}
        title={t('desktop-create')}
        titleId="create-desktop-modal-title"
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        onSubmit={({ description, subDescription }) =>
          createDesktop({ description: description.trim(), subDescription: subDescription.trim() })
        }
        onSaved={() => {
          reload();
          reloadGroups();
        }}
        fullWidthSubmit
      >
        <FormField name="description" label={t('desktop-name')} autoComplete="off" />
        <FormField
          name="subDescription"
          label={t('desktop-new-group')}
          hint={t('desktop-new-group-hint')}
          autoComplete="off"
        />
      </FormModal>
    </PageLayout>
  );
}

export default Desktops;
