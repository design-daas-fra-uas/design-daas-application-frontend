import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import PageLayout from '../../../components/PageLayout';
import PermissionDenied from '../../../components/PermissionDenied';
import RefreshButton from '../../../components/RefreshButton';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import { ROUTES } from '../../../routes';
import { CATEGORIES } from '../monitoring/monitoringConfig';
import { MonitoringCounts, MonitoringDenied, MonitoringTabs } from '../monitoring/MonitoringSections';
import useMonitoring from '../monitoring/useMonitoring';

// Monitoring of the logged-in user's own tasks, files, apps and resources.
function MonitoringUser() {
  const { t } = useTranslation();
  const { data, loaded, denied, load } = useMonitoring('user');
  // Nothing to show when every category is denied, only the reason
  const allDenied = denied.length === CATEGORIES.length;
  // The data (or the reason it is missing) is shown once the first load is done
  const showData = loaded && !allDenied;
  const { requestAlert, showRequestAlert } = useRequestAlert();

  const refresh = async () => showRequestAlert(await load());

  return (
    <PageLayout backTo={ROUTES.dashboard} id="monitoring" title={t('monitoring-overview')}>
      {!loaded && (
        <p role="status" aria-busy="true">
          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
          {t('loading', 'Loading...')}
        </p>
      )}
      {loaded && allDenied && <PermissionDenied actionKey="monitoring" onRetry={load} />}
      {showData && (
        <>
          <MonitoringDenied denied={denied} />
          <MonitoringCounts data={data} />
          <MonitoringTabs data={data} id="user-monitoring-types" />
        </>
      )}
      <Row>
        <Col xs={12}>
          <RequestAlert alert={requestAlert} />
        </Col>
      </Row>
      {showData && <RefreshButton onClick={refresh} />}
    </PageLayout>
  );
}

export default MonitoringUser;
