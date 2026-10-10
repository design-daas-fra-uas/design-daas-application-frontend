import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Header from '../components/header';
import LoginForm from '../components/LoginForm';
import { ROUTES } from '../routes';

import { loginWithPassword } from '../api/auth';
import { clearSession, getRole, setSession } from '../auth/tokenManager';

const LOGIN_TABS = [
  { key: 'user', labelKey: 'user', role: 'user' },
  { key: 'admin', labelKey: 'admin', role: 'admin' },
];

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    if (getRole()) {
      navigate(ROUTES.dashboard, { replace: true });
    }
  }, [navigate]);

  const loginWithRole = async ({ username, password }, role) => {
    try {
      const response = await loginWithPassword({ username, password, role });
      setSession({
        tokenType: response.data.token_type,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        role,
      });
    } catch (error) {
      clearSession();
      throw error;
    }
    navigate(ROUTES.dashboard, { replace: true });
  };

  return (
    <>
      <Header />
      <Container id="login">
        <Row>
          <Col xs={12}>
            <h2>{t('login')}</h2>
          </Col>
        </Row>

        <Tabs activeKey={activeTab} onSelect={setActiveTab}>
          {LOGIN_TABS.map(({ key, labelKey, role }) => (
            <Tab key={key} eventKey={key} title={t(labelKey)}>
              {activeTab === key && <LoginForm key={role} role={role} onLogin={(values) => loginWithRole(values, role)} />}
            </Tab>
          ))}
        </Tabs>

        {activeTab === 'user' && (
          <Row>
            <Col xs={12}>
              <Link to={ROUTES.registration} className="link-daas-design">
                <div>{t('validate-registration')}</div>
              </Link>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default Login;