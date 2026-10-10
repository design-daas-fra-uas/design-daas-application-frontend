import React, { useCallback, useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Header from '../../../components/header';
import EntityPreviewList from '../../../components/EntityPreviewList';

import { getAdmins } from '../../../api/admins';

function SettingsAdmins() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [allAdmins, setAllAdmins] = useState([]);
  const [loadStatus, setLoadStatus] = useState('loading');
  const [getUserDataModal, setGetUserDataModal] = useState(false);
  const [userDataID, setUserDataID] = useState('');
  const [userDataEmail, setUserDataEmail] = useState('');

  const fetchAdmins = useCallback(() => {
    setLoadStatus('loading');
    getAdmins()
      .then((admins) => {
        setAllAdmins(admins);
        setLoadStatus('loaded');
      })
      .catch((error) => {
        console.error(error);
        setLoadStatus('error');
      });
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const openGetUserModal = (id, email) => {
    setUserDataID(id);
    setUserDataEmail(email);
    setGetUserDataModal(true);
  };
  const closeGetUserModal = () => {
    setGetUserDataModal(false);
    setUserDataID('');
    setUserDataEmail('');
  };

  const goToSettingsUser = (id) => {
    navigate(`/dashboard/admin/settings/admins/${encodeURIComponent(id)}`);
  };

  const backToDashboard = () => {
    navigate('/dashboard/admin');
  };

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="dashboardAdminSettingsAdmin">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} className="text-center">
            <h2>{t('user-management')}</h2>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12}>
            <h4>{t('admins')}</h4>
          </ReactBootstrap.Col>
          <ReactBootstrap.Col xs={12}>
            {loadStatus === 'loading' && <p>{t('loading', 'Loading...')}</p>}
            {loadStatus === 'error' && (
              <ReactBootstrap.Alert variant="danger" role="alert">
                {t('load-error', 'Could not load the data. Please try again.')}{' '}
                <ReactBootstrap.Button variant="link" className="p-0 align-baseline" onClick={fetchAdmins}>
                  {t('retry', 'Retry')}
                </ReactBootstrap.Button>
              </ReactBootstrap.Alert>
            )}
            <EntityPreviewList
              items={allAdmins}
              onSettings={(admin) => goToSettingsUser(admin.name)}
              onInfo={(admin) => openGetUserModal(admin.name, admin.email)}
            />
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
            <div className="link-daas-design" role="button" tabIndex={0} onClick={backToDashboard} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && backToDashboard()}>
              <div>{t('back-link')}</div>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Modal show={getUserDataModal} onHide={closeGetUserModal} size="lg" centered>
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>
              {userDataID} - {t('information')}
            </ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <ReactBootstrap.Row>
              <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                {t('email')}
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                {userDataEmail}
              </ReactBootstrap.Col>
           </ReactBootstrap.Row>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>

      </ReactBootstrap.Container>
    </>
  );
}

export default SettingsAdmins;
