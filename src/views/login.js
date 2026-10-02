import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Header from '../components/header';

import { loginWithPassword } from '../api/auth';
import { clearSession, getRole, scheduleTokenRefresh, setSession } from '../auth/tokenManager';

const LOGIN_TABS = [
  { key: 'user', labelKey: 'user', role: 'user' },
  { key: 'admin', labelKey: 'admin', role: 'admin' },
];

const redirectToDashboard = (navigate) => {
  setTimeout(() => {
    navigate('/dashboard');
  }, 1000);
};

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getRole()) {
      navigate('/dashboard');
      return;
    }

    setActiveTab('user');
  }, [navigate]);

  useEffect(() => {
    const stopRefreshTimer = scheduleTokenRefresh(() => {
      setTimeout(() => {
        navigate('/');
      }, 1000);
    });

    return stopRefreshTimer;
  }, [navigate]);

  const getLoginSchema = () =>
    Yup.object().shape({
      username: Yup.string()
        .trim()
        .required(`${t('username')} is required`)
        .min(3, `${t('username')} is invalid`),
      password: Yup.string()
        .trim()
        .required(`${t('password')} is required`)
        .min(4, `${t('password')} is invalid`),
    });

  const loginWithRole = async ({ username, password }, role) => {
    setIsSubmitting(true);

    try {
      const response = await loginWithPassword({ username, password });

      if (response.status === 200) {
        setSession({
          tokenType: response.data.token_type,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          role,
        });
        redirectToDashboard(navigate);
      }
    } catch (error) {
      console.error(error);
      clearSession();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderLoginForm = ({ role }) => (
    <Formik
      key={role}
      initialValues={{ username: '', password: '' }}
      validationSchema={getLoginSchema()}
      onSubmit={(values) => loginWithRole(values, role)}
    >
      {({ isValid, dirty }) => (
        <Form>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col xs={12}>
              <label htmlFor={`${role}-username`}>{t('username')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12}>
              <Field
                id={`${role}-username`}
                name="username"
                type="text"
                className="form-control"
              />
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12}>
              <div className="error-text">
                <ErrorMessage name="username" />
              </div>
            </ReactBootstrap.Col>

            <ReactBootstrap.Col xs={12}>
              <label htmlFor={`${role}-password`}>{t('password')}</label>
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12}>
              <Field
                id={`${role}-password`}
                name="password"
                type="password"
                className="form-control"
              />
            </ReactBootstrap.Col>
            <ReactBootstrap.Col xs={12}>
              <div className="error-text">
                <ErrorMessage name="password" />
              </div>
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>

          <ReactBootstrap.Row>
            <ReactBootstrap.Col xs={12}>
              <ReactBootstrap.Button
                type="submit"
                variant="primary"
                id="submit"
                disabled={!isValid || !dirty || isSubmitting}
              >
                {isSubmitting ? t('loading') || 'Loading...' : t('submit')}
              </ReactBootstrap.Button>
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        </Form>
      )}
    </Formik>
  );

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="login">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12}>
            <h2>{t('login')}</h2>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Tabs activeKey={activeTab} onSelect={(tabKey) => setActiveTab(tabKey)}>
          {LOGIN_TABS.map(({ key, labelKey, role }) => (
            <ReactBootstrap.Tab key={key} eventKey={key} title={t(labelKey)}>
              {activeTab === key && renderLoginForm({ role })}
            </ReactBootstrap.Tab>
          ))}
        </ReactBootstrap.Tabs>

        {activeTab === 'user' && (
          <ReactBootstrap.Row>
            <ReactBootstrap.Col xs={12}>
              <Link to="/registration" className="link-daas-design">
                <div>{t('validate-registration')}</div>
              </Link>
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        )}
      </ReactBootstrap.Container>
    </>
  );
}

export default Login;
