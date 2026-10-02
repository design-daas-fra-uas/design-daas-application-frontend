import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Header from '../../../components/header';
import FormField from '../../../components/FormField';

import { getDesktopGroups, createDesktopGroup, addUserGroupToDesktopGroup } from '../../../api/desktopGroups';
import { getUserGroups } from '../../../api/userGroups';

function DesktopGroups() {
    const [allDesktopGroups, setAllDesktopGroups] = useState([]);
    const [allUserGroups, setAllUserGroups] = useState([]);
    const [createDesktopGroupsModal, setCreateDesktopGroupsModal] = useState(false);
    const [addUserGroupDesktopGroupModal, setAddUserGroupDesktopGroupModal] = useState(false);
    const [selectedDesktopGroupId, setSelectedDesktopGroupId] = useState(null);
    const { t } = useTranslation();

    const fetchDesktopGroups = useCallback(() => {
        getDesktopGroups()
            .then(setAllDesktopGroups)
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        fetchDesktopGroups();

        getUserGroups()
            .then(setAllUserGroups)
            .catch((e) => {
                console.log(e);
            });
    }, [fetchDesktopGroups]);

    const showModalCreateDesktopGroups = () => {
        setCreateDesktopGroupsModal(true);
    };
    const closeModalCreateDesktopGroups = () => {
        setCreateDesktopGroupsModal(false);
    };

    const showModalAddUserGroups = (id) => {
        setSelectedDesktopGroupId(id);
        setAddUserGroupDesktopGroupModal(true);
    };
    const closeModalAddUserGroups = () => {
        setAddUserGroupDesktopGroupModal(false);
        setSelectedDesktopGroupId(null);
    };

    const submitCreateDesktopGroups = (values, { setSubmitting, resetForm }) => {
        createDesktopGroup({
            description: values.description,
        })
        .then(() => {
            fetchDesktopGroups();
            resetForm();
            closeModalCreateDesktopGroups();
        })
        .catch(e => {
            console.log(e)
        })
        .finally(() => {
            setSubmitting(false);
        });
    };

    const submitAddUserGroupToDesktopGroup = (values, { setSubmitting }) => {
        addUserGroupToDesktopGroup(selectedDesktopGroupId, values.userGroupId)
        .then(() => {
            closeModalAddUserGroups();
        })
        .catch(e => {
            console.log(e)
        })
        .finally(() => {
            setSubmitting(false);
        });
    };

    const createDesktopGroupsValidationSchema = Yup.object().shape({
        description: Yup.string()
            .required(t('error-desktop-groups-main-description') || 'Desktop main description invalid'),
    });

    const addUserGroupToDesktopGroupValidationSchema = Yup.object().shape({
        userGroupId: Yup.string()
            .required(t('error-select-user-group') || 'Select a user group'),
    });

    return (
        <>
            <Header />
            <ReactBootstrap.Container id="desktop">
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <div>
                            <h2>
                                {t('desktop-groups')}
                            </h2>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            allDesktopGroups.map(desktopGroupsData => {
                                return (
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={8} lg={8} xl={8}>
                                            <div>
                                                <ul>
                                                    <li>
                                                        <span>
                                                            {desktopGroupsData.description}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={4} lg={4} xl={4} className="text-end">
                                            <div>
                                                <ul>
                                                    <li>
                                                        <span>
                                                            <ReactBootstrap.Button type="submit" variant="primary" onClick={() => showModalAddUserGroups(desktopGroupsData.id)}>
                                                              {t('add-user-group')}
                                                            </ReactBootstrap.Button>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                )
                            })
                        }
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
                        <div>
                            <Link to="/dashboard/admin" className="link-daas-design">
                                {/*<i className="fa-solid fa-arrow-left"></i>*/}
                                <div>
                                    {t('back-link')}
                                </div>
                            </Link>
                        </div>
                    </ReactBootstrap.Col>
                    <ReactBootstrap.Col xs={12} sm={12} md={6} lg={4} xl={4}>
                        <div>
                            <div className="link-daas-design" onClick={showModalCreateDesktopGroups}>
                                {/*<i className="fa-solid fa-arrow-left"></i>*/}
                                <div>
                                    {t('desktop-groups-create')}
                                </div>
                            </div>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Modal
                    show={createDesktopGroupsModal}
                    onHide={closeModalCreateDesktopGroups}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <ReactBootstrap.Modal.Header closeButton>
                        <ReactBootstrap.Modal.Title>
                            {t('desktop-groups-create')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        <Formik
                            key={createDesktopGroupsModal}
                            initialValues={{
                                description: '',
                            }}
                            validationSchema={createDesktopGroupsValidationSchema}
                            onSubmit={submitCreateDesktopGroups}
                        >
                            {({ isValid, dirty, isSubmitting }) => (
                                <Form>
                                    <ReactBootstrap.Row>
                                        <FormField
                                            name="description"
                                            label={t('desktop-groups-main-description')}
                                        />
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                disabled={!isValid || !dirty || isSubmitting}
                                            >
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
                    show={addUserGroupDesktopGroupModal}
                    onHide={closeModalAddUserGroups}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter-two"
                    centered
                >
                    <ReactBootstrap.Modal.Header closeButton>
                        <ReactBootstrap.Modal.Title>
                            {t('desktop-groups-add-user-group')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        <Formik
                            key={`${addUserGroupDesktopGroupModal}-${selectedDesktopGroupId}`}
                            initialValues={{
                                userGroupId: allUserGroups[0] ? String(allUserGroups[0].id) : '',
                            }}
                            enableReinitialize
                            validationSchema={addUserGroupToDesktopGroupValidationSchema}
                            onSubmit={submitAddUserGroupToDesktopGroup}
                        >
                            {({ isValid, isSubmitting }) => (
                                <Form>
                                    <ReactBootstrap.Row>
                                        <FormField
                                            name="userGroupId"
                                            label={t('select-user-group')}
                                            as="select"
                                        >
                                            {
                                                allUserGroups.map(data => (
                                                    <option key={data.id} value={data.id}>{data.description}</option>
                                                ))
                                            }
                                        </FormField>
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <ReactBootstrap.Button
                                                type="submit"
                                                variant="primary"
                                                disabled={!isValid || isSubmitting}
                                            >
                                                {t('submit')}
                                            </ReactBootstrap.Button>
                                        </ReactBootstrap.Col>
                                    </ReactBootstrap.Row>
                                </Form>
                            )}
                        </Formik>
                    </ReactBootstrap.Modal.Body>
                </ReactBootstrap.Modal>
            </ReactBootstrap.Container>
        </>
    );
}

export default DesktopGroups;
