import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import BackLink from '../components/BackLink';
import FormField from '../components/FormField';
import Header from '../components/header';
import { ROUTES } from '../routes';

import { validateEmail } from '../api/users';

const REDIRECT_DELAY = 4000;
const INITIAL_VALUES = { email: '', registrationCode: '' };

function Registration() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ visible: false, success: false });

  // Send the user back to the login page shortly after a successful validation.
  useEffect(() => {
    if (!feedback.success) {
      return undefined;
    }
    const timer = setTimeout(() => navigate(ROUTES.login), REDIRECT_DELAY);
    return () => clearTimeout(timer);
  }, [feedback.success, navigate]);

  const registrationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string()
          .email(t('error-email-format', 'Enter a valid email address, e.g. name@example.com.'))
          .required(t('error-email-required', 'Email is required.')),
        registrationCode: Yup.string().required(t('error-user-code', 'Registration code is required')),
      }),
    [t]
  );

  const registerUser = async ({ email, registrationCode }) => {
    setFeedback({ visible: false, success: false });

    try {
      const response = await validateEmail({
        email,
        registration_code: registrationCode,
      });
      setFeedback({ visible: true, success: response.status === 200 });
    } catch (error) {
      console.error(error);
      setFeedback({ visible: true, success: false });
    }
  };

  return (
    <>
      <Header />
      <Container id="registration">
        <Row>
          <Col xs={12}>
            <h2>{t('validate-registration')}</h2>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Formik initialValues={INITIAL_VALUES} validationSchema={registrationSchema} onSubmit={registerUser}>
              {({ isValid, dirty, isSubmitting }) => (
                <Form noValidate>
                  <Row>
                    <FormField name="email" label={t('email')} type="email" />
                    <FormField name="registrationCode" label={t('user-code')} />
                  </Row>

                  <Row>
                    <Col xs={12}>
                      <Button type="submit" variant="primary" className="submit-full-width" disabled={!isValid || !dirty || isSubmitting}>
                        {isSubmitting ? t('loading', 'Loading...') : t('submit')}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>

        <Row>
          <BackLink to={ROUTES.login} />
        </Row>

        <Row>
          <Col xs={12}>
            <div className={feedback.visible ? 'show-alert' : 'hide-alert'} role="alert" aria-live="polite">
              <div className={feedback.success ? 'request-success-alert' : 'request-fail-alert'}>
                {feedback.success ? t('request-successful') : t('request-failed')}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Registration;