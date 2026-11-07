import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import BackLink from '../../../components/BackLink';
import PageLayout from '../../../components/PageLayout';
import RefreshButton from '../../../components/RefreshButton';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import { ROUTES } from '../../../routes';
import { MonitoringCounts, MonitoringTabs } from '../monitoring/MonitoringSections';
import useMonitoring from '../monitoring/useMonitoring';

// Monitoring of the logged-in user's own tasks, files, apps and resources.
function MonitoringUser() {
  const { t } = useTranslation();
  const { data, load } = useMonitoring('user');
  const { requestAlert, showRequestAlert } = useRequestAlert();

  const refresh = async () => showRequestAlert(await load());

  return (
    <PageLayout id="monitoring" title={t('monitoring-overview')} wrapTitle>
      <MonitoringCounts data={data} />
      <MonitoringTabs data={data} id="user-monitoring-types" />
      <Row>
        <Col xs={12}>
          <RequestAlert alert={requestAlert} />
        </Col>
      </Row>
      <Row>
        <BackLink to={ROUTES.dashboard} />
      </Row>
      <RefreshButton onClick={refresh} />
    </PageLayout>
  );
}

export default MonitoringUser;
