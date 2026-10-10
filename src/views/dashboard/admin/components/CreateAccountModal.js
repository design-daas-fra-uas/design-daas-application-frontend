import React, { useMemo } from 'react';
import { Alert, Button, Col, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import FormField from '../../../../components/FormField';
import { emailSchema, newPasswordSchema } from '../../../../utils/validation';

// Value of the group select while no group is chosen.
const NO_GROUP = '0';

function AccountForm({ idSuffix, initialValues, validationSchema, onSubmit, children }) {
  const { t } = useTranslation();

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ isValid, dirty, isSubmitting }) => (
        <Form>
          <Row>
            <FormField name="name" label={t('username')} htmlFor={`username${idSuffix}`} />
            <FormField name="email" label={t('email')} htmlFor={`email${idSuffix}`} />
            <FormField name="password" label={t('password')} htmlFor={`password${idSuffix}`} type="password" />
            <Col xs={12}>
              <div>{t('password-detail-info')}</div>
            </Col>
            {children}
          </Row>
          <Row>
            <Col xs={12}>
              <Button type="submit" variant="primary" className="submit-full-width" disabled={!isValid || !dirty || isSubmitting}>
                {t('submit')}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
}

// Modal with a "user" and an "admin" tab to create a new account.
function CreateAccountModal({ show, onHide, error, groups, onCreateUser, onCreateAdmin }) {
  const { t } = useTranslation();

  const adminSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('error-username-required', 'Username is required.')),
        email: emailSchema(t),
        password: newPasswordSchema(t),
      }),
    [t]
  );

  const userSchema = useMemo(
    () =>
      adminSchema.shape({
        group: Yup.string()
          .notOneOf([NO_GROUP], t('error-group-required', 'Group is required.'))
          .required(t('error-group-required', 'Group is required.')),
      }),
    [adminSchema, t]
  );

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('create-user')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" role="alert">{t('request-failed', 'The request failed. Please try again.')}</Alert>}
        <Tabs defaultActiveKey="user" id="user-admin-creator">
          <Tab eventKey="user" title={t('user')}>
            <AccountForm
              idSuffix=""
              initialValues={{ name: '', email: '', password: '', group: NO_GROUP }}
              validationSchema={userSchema}
              onSubmit={onCreateUser}
            >
              <FormField name="group" label={t('group')} htmlFor="group" as="select">
                <option value={NO_GROUP}>{t('select-group')}</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.description}
                  </option>
                ))}
              </FormField>
            </AccountForm>
          </Tab>
          <Tab eventKey="admin" title={t('admin')}>
            <AccountForm
              idSuffix="-admin"
              initialValues={{ name: '', email: '', password: '' }}
              validationSchema={adminSchema}
              onSubmit={onCreateAdmin}
            />
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default CreateAccountModal;