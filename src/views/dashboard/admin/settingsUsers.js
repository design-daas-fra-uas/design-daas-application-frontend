import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { getUsers, createUser } from '../../../api/users';

import Header from '../../../components/header';
import EntityPreviewList from '../../../components/EntityPreviewList';
import FormField from '../../../components/FormField';
import { emailSchema, newPasswordSchema } from '../../../utils/validation';

function SettingsUsers() {
    const [createUserModal, setCreateUserModal] = useState(false);
    const [getUserDataModal, setGetUserDataModal] = useState(false);
    const [userDataID, setUserDataID] = useState("");
    const [userDataEmail, setUserDataEmail] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [loadStatus, setLoadStatus] = useState('loading');
    const [submitError, setSubmitError] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();

    const fetchUsers = useCallback(async () => {
        setLoadStatus('loading');
        try {
            setAllUsers(await getUsers());
            setLoadStatus('loaded');
        } catch (e) {
            console.log(e);
            setLoadStatus('error');
            throw e;
        }
    }, []);

    useEffect(() => {
        fetchUsers().catch(() => {});
    }, [fetchUsers]);
    const showCreateUserModal = () => {
        setCreateUserModal(true);
    };
    const closeCreateUserModal = () => {
        setSubmitError('');
        setCreateUserModal(false);
    };
    const showGetUserModal = (id, mail) => {
        setGetUserDataModal(true);
        setUserDataID(id);
        setUserDataEmail(mail);
    };
    const closeGetUserModal = () => {
        setGetUserDataModal(false);
        setUserDataID("");
        setUserDataEmail("");
    };
    const goToSettingsUser = (id) => {
        navigate("/dashboard/admin/settings/users/" + encodeURIComponent(id));
    };

    const backToDashboard = () => {
        navigate("/dashboard/admin");
    };

    const submitCreateUser = async (values, { setSubmitting, resetForm }) => {
        setSubmitError('');
        try {
            await createUser({
                name: values.username,
                password: values.password,
                fullname: values.fullname,
                email: values.email,
            });
        } catch (e) {
            console.log(e);
            setSubmitError(t('request-failed', 'The request failed. Please try again.'));
            setSubmitting(false);
            return;
        }

        resetForm();
        closeCreateUserModal();
        try {
            await fetchUsers();
        } catch (e) {
            // The list shows its own refresh error state.
        }
        setSubmitting(false);
    };

    const createUserSchema = Yup.object().shape({
        username: Yup.string()
            .required(t('error-username-required', 'Username is required.')),
        password: newPasswordSchema(t),
        fullname: Yup.string()
            .required(t('error-fullname-required', 'Full name is required.')),
        email: emailSchema(t),
    });

    return (
        <>
            <Header/>
            <ReactBootstrap.Container id="dashboardAdminSettingsUser">
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <div>
                            <h2>
                                {t('user-management')}
                            </h2>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <h4>
                            {t('users')}
                        </h4>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        {loadStatus === 'loading' && <p>{t('loading', 'Loading...')}</p>}
                        {loadStatus === 'error' && (
                            <ReactBootstrap.Alert variant="danger" role="alert">
                                {t('load-error', 'Could not load the data. Please try again.')}{' '}
                                <ReactBootstrap.Button variant="link" className="p-0 align-baseline" onClick={() => fetchUsers().catch(() => {})}>
                                    {t('retry', 'Retry')}
                                </ReactBootstrap.Button>
                            </ReactBootstrap.Alert>
                        )}
                        <div>
                            <EntityPreviewList
                                items={allUsers}
                                onSettings={(user) => goToSettingsUser(user.id)}
                                onInfo={(user) => showGetUserModal(user.name, user.email)}
                            />
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
                        <div className="link-daas-design" role="button" tabIndex={0} onClick={backToDashboard} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && backToDashboard()}>
                            <div>
                                {t('back-link')}
                            </div>
                        </div>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
                        <div className="link-daas-design" role="button" tabIndex={0} onClick={showCreateUserModal} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && showCreateUserModal()}>
                            <div>
                                {t('create-user')}
                            </div>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Modal
                    show={createUserModal}
                    onHide={closeCreateUserModal}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <ReactBootstrap.Modal.Header closeButton>
                        <ReactBootstrap.Modal.Title>
                            {t('create-user')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        {submitError && <ReactBootstrap.Alert variant="danger" role="alert">{submitError}</ReactBootstrap.Alert>}
                        <Formik
                            key={createUserModal}
                            initialValues={{
                                username: '',
                                password: '',
                                fullname: '',
                                email: '',
                            }}
                            validationSchema={createUserSchema}
                            onSubmit={submitCreateUser}
                        >
                            {({ isValid, dirty, isSubmitting }) => (
                                <Form>
                                    <ReactBootstrap.Row>
                                        <FormField name="username" label={t('username')} />
                                        <FormField name="password" label={t('password')} type="password" />
                                        <FormField name="fullname" label={t('fullname')} />
                                        <FormField name="email" label={t('email')} />
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={isSubmitting}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Modal.Body>
                </ReactBootstrap.Modal>
                <ReactBootstrap.Modal
                    show={getUserDataModal}
                    onHide={closeGetUserModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
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

export default SettingsUsers;
