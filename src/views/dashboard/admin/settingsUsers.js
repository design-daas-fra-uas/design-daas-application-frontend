import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { getUsers, createUser } from '../../../api/users';

import Header from '../../../components/header';
import EntityPreviewList from '../../../components/EntityPreviewList';
import FormField from '../../../components/FormField';

function SettingsUsers() {
    const [createUserModal, setCreateUserModal] = useState(false);
    const [getUserDataModal, setGetUserDataModal] = useState(false);
    const [deleteUserModal, setDeleteUserModal] = useState(false);
    const [userDataID, setUserDataID] = useState("");
    const [userDataEmail, setUserDataEmail] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const fetchUsers = () => {
        getUsers()
            .then(setAllUsers)
            .catch((e) => {
                console.log(e);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);
    const showCreateUserModal = () => {
        setCreateUserModal(true);
    };
    const closeCreateUserModal = () => {
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
    const showDeleteUserModal = (id) => {
        setDeleteUserModal(true);
        setUserDataID(id);
        setUserDataEmail("");
    };
    const closeDeleteUserModal = () => {
        setDeleteUserModal(false);
        setUserDataID("");
        setUserDataEmail("");
    };

    const goToSettingsUser = (id) => {
        navigate("/dashboard/settings/users/" + id);
    };

    const backToDashboard = () => {
        navigate("/dashboard/admin");
    };

    const submitCreateUser = (values, { setSubmitting, resetForm }) => {
        createUser({
            name: values.username,
            password: values.password,
            fullname: values.fullname,
            email: values.email,
        })
            .then(() => {
                fetchUsers();
                resetForm();
                closeCreateUserModal();
            })
            .catch((e) => {
                console.log(e);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const createUserSchema = Yup.object().shape({
        username: Yup.string()
            .required(t('error-username') || 'Username invalid'),
        password: Yup.string()
            .required(t('error-password') || 'Password invalid'),
        fullname: Yup.string()
            .required(t('error-fullname') || 'Fullname invalid'),
        email: Yup.string()
            .email(t('error-email') || 'Invalid email')
            .required(t('error-email') || 'Email invalid'),
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
                        <div className="link-daas-design" onClick={backToDashboard}>
                            <div>
                                {t('back-link')}
                            </div>
                        </div>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
                        <div className="link-daas-design" onClick={showCreateUserModal}>
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
                                                disabled={!isValid || !dirty || isSubmitting}>
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
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                {t('fullname')}
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                {userDataID}
                            </ReactBootstrap.Col>
                        </ReactBootstrap.Row>
                    </ReactBootstrap.Modal.Body>
                </ReactBootstrap.Modal>
                <ReactBootstrap.Modal
                    show={deleteUserModal}
                    onHide={closeDeleteUserModal}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <ReactBootstrap.Modal.Header closeButton>
                        <ReactBootstrap.Modal.Title>
                            {userDataID} - {t('delete')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        <ReactBootstrap.Row>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <ReactBootstrap.Button
                                    type="submit"
                                    variant="primary"
                                    onClick={closeDeleteUserModal}>
                                    {t('no')}
                                </ReactBootstrap.Button>
                            </ReactBootstrap.Col>
                            <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                <ReactBootstrap.Button
                                    type="submit"
                                    variant="danger"
                                    onClick={closeDeleteUserModal}>
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

export default SettingsUsers;
