import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import {useMediaQuery} from "react-responsive";

import {DEVELOPMENT, TEST, LIVE, USERNAME, PASSWORD, DEVELOPMENT_INTERN, TEST_INTERN, LIVE_INTERN, URL_SYSTEM} from "../../../constants/constants";

import Header from "../../../components/header";
import { createLogger } from '../../../utils/logger';

function SettingsAdminAssign() {
    const params = useParams(); // Example: {params.id}
    const [vmAdminID, setVMAdminID] = useState("");
    const [vmAdminUser, setVMAdminUser] = useState("");
    const [vmAdminAppID, setVMAdminAppID] = useState("");
    const [vmAdminAppUser, setVMAdminAppUser] = useState("");
    const [taskListOwnerID, setTaskListOwnerID] = useState("");
    const [taskListObjectID, setTaskListObjectID] = useState("");
    const [taskListInstanceID, setTaskListInstanceID] = useState("");
    const [taskListStatus, setTaskListStatus] = useState("all");
    const [taskStopOwnerID, setTaskStopOwnerID] = useState("");
    const [taskStopObjectID, setTaskStopObjectID] = useState("");
    const [taskStopInstanceID, setTaskStopInstanceID] = useState("");
    const [taskStopID, setTaskStopID] = useState("");
    const [viewerURL, setViewerURL] = useState("");
    const [requestAlert, setRequestAlert] = useState(false);
    const [requestAlertMessage, setRequestAlertMessage] = useState(false);
    const { t, i18n } = useTranslation();

    const isNotDesktop = useMediaQuery({
        query: '(max-width: 1200px)'
    })

    const adminAssignObjectToUser = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/admin/assign_obj_to_user', {
            id: vmAdminID,
            owner: vmAdminUser,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200 && response.data.response_code === 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(true);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
            })
            .catch(e => {
                console.log(e)
                setRequestAlert(true);
                setRequestAlertMessage(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }
        log.error('adminAssignObjectToUser failed', e);

  const adminAppToUser = (event) => {
    event.preventDefault();

        axios.post(DEVELOPMENT + '/admin/assign_app', {
            appid: vmAdminAppID,
            owner: vmAdminAppUser,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200 && response.data.response_code === 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(true);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
            })
            .catch(e => {
                console.log(e)
                setRequestAlert(true);
                setRequestAlertMessage(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

  const taskList = (event) => {
    event.preventDefault();

        axios.post(DEVELOPMENT + '/admin/tasklist', {
            id_owner: taskListOwnerID,
            id_object: taskListObjectID,
            id_instance: taskListInstanceID,
            state: taskListStatus,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200 && response.data.response_code === 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(true);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
            })
            .catch(e => {
                console.log(e)
                setRequestAlert(true);
                setRequestAlertMessage(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }
        log.error('taskList failed', e);

    const taskStop = (event) => {
        event.preventDefault();

        axios.post(DEVELOPMENT + '/admin/taskstop', {
            id_owner: taskStopOwnerID,
            id_object: taskStopObjectID,
            id_instance: taskStopInstanceID,
            id_task: taskStopID,
        }, {
            headers: {
                'Authorization': localStorage.getItem('userToken'),
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': URL_SYSTEM,
                'Access-Control-Allow-Headers': URL_SYSTEM,
            },
            // withCredentials: true,
        })
            .then(response => {
                console.log(response);
                if (response.status === 200 && response.data.response_code === 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(true);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
                if (response.status === 200 && response.data.response_code !== 200) {
                    setRequestAlert(true);
                    setRequestAlertMessage(false);

                    setTimeout(() => {
                        setRequestAlert(false);
                        setRequestAlertMessage(false);
                    }, 2000);
                }
            })
            .catch(e => {
                console.log(e)
                setRequestAlert(true);
                setRequestAlertMessage(false);

                setTimeout(() => {
                    setRequestAlert(false);
                    setRequestAlertMessage(false);
                }, 2000);
            });
    }

    const changeTaskStopOwnerID = event => {
        setTaskStopOwnerID(event.target.value);
    };

    const changeTaskStopObjectID = event => {
        setTaskStopObjectID(event.target.value);
    };

    const changeTaskStopInstanceID = event => {
        setTaskStopInstanceID(event.target.value);
    };

  const changeTaskStopID = (event) => {
    setTaskStopID(event.target.value);
  };

  const changeTaskListOwnerID = (event) => {
    setTaskListOwnerID(event.target.value);
  };

  const changeTaskListObjectID = (event) => {
    setTaskListObjectID(event.target.value);
  };

  const changeTaskListInstanceID = (event) => {
    setTaskListInstanceID(event.target.value);
  };

  const changeTaskListStatus = (event) => {
    setTaskListStatus(event.target.value);
  };

  const changeVMAdminID = (event) => {
    setVMAdminID(event.target.value);
  };

  const changeVMAdminUser = (event) => {
    setVMAdminUser(event.target.value);
  };

    const changeVMAdminAppID = event => {
        setVMAdminAppID(event.target.value);
    };

    const changeVMAdminAppUser = event => {
        setVMAdminAppUser(event.target.value);
    };

    const openNewTab = () => {
        window.open({viewerURL}, "_blank").focus();
    };

    const openNewWindow = () => {
        window.open({viewerURL}, "DESIGN - Viewer", "fullscreen=yes");
    };

    const backToDashboard = () => {
        window.location.href = "/dashboard/admin";
    };

    const adminAssignObjectToUserSchema = Yup.object().shape({
        id: Yup.string()
            .required('ID invalid'),
        owner: Yup.string()
            .required('Owner invalid'),
    });

    const adminAppToUserSchema = Yup.object().shape({
        appid: Yup.string()
            .required('App ID invalid'),
        owner: Yup.string()
            .required('Owner invalid'),
    });

    const taskListSchema = Yup.object().shape({
        id_owner: Yup.string()
            .required('Owner ID invalid'),
        id_object: Yup.string()
            .required('Object ID invalid'),
        id_instance: Yup.string()
            .required('Instance ID invalid'),
        state: Yup.string()
            .required('State invalid'),
    });

    const taskStopSchema = Yup.object().shape({
        id_owner: Yup.string()
            .required('Owner ID invalid'),
        id_object: Yup.string()
            .required('Object ID invalid'),
        id_instance: Yup.string()
            .required('Instance ID invalid'),
        id_task: Yup.string()
            .required('Task ID invalid'),
    });

    return (
        <>
            <Header/>
            <ReactBootstrap.Container id="settingsOverviewAdminAssign" fluid={true}>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <div>
                            <h2>
                                {t('admin-assign-object-app')}
                            </h2>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Tabs defaultActiveKey="admin-assign-object-to-user" id="all-config-admins">
                    <ReactBootstrap.Tab eventKey="admin-assign-object-to-user" title={t('admin-assign-object-to-user')}>
                        <Formik
                            initialValues={{
                                id: '',
                                owner: '',
                            }}
                            validationSchema={adminAssignObjectToUserSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={adminAssignObjectToUser} id="form-admin-tools">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-admin-id">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-admin-id" name="vm-admin-id" value={vmAdminID} onChange={changeVMAdminID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-admin-id')}
                                            {/*<ErrorMessage name="vm-admin-id">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-admin-user">{t('owner')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-admin-user" name="vm-admin-user" value={vmAdminUser} onChange={changeVMAdminUser}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-admin-user')}
                                            {/*<ErrorMessage name="vm-admin-user">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmAdminID.length > 0 && vmAdminUser.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="admin-assign-app" title={t('admin-assign-app')}>
                        <Formik
                            initialValues={{
                                appid: '',
                                owner: '',
                            }}
                            validationSchema={adminAppToUserSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={adminAppToUser} id="form-apps-tools">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-admin-appid">{t('vm-id')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-admin-appid" name="vm-admin-appid" value={vmAdminAppID} onChange={changeVMAdminAppID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-admin-appid')}
                                            {/*<ErrorMessage name="vm-admin-appid">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-admin-appuser">{t('owner')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-admin-appuser" name="vm-admin-appuser" value={vmAdminAppUser} onChange={changeVMAdminAppUser}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-admin-appuser')}
                                            {/*<ErrorMessage name="vm-admin-user">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={vmAdminAppID.length > 0 && vmAdminAppUser.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="admin-task-list" title={t('admin-task-list')}>
                        <Formik
                            initialValues={{
                                id_owner: '',
                                id_object: '',
                                id_instance: '',
                                state: '',
                            }}
                            validationSchema={taskListSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={taskList} id="form-apps-tasklist">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-tasklist-id-owner">{t('vm-id-owner')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-tasklist-id-owner" name="vm-tasklist-id-owner" value={taskListOwnerID} onChange={changeTaskListOwnerID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-tasklist-id-owner')}
                                            {/*<ErrorMessage name="vm-tasklist-id-owner">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-tasklist-id-object">{t('vm-id-object')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-tasklist-id-object" name="vm-tasklist-id-object" value={taskListObjectID} onChange={changeTaskListObjectID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-tasklist-id-object')}
                                            {/*<ErrorMessage name="vm-tasklist-id-object">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-tasklist-id-instance">{t('vm-id-instance')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-tasklist-id-instance" name="vm-tasklist-id-instance" value={taskListInstanceID} onChange={changeTaskListInstanceID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-tasklist-id-instance')}
                                            {/*<ErrorMessage name="vm-tasklist-id-instance">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-tasklist-id-state">{t('vm-status')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <select id="vm-tasklist-id-state" name="vm-tasklist-id-state" value={taskListStatus} onChange={changeTaskListStatus}>
                                                <option value="all">{t('all-tasks')}</option>
                                                <option value="running">{t('running-task')}</option>
                                                <option value="final">{t('final-task')}</option>
                                            </select>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-tasklist-id-state')}
                                            {/*<ErrorMessage name="vm-tasklist-id-state">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit"
                                                disabled={taskListStatus.length > 0 ? false : true}>
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                    <ReactBootstrap.Tab eventKey="admin-task-stop" title={t('admin-task-stop')}>
                        <Formik
                            initialValues={{
                                id_owner: '',
                                id_object: '',
                                id_instance: '',
                                id_task: '',
                            }}
                            validationSchema={taskStopSchema}
                            onSubmit={values => {
                                console.log(values.text);
                            }}
                        >
                            {({ errors, touched }) => (
                                <Form onSubmit={taskStop} id="form-apps-taskstop">
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-taskstop-id-owner">{t('vm-id-owner')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-taskstop-id-owner" name="vm-taskstop-id-owner" value={taskStopOwnerID} onChange={changeTaskStopOwnerID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-taskstop-id-owner')}
                                            {/*<ErrorMessage name="vm-taskstop-id-owner">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-taskstop-id-object">{t('vm-id-object')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-taskstop-id-object" name="vm-taskstop-id-object" value={taskStopObjectID} onChange={changeTaskStopObjectID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-taskstop-id-object')}
                                            {/*<ErrorMessage name="vm-taskstop-id-object">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-taskstop-id-instance">{t('vm-id-instance')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-taskstop-id-instance" name="vm-taskstop-id-instance" value={taskStopInstanceID} onChange={changeTaskStopInstanceID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-tasklist-id-instance')}
                                            {/*<ErrorMessage name="vm-tasklist-id-instance">
                                            </ErrorMessage>*/}
                                        </div>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <label htmlFor="vm-taskstop-id-task">{t('vm-id-task')}</label>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Field type="text" id="vm-taskstop-id-task" name="vm-taskstop-id-task" value={taskStopID} onChange={changeTaskStopID}/>
                                        </ReactBootstrap.Col>
                                        <div className="error-text">
                                            {t('error-vm-tasklist-id-task')}
                                            {/*<ErrorMessage name="vm-tasklist-id-task">
                                            </ErrorMessage>*/}
                                        </div>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                id="submit">
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Tab>
                </ReactBootstrap.Tabs>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div className={requestAlert ? "show-alert" : "hide-alert"}>
                            <div className={requestAlertMessage ? "request-success-alert" : "request-fail-alert"}>
                                {requestAlertMessage ? t('request-successful') : t('request-failed')}
                            </div>
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
                </ReactBootstrap.Row>
            </ReactBootstrap.Container>
        </>
    );
}

export default SettingsAdminAssign;
