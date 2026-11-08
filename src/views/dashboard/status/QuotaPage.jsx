import { Alert, ProgressBar, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getQuota } from '../../../api/monitoring';
import AsyncContent from '../../../components/AsyncContent';
import BackLink from '../../../components/BackLink';
import PageLayout from '../../../components/PageLayout';
import RefreshButton from '../../../components/RefreshButton';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';
import { formatAmount, usagePercent, usageVariant } from './format';

// The user's resource limits (limits.toml) next to what they use right now,
// computed like the backend's check before an object or instance is started.
function QuotaPage() {
  const { t } = useTranslation();
  const { data, status, reload } = useResource(getQuota);

  return (
    <PageLayout id="quota" title={t('quota-title')}>
      <AsyncContent status={status} onRetry={reload}>
        {() => (
          <>
            <p className="text-center">{t(`quota-source-${data.source}`)}</p>
            {data.overcommit && <Alert variant="info">{t('quota-overcommit')}</Alert>}
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>{t('quota-resource')}</th>
                  <th>{t('quota-used')}</th>
                  <th>{t('quota-limit')}</th>
                  <th className="w-50">{t('quota-usage')}</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map(({ key, used, limit, unit }) => {
                  const percent = usagePercent(used, limit);
                  return (
                    <tr key={key}>
                      <td>{t(`quota-${key}`)}</td>
                      <td>{formatAmount(used, unit)}</td>
                      <td>{limit == null ? t('quota-unlimited') : formatAmount(limit, unit)}</td>
                      <td>
                        {limit == null ? (
                          '-'
                        ) : (
                          <ProgressBar
                            now={percent}
                            label={`${percent} %`}
                            variant={usageVariant(percent)}
                            aria-label={`${t(`quota-${key}`)} ${percent} %`}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        )}
      </AsyncContent>
      <Row>
        <BackLink to={ROUTES.dashboard} />
      </Row>
      <RefreshButton onClick={() => reload()} />
    </PageLayout>
  );
}

export default QuotaPage;
