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
    const [loadStatus, setLoadStatus] = useState('loading');
    const [userGroupsFailed, setUserGroupsFailed] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const { t } = useTranslation();

    const fetchDesktopGroups = useCallback(async () => {
        setLoadStatus('loading');
        try {
            setAllDesktopGroups(await getDesktopGroups());
            setLoadStatus('loaded');
        } catch (e) {
            console.log(e);
            setLoadStatus('error');
            throw e;
        }
    }, []);

    useEffect(() => {
        fetchDesktopGroups().catch(() => {});

        getUserGroups()
            .then(setAllUserGroups)
            .catch((e) => {
                console.log(e);
                setUserGroupsFailed(true);
            });
    }, [fetchDesktopGroups]);

    const showModalCreateDesktopGroups = () => {
        setCreateDesktopGroupsModal(true);
    };
    const closeModalCreateDesktopGroups = () => {
        setSubmitError('');
        setCreateDesktopGroupsModal(false);
    };

    const showModalAddUserGroups = (id) => {
        setSubmitError('');
        setSelectedDesktopGroupId(id);
        setAddUserGroupDesktopGroupModal(true);
    };
    const closeModalAddUserGroups = () => {
        setSubmitError('');
        setAddUserGroupDesktopGroupModal(false);
        setSelectedDesktopGroupId(null);
    };

    const submitCreateDesktopGroups = async (values, { setSubmitting, resetForm }) => {
        setSubmitError('');
        try {
            await createDesktopGroup({
                description: values.description,
            });
        } catch (e) {
            console.log(e);
            setSubmitError(t('request-failed', 'The request failed. Please try again.'));
            setSubmitting(false);
            return;
        }

        resetForm();
        closeModalCreateDesktopGroups();
        try {
            await fetchDesktopGroups();
        } catch (e) {
            // The list shows its own refresh error state.
        }
        setSubmitting(false);
    };

    const submitAddUserGroupToDesktopGroup = async (values, { setSubmitting }) => {
        setSubmitError('');
        try {
            await addUserGroupToDesktopGroup(selectedDesktopGroupId, values.userGroupId);
            closeModalAddUserGroups();
        } catch (e) {
            console.log(e);
            setSubmitError(t('request-failed', 'The request failed. Please try again.'));
        } finally {
            setSubmitting(false);
        }
    };

    const createDesktopGroupsValidationSchema = Yup.object().shape({
        description: Yup.string()
            .required(t('error-desktop-groups-main-description', 'Desktop main description invalid')),
    });

    const addUserGroupToDesktopGroupValidationSchema = Yup.object().shape({
        userGroupId: Yup.string()
            .required(t('error-select-user-group', 'Select a user group')),
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
                        {loadStatus === 'loading' && <p>{t('loading', 'Loading...')}</p>}
                        {loadStatus === 'error' && (
                            <ReactBootstrap.Alert variant="danger" role="alert">
                                {t('load-error', 'Could not load the data. Please try again.')}{' '}
                                <ReactBootstrap.Button variant="link" className="p-0 align-baseline" onClick={() => fetchDesktopGroups().catch(() => {})}>
                                    {t('retry', 'Retry')}
                                </ReactBootstrap.Button>
                            </ReactBootstrap.Alert>
                        )}
                        {loadStatus === 'loaded' && allDesktopGroups.length === 0 && <p>{t('no-entries', 'No entries found.')}</p>}
                        {
                            allDesktopGroups.map(desktopGroupsData => {
                                return (
                                    <ReactBootstrap.Row key={desktopGroupsData.id}>
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
                                                            <ReactBootstrap.Button type="button" variant="primary" onClick={() => showModalAddUserGroups(desktopGroupsData.id)}>
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
                            <div className="link-daas-design" role="button" tabIndex={0} onClick={showModalCreateDesktopGroups} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && showModalCreateDesktopGroups()}>
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
                        {submitError && <ReactBootstrap.Alert variant="danger" role="alert">{submitError}</ReactBootstrap.Alert>}
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
                        {submitError && <ReactBootstrap.Alert variant="danger" role="alert">{submitError}</ReactBootstrap.Alert>}
                        {userGroupsFailed && <ReactBootstrap.Alert variant="danger" role="alert">{t('load-error', 'Could not load the data. Please try again.')}</ReactBootstrap.Alert>}
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
