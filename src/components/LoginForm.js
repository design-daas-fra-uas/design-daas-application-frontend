import React, { useMemo, useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import FormField from './FormField';

// Credentials form of one login tab. `onLogin(values)` must throw when the
// login fails; the error message is shown (and reset) inside this form.
function LoginForm({ role, onLogin }) {
  const { t } = useTranslation();
  const [loginError, setLoginError] = useState('');

  const schema = useMemo(
    () =>
      Yup.object().shape({
        username: Yup.string()
          .trim()
          .required(t('error-username-required', 'Username is required.')),
        password: Yup.string().required(t('error-password-required', 'Password is required.')),
      }),
    [t]
  );

  const handleSubmit = async (values) => {
    setLoginError('');
    try {
      await onLogin({ ...values, username: values.username.trim() });
    } catch (error) {
      console.error(error);
      const status = error?.response?.status;
      setLoginError(
        status === 400 || status === 401
          ? t('login-error-credentials', 'Incorrect username or password.')
          : t('login-error-generic', 'Login failed. Please try again later.')
      );
    }
  };

  return (
    <Formik initialValues={{ username: '', password: '' }} validationSchema={schema} onSubmit={handleSubmit}>
      {({ isValid, dirty, isSubmitting }) => (
        <Form>
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Row>
            <FormField name="username" label={t('username')} htmlFor={`${role}-username`} />
            <FormField name="password" label={t('password')} htmlFor={`${role}-password`} type="password" />
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
  );
}

export default LoginForm;