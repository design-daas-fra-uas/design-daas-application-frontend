import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Header from '../components/header';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (getRole()) {
      navigate('/dashboard', { replace: true });
      return;
    }

    setActiveTab('user');
  }, [navigate]);


  const getLoginSchema = () =>
    Yup.object().shape({
      username: Yup.string()
        .trim()
        .required(t('error-username-required', 'Username is required.')),
      password: Yup.string().required(t('error-password-required', 'Password is required.')),
    });

  const loginWithRole = async ({ username, password }, role) => {
    setIsSubmitting(true);
    setLoginError('');

    try {
      const response = await loginWithPassword({ username, password });

      if (response.status === 200) {
        setSession({
          tokenType: response.data.token_type,
          accessToken: response.data.access_token,
          refreshToken: response.data.refresh_token,
          role,
        });
        navigate('/dashboard', { replace: true });
        return;
      } else {
        clearSession();
        setLoginError(t('login-error-generic', 'Login failed. Please try again later.'));
      }
    } catch (error) {
      console.error(error);
      clearSession();
      const status = error?.response?.status;
      setLoginError(
        status === 400 || status === 401
          ? t('login-error-credentials', 'Incorrect username or password.')
          : t('login-error-generic', 'Login failed. Please try again later.')
      );
    }

    setIsSubmitting(false);
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
          <div role="alert" aria-live="assertive">
            {loginError && (
              <ReactBootstrap.Alert variant="danger">{loginError}</ReactBootstrap.Alert>
            )}
          </div>
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
                {isSubmitting ? t('loading', 'Loading...') : t('submit')}
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

        <ReactBootstrap.Tabs activeKey={activeTab} onSelect={(tabKey) => {
            setLoginError('');
            setActiveTab(tabKey);
          }}>
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
