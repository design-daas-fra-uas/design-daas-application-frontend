import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Header from '../../../components/header';
import EntityPreviewList from '../../../components/EntityPreviewList';
import FormField from '../../../components/FormField';
import { emailSchema, newPasswordSchema } from '../../../utils/validation';

import { getAdmins, createAdmin } from '../../../api/admins';
import { getUsers, createUser } from '../../../api/users';
import { getUserGroups, createUserGroup, updateUserGroup } from '../../../api/userGroups';

// Quick-link tiles rendered at the bottom of the dashboard. Centralizing them
// here avoids ~150 lines of near-identical <Link> JSX blocks.
const QUICK_LINKS = [
  { to: '/dashboard/admin/settings/desktops', labelKeys: ['desktops'] },
  { to: '/dashboard/admin/settings/desktop-groups', labelKeys: ['desktop-groups'] },
  { to: '/dashboard/admin/monitoring', labelKeys: ['monitoring'] },
  { to: '/dashboard/admin/limitation', labelKeys: ['limitation'] },
  { to: '/dashboard/admin/tasks', labelKeys: ['tasks'] },
  { to: '/dashboard/admin/settings/vm-environment', labelKeys: ['vm-setup'] },
  { to: '/dashboard/admin/settings/node-configuration', labelKeys: ['vm-node-dhcp', 'vm-node-iptables'] },
  { to: '/dashboard/admin/settings/connections', labelKeys: ['viewer-check'] },
  { to: '/dashboard/admin/settings/instances', labelKeys: ['vm-instance'] },
  { to: '/dashboard/admin/settings/docker', labelKeys: ['vm-docker'] },
  { to: '/dashboard/admin/settings/phases', labelKeys: ['vm-phases'] },
  { to: '/dashboard/admin/settings/admin-assign', labelKeys: ['admin-assign-object-app'] },
  { to: '/dashboard/admin/settings/apps', labelKeys: ['app-configuration'] },
  { to: '/dashboard/admin/settings/files', labelKeys: ['file-configuration'] },
  { to: '/dashboard', labelKeys: ['dashboard-back'] },
];

const fetchAdmins = async () => (await getAdmins()).reverse();

const fetchUsers = async () => (await getUsers()).reverse();

const fetchGroups = async () => getUserGroups();

