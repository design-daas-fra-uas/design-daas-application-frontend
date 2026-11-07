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

function SectionTitle({ children }) {
  return (
    <Col xs={12} className="text-left">
      <h3>{children}</h3>
    </Col>
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
      position: 'bottom-footer-fix-monitoring',
      icon: 'fa-gear',
      label: 'monitoring',
      onClick: () => navigate(ROUTES.user.monitoring),
    },
    { position: 'bottom-footer-fix-refresh', icon: 'fa-arrows-rotate', label: 'refresh', onClick: reload },
    {
      position: 'bottom-footer-fix-info',
      icon: 'fa-circle-info',
      label: 'info-detail',
      onClick: () => setOpenModal('info'),
    },
    {
      position: 'bottom-footer-fix-file',
      icon: 'fa-file',
      label: 'all-available-files',
      onClick: () => setOpenModal('files'),
    },
    {
      position: 'bottom-footer-fix-contact',
      icon: 'fa-envelope',
      label: 'request-app',
      onClick: () => setOpenModal('request'),
    },
    {
      position: 'bottom-footer-fix',
      icon: 'fa-circle-plus',
      label: 'create-update-share-data',
      onClick: () => setOpenModal('create'),
    },
  ].filter(Boolean);

  return (
    <>
      <Header connections={dashboard.connections} />
      <Container id="dashboardUser">
        <Row>
          <Col xs={12} className="text-center">
            <h2>{t('overview')}</h2>
          </Col>
        </Row>
        {role === 'admin' && (
          <Col xs={12} className="text-center">
            <Button variant="primary" onClick={() => navigate(ROUTES.admin.root)}>
              {t('go-to-admin-dashboard')}
            </Button>
          </Col>
        )}
        {info ? (
          <Row id="dashboard_info_details">
            <UsageSummary utilized={info.utilized_ressources} available={info.available_ressources} />
            <SectionTitle>{t('available_objects')}</SectionTitle>
            <ObjectControls objects={dashboard.objects} instances={dashboard.instances} run={run} reload={reload} />
            <SectionTitle>{t('available_environments')}</SectionTitle>
            <EnvironmentControls environments={dashboard.environments} run={run} reload={reload} />
            <SectionTitle>{t('available_applications')}</SectionTitle>
            <ApplicationList apps={dashboard.ownApps} onOpen={openApplication} />
          </Row>
        ) : (
          <Row>
            <Col xs={12} className="text-center">
              {t('no-data-available')}
            </Col>
          </Row>
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
