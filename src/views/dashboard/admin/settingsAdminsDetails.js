import React, { useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '../../../components/header';

import { getAdmins } from '../../../api/admins';

function SettingsAdminsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [adminUserData, setAdminUserData] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;
    setAdminUserData(null);
    setStatus('loading');

    getAdmins()
      .then((admins) => {
        if (!isMounted) {
          return;
        }

        const admin = admins.find((candidate) => candidate.name === id);
        setAdminUserData(admin ?? null);
        setStatus(admin ? 'found' : 'not-found');
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          setStatus('error');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const backToDashboard = () => {
    navigate('/dashboard/admin/settings/admins');
  };

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="settingsOverviewAdmins">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} className="text-center">
            <h2>{t('user-management')}</h2>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12}>
            {status === 'loading' && <p>{t('loading', 'Loading...')}</p>}
            {status === 'not-found' && <p role="alert">{t('admin-not-found', 'Administrator not found.')}</p>}
            {status === 'error' && <p role="alert">{t('load-error', 'Could not load the data. Please try again.')}</p>}
            {status === 'found' && (
            <ul>
              <li>
                <span>
                  {t('username')}: {adminUserData?.name}
                </span>
              </li>
              <li>
                <span>
                  {t('email')}: {adminUserData?.email}
                </span>
              </li>
            </ul>
            )}
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
            <div className="link-daas-design" role="button" tabIndex={0} onClick={backToDashboard} onKeyDown={(e) => e.key === 'Enter' && backToDashboard()}>
              <div>{t('back-link')}</div>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
    </>
  );
}

export default SettingsAdminsDetails;
