import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Header from '../components/header';
import LoginForm from '../components/LoginForm';
import PageLink from '../components/PageLink';
import { ROUTES } from '../routes';

import { loginWithPassword } from '../api/auth';
import { clearSession, getRole, setSession } from '../auth/tokenManager';

const ROLES = ['user', 'admin'];

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
          {ROLES.map((role) => (
            <Tab key={role} eventKey={role} title={t(role)}>
              {activeTab === role && <LoginForm key={role} role={role} onLogin={(values) => loginWithRole(values, role)} />}
            </Tab>
          ))}
        </Tabs>

        {activeTab === 'user' && (
          <Row>
            <Col xs={12}>
              <PageLink to={ROUTES.registration}>{t('validate-registration')}</PageLink>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}

export default Login;