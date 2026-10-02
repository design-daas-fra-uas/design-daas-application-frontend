import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMediaQuery}  from 'react-responsive';

import { getUsers, updateUser, disableUser, enableUser } from '../../../api/users';

import Header from '../../../components/header';

function SettingsUsersDetail() {
    const [userDataInformation, setUserDataInformation] = useState({});
    const params = useParams(); // Example: {params.id}
    const navigate = useNavigate();
    const {t} = useTranslation();

    const isSmall = useMediaQuery({
        query: '(max-width: 576px)'
    })

    const backToDashboard = () => {
        navigate("/dashboard/settings/users");
    };

    const fetchUserData = useCallback(() => {
        getUsers()
            .then(users => {
                const userData = users.find(user => String(user.id) === String(params.id));
                if (userData) {
                    setUserDataInformation(userData);
                }
            })
            .catch(e => {
                console.log(e)
            });
    }, [params.id]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const updateUserAccount = (values, { setSubmitting }) => {
        updateUser(userDataInformation.id, {
            name: values.name,
            email: values.email,
        })
            .then(() => {
                fetchUserData();
            })
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const disableUserAccount = (id) => {
        disableUser(id)
        .then(() => {
            fetchUserData();
        })
        .catch(e => {
            console.log(e)
        });
    };

    const enableUserAccount = (id) => {
        enableUser(id)
            .then(() => {
                fetchUserData();
            })
            .catch(e => {
                console.log(e)
            });
    };

    const updateUserSchema = Yup.object().shape({
        name: Yup.string()
            .required(t('error-name') || 'Username invalid'),
        email: Yup.string()
            .email(t('error-email') || 'Invalid email')
            .required(t('error-email') || 'Email invalid'),
    });

    return (
        <>
            <Header/>
            <ReactBootstrap.Container id="settingsOverviewUsers">
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
                    <ReactBootstrap.Col xs={12} sm={6} md={6} lg={6} xl={6}>
                        <div>
                            <ul>
                                <li>
                                    <span>
                                        {t('username')}: {userDataInformation.name}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        {t('email')}: {userDataInformation.email}
                                    </span>
                                </li>
                                <li>
                                    <span>
                                        Status: {userDataInformation.enabled ? t('active') : t('inactive')}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={6} md={6} lg={6} xl={6} className={isSmall ? "" : "text-end"}>
                        <div>
                            <ul>
                                <li>
                                    <span>
                                        {
                                            userDataInformation.enabled ? (
                                                <ReactBootstrap.Button type="submit" variant="primary" onClick={() => disableUserAccount(userDataInformation.id)}>
                                                    {t('disable')}
                                                </ReactBootstrap.Button>
                                            ) : (
                                                <ReactBootstrap.Button type="submit" variant="primary" onClick={() => enableUserAccount(userDataInformation.id)}>
                                                    {t('enable')}
                                                </ReactBootstrap.Button>
                                            )
                                        }
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Formik
                            key={userDataInformation.id}
                            enableReinitialize
                            initialValues={{
                                name: userDataInformation.name || '',
                                email: userDataInformation.email || '',
                            }}
                            validationSchema={updateUserSchema}
                            onSubmit={updateUserAccount}
                        >
                            {({ isValid, isSubmitting }) => (
                                <Form>
                                    <ReactBootstrap.Row id="updating-user-data">
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <div>
                                                <label htmlFor="name">{t('username')}</label>
                                            </div>
                                            <div>
                                                <Field type="text" id="name" name="name" className="form-control" />
                                            </div>
                                            <div className="error-text">
                                                <ErrorMessage name="name" />
                                            </div>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <div>
                                                <label htmlFor="email">{t('email')}</label>
                                            </div>
                                            <div>
                                                <Field type="email" id="email" name="email" className="form-control" />
                                            </div>
                                            <div className="error-text">
                                                <ErrorMessage name="email" />
                                            </div>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={!isValid || isSubmitting}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
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
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </>);
}

export default SettingsUsersDetail;
