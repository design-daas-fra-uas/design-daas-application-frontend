import { Alert, ProgressBar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getQuota } from '../../../api/monitoring';
import AsyncContent from '../../../components/AsyncContent';
import PageLayout from '../../../components/PageLayout';
import RefreshButton from '../../../components/RefreshButton';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';
import { formatAmount, isUnlimited, usagePercent, usageVariant } from './format';

const ICONS = {
  vms: 'fa-desktop',
  containers: 'fa-cube',
  objects: 'fa-layer-group',
  cpus: 'fa-microchip',
  memory: 'fa-memory',
  disk: 'fa-hard-drive',
};

// One resource: what is used, the limit, and a bar (or "No limit").
function QuotaCard({ item }) {
  const { t } = useTranslation();
  const { key, used, limit, unit } = item;
  const label = t(`quota-${key}`);
  const unlimited = isUnlimited(limit);
  const percent = usagePercent(used, limit);

  return (
    <div className="stat-card">
      <div className="stat-card-head">
        <i className={`fa-solid ${ICONS[key] ?? 'fa-gauge'}`} aria-hidden="true" />
        <span>{label}</span>
      </div>
      <div className="stat-card-value">
        {formatAmount(used, unit)}
        <span className="stat-card-limit">
          {' / '}
          {unlimited ? t('quota-unlimited') : formatAmount(limit, unit)}
        </span>
      </div>
      {unlimited ? (
        <p className="stat-card-note">{t('quota-unlimited-hint')}</p>
      ) : (
        <ProgressBar
          now={percent}
          label={`${percent} %`}
          variant={usageVariant(percent)}
          aria-label={`${label} ${percent} %`}
        />
      )}
    </div>
  );
}

// The user's resource limits (limits.toml or their own entry) next to what they use right
// now, computed like the backend's check before an object or instance is started.
function QuotaPage() {
  const { t } = useTranslation();
  const { data, status, reload } = useResource(getQuota);

  return (
    <PageLayout
      id="quota"
      title={t('quota-title')}
      backTo={ROUTES.dashboard}
      actions={<RefreshButton inline onClick={() => reload()} />}
    >
      <AsyncContent status={status} onRetry={reload}>
        {() => (
          <>
            <p className="page-intro">{t(`quota-source-${data.source}`)}</p>
            {data.overcommit && <Alert variant="info">{t('quota-overcommit')}</Alert>}
            <div className="stat-grid">
              {data.items.map((item) => (
                <QuotaCard key={item.key} item={item} />
              ))}
            </div>
          </>
        )}
      </AsyncContent>
    </PageLayout>
  );
}

export default QuotaPage;
