import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Header from '../components/header';

import { validateEmail } from '../api/users';

const REDIRECT_DELAY = 4000;

function Registration() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ visible: false, success: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTimer = useRef(null);

  useEffect(() => () => clearTimeout(redirectTimer.current), []);

  const showAlert = (success) => {
    setAlert({ visible: true, success });

    if (success) {
      clearTimeout(redirectTimer.current);
      redirectTimer.current = setTimeout(() => {
        navigate('/');
      }, REDIRECT_DELAY);
    }
  };
  const registrationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('error-email-format', 'Enter a valid email address, e.g. name@example.com.'))
      .required(t('error-email-required', 'Email is required.')),
    registrationCode: Yup.string().required(t('error-user-code', 'Registration code is required')),
  });

  const registerUser = async ({ email, registrationCode }) => {
    setIsSubmitting(true);
    setAlert({ visible: false, success: false });

    try {
      const response = await validateEmail({
        email,
        registration_code: registrationCode,
      });

      showAlert(response.status === 200);
    } catch (error) {
      console.error(error);
      showAlert(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="registration">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12}>
            <h2>{t('validate-registration')}</h2>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Col xs={12}>
          <Formik
            initialValues={{ email: '', registrationCode: '' }}
            validationSchema={registrationSchema}
            onSubmit={registerUser}
          >
            {({ isValid, dirty }) => (
              <Form>
                <ReactBootstrap.Row>
                  <ReactBootstrap.Col xs={12}>
                    <label htmlFor="email">{t('email')}</label>
                  </ReactBootstrap.Col>
                  <ReactBootstrap.Col xs={12}>
                    <Field type="text" id="email" name="email" className="form-control" />
                  </ReactBootstrap.Col>
                  <ReactBootstrap.Col xs={12}>
                    <div className="error-text">
                      <ErrorMessage name="email" />
                    </div>
                  </ReactBootstrap.Col>

                  <ReactBootstrap.Col xs={12}>
                    <label htmlFor="registrationCode">{t('user-code')}</label>
                  </ReactBootstrap.Col>
                  <ReactBootstrap.Col xs={12}>
                    <Field type="text" id="registrationCode" name="registrationCode" className="form-control" />
                  </ReactBootstrap.Col>
                  <ReactBootstrap.Col xs={12}>
                    <div className="error-text">
                      <ErrorMessage name="registrationCode" />
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
        </ReactBootstrap.Col>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={12} lg={4} xl={4}>
            <Link to="/" className="link-daas-design">
              <div>{t('back-link')}</div>
            </Link>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12}>
            <div className={alert.visible ? 'show-alert' : 'hide-alert'} role="alert" aria-live="polite">
              <div className={alert.success ? 'request-success-alert' : 'request-fail-alert'}>
                {alert.success ? t('request-successful') : t('request-failed')}
              </div>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>
      </ReactBootstrap.Container>
    </>
  );
}

export default Registration;
