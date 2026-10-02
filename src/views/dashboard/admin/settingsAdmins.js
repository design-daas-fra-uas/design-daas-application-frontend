import React, { useEffect, useState } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Header from '../../../components/header';
import EntityPreviewList from '../../../components/EntityPreviewList';
import FormField from '../../../components/FormField';

import { getAdmins } from '../../../api/admins';

function SettingsAdmins() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [allAdmins, setAllAdmins] = useState([]);
  const [createUserModal, setCreateUserModal] = useState(false);
  const [getUserDataModal, setGetUserDataModal] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [userDataID, setUserDataID] = useState('');
  const [userDataEmail, setUserDataEmail] = useState('');

  useEffect(() => {
    getAdmins()
      .then(setAllAdmins)
      .catch((error) => console.error(error));
  }, []);

  const closeCreateUserModal = () => setCreateUserModal(false);

  const openGetUserModal = (id, email) => {
    setUserDataID(id);
    setUserDataEmail(email);
    setGetUserDataModal(true);
  };
  const closeGetUserModal = () => {
    setGetUserDataModal(false);
    setUserDataID('');
    setUserDataEmail('');
  };

  // Reserved for a future delete-admin action (disabled in the original UI pending a delete API).
  // eslint-disable-next-line no-unused-vars
  const openDeleteUserModal = (id) => {
    setUserDataID(id);
    setDeleteUserModal(true);
  };
  const closeDeleteUserModal = () => {
    setDeleteUserModal(false);
    setUserDataID('');
  };

  const goToSettingsUser = (id) => {
    navigate(`/dashboard/admin/settings/admins/${id}`);
  };

  const backToDashboard = () => {
    navigate('/dashboard/admin');
  };

  const createUserSchema = Yup.object().shape({
    username: Yup.string().required(t('error-username') || 'Username is required'),
    password: Yup.string().required(t('error-password') || 'Password is required'),
    fullname: Yup.string().required(t('error-fullname') || 'Fullname is required'),
    email: Yup.string().email(t('error-email') || 'Invalid email').required(t('error-email') || 'Email is required'),
  });

  // NOTE: no backend endpoint accepts a separate "fullname" alongside admin
  // creation today (see mainAdmin.js, which only sends name/email/password).
  // Until that's clarified, this form validates client-side but does not
  // submit, matching the previous behavior. Its trigger remains disabled below.
  const submitCreateUser = (values, { setSubmitting }) => {
    console.log('Create admin (not wired to an API yet):', values);
    setSubmitting(false);
    closeCreateUserModal();
  };

  return (
    <>
      <Header />
      <ReactBootstrap.Container id="dashboardAdminSettingsAdmin">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} className="text-center">
            <h2>{t('user-management')}</h2>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12}>
            <h4>{t('admins')}</h4>
          </ReactBootstrap.Col>
          <ReactBootstrap.Col xs={12}>
            <EntityPreviewList
              items={allAdmins}
              onSettings={(admin) => goToSettingsUser(admin.name)}
              onInfo={(admin) => openGetUserModal(admin.name, admin.email)}
            />
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
            <div className="link-daas-design" onClick={backToDashboard}>
              <div>{t('back-link')}</div>
            </div>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Modal show={createUserModal} onHide={closeCreateUserModal} size="md" centered>
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>{t('create-user')}</ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <Formik
              initialValues={{ username: '', password: '', fullname: '', email: '' }}
              validationSchema={createUserSchema}
              onSubmit={submitCreateUser}
            >
              {({ isValid, dirty }) => (
                <Form>
                  <ReactBootstrap.Row>
                    <FormField name="username" label={t('username')} />
                    <FormField name="password" label={t('password')} type="password" />
                    <FormField name="fullname" label={t('fullname')} />
                    <FormField name="email" label={t('email')} />
                  </ReactBootstrap.Row>
                  <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12}>
                      <ReactBootstrap.Button type="submit" variant="primary" id="submit" disabled={!isValid || !dirty}>
                        {t('submit')}
                      </ReactBootstrap.Button>
                    </ReactBootstrap.Col>
                  </ReactBootstrap.Row>
                </Form>
              )}
            </Formik>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>

        <ReactBootstrap.Modal show={getUserDataModal} onHide={closeGetUserModal} size="lg" centered>
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>
              {userDataID} - {t('information')}
            </ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <ReactBootstrap.Row>
              <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                {t('email')}
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                {userDataEmail}
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                {t('fullname')}
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                {userDataID}
              </ReactBootstrap.Col>
            </ReactBootstrap.Row>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>

        {/* TODO: wire up a real delete-admin API call once the endpoint is available. */}
        <ReactBootstrap.Modal show={deleteUserModal} onHide={closeDeleteUserModal} size="md" centered>
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>
              {userDataID} - {t('delete')}
            </ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <ReactBootstrap.Row>
              <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <ReactBootstrap.Button variant="primary" onClick={closeDeleteUserModal}>
                  {t('no')}
                </ReactBootstrap.Button>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <ReactBootstrap.Button variant="danger" onClick={closeDeleteUserModal}>
                  {t('yes')}
                </ReactBootstrap.Button>
              </ReactBootstrap.Col>
            </ReactBootstrap.Row>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>
      </ReactBootstrap.Container>
    </>
  );
}

export default SettingsAdmins;
