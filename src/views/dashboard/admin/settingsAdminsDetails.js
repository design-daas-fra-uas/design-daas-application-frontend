import React, { useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Header from '../../../components/header';

import { getAdmins } from '../../../api/admins';

function SettingsAdminsDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [adminUserData, setAdminUserData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getAdmins()
      .then((admins) => {
        if (!isMounted) {
          return;
        }

        const admin = admins.find((candidate) => candidate.name === id);
        setAdminUserData(admin ?? null);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const backToDashboard = () => {
    window.location.href = '/dashboard/admin/settings/admins';
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
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
            <div className="link-daas-design" onClick={backToDashboard}>
              <div>{t('back-link')}</div>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
    </>
  );
}

export default SettingsAdminsDetails;
