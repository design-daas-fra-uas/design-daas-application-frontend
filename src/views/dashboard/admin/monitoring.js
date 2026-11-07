import { useState } from 'react';
import { Button, Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import BackLink from '../../../components/BackLink';
import PageLayout from '../../../components/PageLayout';
import RefreshButton from '../../../components/RefreshButton';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import { ROUTES } from '../../../routes';
import { MonitoringCounts, MonitoringTabs } from '../monitoring/MonitoringSections';
import useMonitoring from '../monitoring/useMonitoring';

// Monitoring for admins: their own data, everyone's data, and the data of one
// owner looked up by id.
function Monitoring() {
  const { t } = useTranslation();
  const user = useMonitoring('user');
  const admin = useMonitoring('admin');
  const owner = useMonitoring('owner', { autoLoad: false });
  const [ownerId, setOwnerId] = useState('');
  const { requestAlert, showRequestAlert } = useRequestAlert();

  const refresh = async () => {
    const results = await Promise.all([user.load(), admin.load()]);
    showRequestAlert(results.every(Boolean));
  };

  const searchOwner = async (event) => {
    event.preventDefault();
    showRequestAlert(await owner.load(ownerId.trim()));
  };

  return (
    <PageLayout id="monitoring" title={t('monitoring-overview')} wrapTitle>
      <Tabs defaultActiveKey="user" id="monitoring-scopes">
        <Tab eventKey="user" title={t('user')}>
          <MonitoringCounts data={user.data} />
          <MonitoringTabs data={user.data} id="user-monitoring-types" />
        </Tab>
        <Tab eventKey="admin" title={t('admin')}>
          <MonitoringCounts data={admin.data} />
          <MonitoringTabs data={admin.data} id="admin-monitoring-types" />
        </Tab>
        <Tab eventKey="owner" title={t('search-owner')}>
          <Form onSubmit={searchOwner} className="form-monitoring-data">
            <Row>
              <Col xs={12} md={6}>
                <label htmlFor="monitoring-owner-id">{t('vm-id-owner')}</label>
              </Col>
              <Col xs={12} md={6}>
                <input
                  type="text"
                  id="monitoring-owner-id"
                  value={ownerId}
                  onChange={(event) => setOwnerId(event.target.value)}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Button type="submit" variant="primary" id="submit" disabled={!ownerId.trim()}>
                  {t('submit')}
                </Button>
              </Col>
            </Row>
          </Form>
          {owner.loaded && <MonitoringTabs data={owner.data} id="owner-monitoring-types" />}
        </Tab>
      </Tabs>
      <Row>
        <Col xs={12}>
          <RequestAlert alert={requestAlert} />
        </Col>
      </Row>
      <Row>
        <BackLink to={ROUTES.admin.root} />
      </Row>
      <RefreshButton onClick={refresh} />
    </PageLayout>
  );
}

export default Monitoring;
