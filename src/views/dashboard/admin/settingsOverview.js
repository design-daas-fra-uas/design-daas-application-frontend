import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Header from "../../../components/header";

function SettingsOverview() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const goToSettingsChoice = (id) => {
    navigate("/dashboard/admin/settings/" + id);
  };

  return (
    <>
      <Header/>
      <ReactBootstrap.Container id="settingsOverview">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
            <div>
              <h2>
                {t('user-management')}
              </h2>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <div>
              <ul>
                <li>
                  <span>
                    {t('admins')}
                  </span>
                  <span>
                    <ReactBootstrap.Button type="submit" variant="primary" onClick={() => goToSettingsChoice("admins")}>
                      {t('choose')}
                    </ReactBootstrap.Button>
                  </span>
                </li>
                <li>
                  <span>
                    {t('users')}
                  </span>
                  <span>
                    <ReactBootstrap.Button type="submit" variant="primary" onClick={() => goToSettingsChoice("users")}>
                      {t('choose')}
                    </ReactBootstrap.Button>
                  </span>
                </li>
              </ul>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
    </>
  );
}

export default SettingsOverview;
