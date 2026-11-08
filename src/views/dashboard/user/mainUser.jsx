import { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { getRole } from '../../../auth/tokenManager';
import Header from '../../../components/header';
import RequestAlert from '../../../components/RequestAlert';
import useRequestAlert from '../../../hooks/useRequestAlert';
import { ROUTES } from '../../../routes';
import ApplicationList from './dashboard/ApplicationList';
import CreateModal from './dashboard/CreateModal';
import DashboardToolbar from './dashboard/DashboardToolbar';
import EnvironmentControls from './dashboard/EnvironmentControls';
import FilesModal from './dashboard/FilesModal';
import InfoModal from './dashboard/InfoModal';
import { navigateLater } from './dashboard/navigation';
import ObjectControls from './dashboard/ObjectControls';
import RequestAppModal from './dashboard/RequestAppModal';
import UsageSummary from './dashboard/UsageSummary';
import useDashboardRequest from './dashboard/useDashboardRequest';
import useUserDashboard from './dashboard/useUserDashboard';

// White card with a heading, used for each dashboard section.
function Panel({ title, children }) {
  return (
    <section className="panel">
      <h3 className="panel-title">{title}</h3>
      {children}
    </section>
  );
}

// The user's dashboard: resource usage, objects, environments and applications,
// plus modals to create things, request apps and browse files.
function MainUser() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requestAlert, showRequestAlert } = useRequestAlert();
  const run = useDashboardRequest(showRequestAlert);
  const dashboard = useUserDashboard();
  const { info, reload } = dashboard;
  const [openModal, setOpenModal] = useState(null);
  const role = getRole();

  const closeModal = () => setOpenModal(null);

  // Starts an application ("clone" or "create") on the application viewer page.
  const openApplication = (appId, option) => {
    localStorage.setItem('app-data', appId);
    localStorage.setItem('app-data-option', option);
    navigateLater(navigate, ROUTES.user.applicationRun);
  };

  const toolbar = [
    role === 'user' && {
      name: 'monitoring',
      icon: 'fa-gear',
      label: 'monitoring',
      onClick: () => navigate(ROUTES.user.monitoring),
    },
    {
      name: 'quota',
      icon: 'fa-gauge',
      label: 'quota-title',
      onClick: () => navigate(ROUTES.user.quota),
    },
    { name: 'refresh', icon: 'fa-arrows-rotate', label: 'refresh', onClick: reload },
    {
      name: 'info',
      icon: 'fa-circle-info',
      label: 'info-detail',
      onClick: () => setOpenModal('info'),
    },
    {
      name: 'file',
      icon: 'fa-file',
      label: 'all-available-files',
      onClick: () => setOpenModal('files'),
    },
    {
      name: 'contact',
      icon: 'fa-envelope',
      label: 'request-app',
      onClick: () => setOpenModal('request'),
    },
    {
      name: 'create',
      icon: 'fa-circle-plus',
      label: 'create-update-share-data',
      onClick: () => setOpenModal('create'),
    },
  ].filter(Boolean);

  return (
    <>
      <Header connections={dashboard.connections} />
      <Container id="dashboardUser" className="page page-with-toolbar">
        <Row>
          <Col xs={12} className="text-center">
            <h2 className="page-title">{t('overview')}</h2>
          </Col>
        </Row>
        {role === 'admin' && (
          <div className="page-actions">
            <Button variant="outline-primary" onClick={() => navigate(ROUTES.admin.root)}>
              {t('go-to-admin-dashboard')}
            </Button>
          </div>
        )}
        {info ? (
          <div id="dashboard_info_details">
            <UsageSummary utilized={info.utilized_ressources} available={info.available_ressources} />
            <Panel title={t('available_objects')}>
              <ObjectControls objects={dashboard.objects} instances={dashboard.instances} run={run} reload={reload} />
            </Panel>
            <Panel title={t('available_environments')}>
              <EnvironmentControls environments={dashboard.environments} run={run} reload={reload} />
            </Panel>
            <Panel title={t('available_applications')}>
              <ApplicationList apps={dashboard.ownApps} onOpen={openApplication} />
            </Panel>
          </div>
        ) : (
          <p className="empty-state">{t('no-data-available')}</p>
        )}
        <DashboardToolbar buttons={toolbar} />
        <InfoModal show={openModal === 'info'} onHide={closeModal} />
        <CreateModal
          show={openModal === 'create'}
          onHide={closeModal}
          sharedApps={dashboard.sharedApps}
          onOpenApp={openApplication}
          showRequestAlert={showRequestAlert}
          onChanged={reload}
        />
        <RequestAppModal show={openModal === 'request'} onHide={closeModal} run={run} />
        <FilesModal
          show={openModal === 'files'}
          onHide={closeModal}
          ownFiles={dashboard.ownFiles}
          sharedFiles={dashboard.sharedFiles}
          run={run}
        />
        <Row>
          <Col xs={12}>
            <RequestAlert alert={requestAlert} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MainUser;