function MainAdmin() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [allAdmins, setAllAdmins] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [loadErrors, setLoadErrors] = useState([]);

  const [createUserModal, setCreateUserModal] = useState(false);
  const [createUpdateModal, setCreateUpdateModal] = useState(false);
  const [getUserDataModal, setGetUserDataModal] = useState(false);

  const [userDataID, setUserDataID] = useState('');
  const [userDataEmail, setUserDataEmail] = useState('');

  // Group currently picked in the "update group" select, used to prefill the
  // Formik form (via enableReinitialize) with that group's description.
  const [groupToUpdate, setGroupToUpdate] = useState(null);

  // Brief inline feedback shown after a create/update action, e.g. { text: 'group-created', success: true }.
  const [actionNotice, setActionNotice] = useState(null);

  const noticeTimer = useRef(null);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const showNotice = (notice, autoHide) => {
    clearTimeout(noticeTimer.current);
    setActionNotice(notice);
    if (autoHide) {
      noticeTimer.current = setTimeout(() => setActionNotice(null), 4000);
    }
  };

  const notifyAndCloseModal = (closeModal) => {
    showNotice({ text: 'request-successful', success: true }, true);
    closeModal();
  };

  const notifyError = () => {
    showNotice({ text: 'request-failed', success: false }, false);
  };

  const notifyRefreshError = () => {
    showNotice(
      { text: 'refresh-failed', fallback: 'Saved, but the list could not be refreshed. Please reload the data.', success: false },
      false
    );
  };

  // Each section loads independently so one failing request does not blank the others.
  const loadDashboardData = useCallback(async () => {
    setLoadErrors([]);
    const sections = [
      ['admins', fetchAdmins, setAllAdmins],
      ['users', fetchUsers, setAllUsers],
      ['groups', fetchGroups, setAllGroups],
    ];
    const results = await Promise.allSettled(sections.map(([, fetcher]) => fetcher()));
    const failed = [];
    results.forEach((result, index) => {
      const [name, , setter] = sections[index];
      if (result.status === 'fulfilled') {
        setter(result.value);
      } else {
        console.error(result.reason);
        failed.push(name);
      }
    });
    setLoadErrors(failed);
  }, []);
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const openCreateUserModal = () => setCreateUserModal(true);
  const closeCreateUserModal = () => setCreateUserModal(false);

  const openCreateUpdateModal = () => setCreateUpdateModal(true);
  const closeCreateUpdateModal = () => {
    setCreateUpdateModal(false);
    setGroupToUpdate(null);
  };

  const openGetUserModal = ({ name, email }) => {
    setUserDataID(name);
    setUserDataEmail(email);
    setGetUserDataModal(true);
  };
  const closeGetUserModal = () => {
    setGetUserDataModal(false);
    setUserDataID('');
    setUserDataEmail('');
  };

  const goToSettingsUser = (id) => {
    navigate(`/dashboard/admin/settings/users/${id}`);
  };
  const goToSettingsAdmin = (id) => {
    navigate(`/dashboard/admin/settings/admins/${encodeURIComponent(id)}`);
  };

  const onSelectGroupToUpdate = (event) => {
    const groupId = event.target.value;

    if (groupId === '0') {
      setGroupToUpdate(null);
      return;
    }

    const group = allGroups.find((candidate) => String(candidate.id) === groupId);
    setGroupToUpdate(group ?? null);
  };

  const createGroupSchema = Yup.object().shape({
    description: Yup.string().required(t('error-create-group-new', 'Description is required')),
  });

  const updateGroupSchema = Yup.object().shape({
    description: Yup.string().required(t('error-update-group-new', 'Description is required')),
  });

  const createUserSchema = Yup.object().shape({
    name: Yup.string().required(t('error-username-required', 'Username is required.')),
    email: emailSchema(t),
    password: newPasswordSchema(t),
    group: Yup.string().notOneOf(['0'], t('error-group-required', 'Group is required.')).required(t('error-group-required', 'Group is required.')),
  });

  const createAdminSchema = Yup.object().shape({
    name: Yup.string().required(t('error-username-required', 'Username is required.')),
    email: emailSchema(t),
    password: newPasswordSchema(t),
  });

  // Saving and refreshing are reported separately so a refresh failure is not shown as a failed save.
  const saveThenRefresh = async ({ save, refresh, onSaved, closeModal }) => {
    try {
      await save();
    } catch (error) {
      console.error(error);
      notifyError();
      return;
    }

    onSaved?.();
    try {
      await refresh();
      notifyAndCloseModal(closeModal);
    } catch (error) {
      console.error(error);
      closeModal();
      notifyRefreshError();
    }
  };

  const submitCreateGroup = ({ description }, { resetForm }) =>
    saveThenRefresh({
      save: () => createUserGroup({ description }),
      refresh: async () => setAllGroups(await fetchGroups()),
      onSaved: resetForm,
      closeModal: closeCreateUpdateModal,
    });

  const submitUpdateGroup = ({ description }) => {
    if (!groupToUpdate) {
      return undefined;
    }

    return saveThenRefresh({
      save: () => updateUserGroup(groupToUpdate.id, { description }),
      refresh: async () => setAllGroups(await fetchGroups()),
      closeModal: closeCreateUpdateModal,
    });
  };

  const submitCreateUser = ({ name, email, password, group }, { resetForm }) =>
    saveThenRefresh({
      save: () => createUser({ name, email, password, groups: [Number(group)] }),
      refresh: async () => setAllUsers(await fetchUsers()),
      onSaved: resetForm,
      closeModal: closeCreateUserModal,
    });

  const submitCreateAdmin = ({ name, email, password }, { resetForm }) =>
    saveThenRefresh({
      save: () => createAdmin({ name, email, password }),
      refresh: async () => setAllAdmins(await fetchAdmins()),
      onSaved: resetForm,
      closeModal: closeCreateUserModal,
    });

  const activateOnKey = (action) => (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };
  return (
    <>
      <Header />
      <ReactBootstrap.Container id="dashboardAdmin">
        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} className="text-center">
            <h2>{t('user-management')}</h2>
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12}>
            <ReactBootstrap.Row>
              <ReactBootstrap.Col xs={9}>
                <h4>{t('admins')}</h4>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={3} className="text-end text-decoration-underline all-data">
                <Link to="/dashboard/admin/settings/admins">
                  <h4>{t('all')}</h4>
                </Link>
              </ReactBootstrap.Col>
            </ReactBootstrap.Row>
          </ReactBootstrap.Col>
          <ReactBootstrap.Col xs={12}>
            <EntityPreviewList
              items={allAdmins}
              limit={3}
              onSettings={(admin) => goToSettingsAdmin(admin.name)}
              onInfo={openGetUserModal}
            />
          </ReactBootstrap.Col>

          <ReactBootstrap.Col xs={12}>
            <ReactBootstrap.Row>
              <ReactBootstrap.Col xs={9}>
                <h4>{t('users')}</h4>
              </ReactBootstrap.Col>
              <ReactBootstrap.Col xs={3} className="text-end text-decoration-underline all-data">
                <Link to="/dashboard/admin/settings/users">
                  <h4>{t('all')}</h4>
                </Link>
              </ReactBootstrap.Col>
            </ReactBootstrap.Row>
          </ReactBootstrap.Col>
          <ReactBootstrap.Col xs={12}>
            <EntityPreviewList
              items={allUsers}
              limit={3}
              onSettings={(user) => goToSettingsUser(user.id)}
              onInfo={openGetUserModal}
            />
          </ReactBootstrap.Col>
        </ReactBootstrap.Row>

        {loadErrors.length > 0 && (
          <ReactBootstrap.Row>
            <ReactBootstrap.Col xs={12}>
              <ReactBootstrap.Alert variant="danger" role="alert">
                {t('load-error', 'Could not load the data. Please try again.')} ({loadErrors.map((name) => t(name, name)).join(', ')}){' '}
                <ReactBootstrap.Button variant="link" className="p-0 align-baseline" onClick={loadDashboardData}>
                  {t('retry', 'Retry')}
                </ReactBootstrap.Button>
              </ReactBootstrap.Alert>
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        )}

        {actionNotice && (
          <ReactBootstrap.Row>
            <ReactBootstrap.Col xs={12}>
              <div role="alert" className={actionNotice.success ? 'request-success-alert' : 'request-fail-alert'}>
                {t(actionNotice.text, actionNotice.fallback)}
              </div>
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
        )}

        <ReactBootstrap.Row>
          <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
            <div className="link-daas-design" role="button" tabIndex={0} onClick={openCreateUpdateModal} onKeyDown={activateOnKey(openCreateUpdateModal)}>
              <div>{t('create-update-group')}</div>
            </div>
          </ReactBootstrap.Col>
          <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
            <div className="link-daas-design" role="button" tabIndex={0} onClick={openCreateUserModal} onKeyDown={activateOnKey(openCreateUserModal)}>
              <div>{t('create-user')}</div>
            </div>
          </ReactBootstrap.Col>
          {QUICK_LINKS.map(({ to, labelKeys }) => (
            <ReactBootstrap.Col key={to} xs={12} sm={12} md={6} lg={4} xl={4}>
              <Link to={to} className="link-daas-design">
                <div>{labelKeys.map((key) => t(key)).join(' / ')}</div>
              </Link>
            </ReactBootstrap.Col>
          ))}
        </ReactBootstrap.Row>

        <ReactBootstrap.Modal show={createUpdateModal} onHide={closeCreateUpdateModal} size="md" centered>
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>{t('create-update-group')}</ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <ReactBootstrap.Tabs defaultActiveKey="create-group" id="create-update-group">
              <ReactBootstrap.Tab eventKey="create-group" title={t('create-group')}>
                <Formik
                  initialValues={{ description: '' }}
                  validationSchema={createGroupSchema}
                  onSubmit={submitCreateGroup}
                >
                  {({ isValid, dirty, isSubmitting }) => (
                    <Form>
                      <ReactBootstrap.Row>
                        <FormField name="description" label={t('description-group')} htmlFor="create-group-description" />
                      </ReactBootstrap.Row>
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12}>
                          <ReactBootstrap.Button type="submit" variant="primary" id="submit" disabled={isSubmitting}>
                            {t('submit')}
                          </ReactBootstrap.Button>
                        </ReactBootstrap.Col>
                      </ReactBootstrap.Row>
                    </Form>
                  )}
                </Formik>
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="update-group" title={t('update-group')}>
                <Formik
                  enableReinitialize
                  initialValues={{ description: groupToUpdate?.description ?? '' }}
                  validationSchema={updateGroupSchema}
                  onSubmit={submitUpdateGroup}
                >
                  {({ isValid, dirty, isSubmitting }) => (
                    <Form>
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12}>
                          <label htmlFor="update-group-select">{t('group-choice')}</label>
                        </ReactBootstrap.Col>
                        <ReactBootstrap.Col xs={12}>
                          <select id="update-group-select" className="select-field" onChange={onSelectGroupToUpdate} defaultValue="0">
                            <option value="0">{t('select-group')}</option>
                            {allGroups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.description}
                              </option>
                            ))}
                          </select>
                        </ReactBootstrap.Col>

                        {groupToUpdate && (
                          <FormField name="description" label={t('description-group')} htmlFor="update-group-description" />
                        )}
                      </ReactBootstrap.Row>
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12}>
                          <ReactBootstrap.Button
                            type="submit"
                            variant="primary"
                            id="submit"
                            disabled={!groupToUpdate || !isValid || !dirty || isSubmitting}
                          >
                            {t('submit')}
                          </ReactBootstrap.Button>
                        </ReactBootstrap.Col>
                      </ReactBootstrap.Row>
                    </Form>
                  )}
                </Formik>
              </ReactBootstrap.Tab>
            </ReactBootstrap.Tabs>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>

        <ReactBootstrap.Modal show={createUserModal} onHide={closeCreateUserModal} size="md" centered>
          <ReactBootstrap.Modal.Header closeButton>
            <ReactBootstrap.Modal.Title>{t('create-user')}</ReactBootstrap.Modal.Title>
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body>
            <ReactBootstrap.Tabs defaultActiveKey="user" id="user-admin-creator">
              <ReactBootstrap.Tab eventKey="user" title={t('user')}>
                <Formik
                  initialValues={{ name: '', email: '', password: '', group: '0' }}
                  validationSchema={createUserSchema}
                  onSubmit={submitCreateUser}
                >
                  {({ isValid, dirty, isSubmitting }) => (
                    <Form>
                      <ReactBootstrap.Row>
                        <FormField name="name" label={t('username')} htmlFor="username" />
                        <FormField name="email" label={t('email')} htmlFor="email" />
                        <FormField name="password" label={t('password')} htmlFor="password" type="password" />
                        <ReactBootstrap.Col xs={12}>
                          <div>{t('password-detail-info')}</div>
                        </ReactBootstrap.Col>

                        <FormField name="group" label={t('group')} htmlFor="group" as="select">
                          <option value="0">{t('select-group')}</option>
                          {allGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.description}
                            </option>
                          ))}
                        </FormField>
                      </ReactBootstrap.Row>
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12}>
                          <ReactBootstrap.Button type="submit" variant="primary" id="submit" disabled={isSubmitting}>
                            {t('submit')}
                          </ReactBootstrap.Button>
                        </ReactBootstrap.Col>
                      </ReactBootstrap.Row>
                    </Form>
                  )}
                </Formik>
              </ReactBootstrap.Tab>
              <ReactBootstrap.Tab eventKey="admin" title={t('admin')}>
                <Formik
                  initialValues={{ name: '', email: '', password: '' }}
                  validationSchema={createAdminSchema}
                  onSubmit={submitCreateAdmin}
                >
                  {({ isValid, dirty, isSubmitting }) => (
                    <Form>
                      <ReactBootstrap.Row>
                        <FormField name="name" label={t('username')} htmlFor="username-admin" />
                        <FormField name="email" label={t('email')} htmlFor="email-admin" />
                        <FormField name="password" label={t('password')} htmlFor="password-admin" type="password" />
                        <ReactBootstrap.Col xs={12}>
                          <div>{t('password-detail-info')}</div>
                        </ReactBootstrap.Col>
                      </ReactBootstrap.Row>
                      <ReactBootstrap.Row>
                        <ReactBootstrap.Col xs={12}>
                          <ReactBootstrap.Button type="submit" variant="primary" id="submit" disabled={isSubmitting}>
                            {t('submit')}
                          </ReactBootstrap.Button>
                        </ReactBootstrap.Col>
                      </ReactBootstrap.Row>
                    </Form>
                  )}
                </Formik>
              </ReactBootstrap.Tab>
            </ReactBootstrap.Tabs>
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
            </ReactBootstrap.Row>
          </ReactBootstrap.Modal.Body>
        </ReactBootstrap.Modal>

      </ReactBootstrap.Container>
    </>
  );
}

export default MainAdmin;
