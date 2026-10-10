import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import Header from '../../../components/header';
import FormField from '../../../components/FormField';

import { getDesktops, createDesktop } from '../../../api/desktops';

function Desktops() {
    const [allDesktops, setAllDesktops] = useState([]);
    const [createDesktopModal, setCreateDesktopModal] = useState(false);
    const [loadStatus, setLoadStatus] = useState('loading');
    const [submitError, setSubmitError] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();

    const fetchDesktops = useCallback(async () => {
        setLoadStatus('loading');
        try {
            setAllDesktops(await getDesktops());
            setLoadStatus('loaded');
        } catch (e) {
            console.log(e);
            setLoadStatus('error');
            throw e;
        }
    }, []);

    useEffect(() => {
        fetchDesktops().catch(() => {});
    }, [fetchDesktops]);

    const showModalCreateDesktop = () => {
        setCreateDesktopModal(true);
    };
    const closeModalCreateDesktop = () => {
        setSubmitError('');
        setCreateDesktopModal(false);
    };

    const goToDetailView = (id) => {
        navigate("/dashboard/admin/settings/desktops/" + encodeURIComponent(id));
    };

    const submitCreateDesktop = async (values, { setSubmitting, resetForm }) => {
        setSubmitError('');
        try {
            await createDesktop({
                description: values.description,
                groups: [
                    {
                        description: values.detail_description,
                    }
                ]
            });
        } catch (e) {
            console.log(e);
            setSubmitError(t('request-failed', 'The request failed. Please try again.'));
            setSubmitting(false);
            return;
        }

        resetForm();
        closeModalCreateDesktop();
        try {
            await fetchDesktops();
        } catch (e) {
            // The list shows its own refresh error state.
        }
        setSubmitting(false);
    };

    const createDesktopValidationSchema = Yup.object().shape({
        description: Yup.string()
            .required(t('error-desktop-main-description', 'Desktop main description invalid')),
        detail_description: Yup.string()
            .required(t('error-desktop-sub-description', 'Desktop sub description invalid')),
    });

    return (
        <>
            <Header />
            <ReactBootstrap.Container id="desktop">
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <div>
                            <h2>
                                {t('desktops')}
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
                                <ReactBootstrap.Button variant="link" className="p-0 align-baseline" onClick={() => fetchDesktops().catch(() => {})}>
                                    {t('retry', 'Retry')}
                                </ReactBootstrap.Button>
                            </ReactBootstrap.Alert>
                        )}
                        {loadStatus === 'loaded' && allDesktops.length === 0 && <p>{t('no-entries', 'No entries found.')}</p>}
                        {
                            allDesktops.map(desktopData => {
                                return (
                                    <ReactBootstrap.Row key={desktopData.id}>
                                        <ReactBootstrap.Col xs={12} sm={12} md={10} lg={10} xl={10}>
                                            <div>
                                                <ul>
                                                    <li>
                                                        <span>
                                                            {desktopData.description}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </ReactBootstrap.Col>
                                        <ReactBootstrap.Col xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <div>
                                                <ul>
                                                    <li>
                                                        <span>
                                                            <ReactBootstrap.Button type="button" variant="primary" onClick={() => goToDetailView(desktopData.id)}>
                                                              {t('choose')}
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
                            <div className="link-daas-design" role="button" tabIndex={0} onClick={showModalCreateDesktop} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && showModalCreateDesktop()}>
                                {/*<i className="fa-solid fa-arrow-left"></i>*/}
                                <div>
                                    {t('desktop-create')}
                                </div>
                            </div>
                        </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
                <ReactBootstrap.Modal
                    show={createDesktopModal}
                    onHide={closeModalCreateDesktop}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <ReactBootstrap.Modal.Header closeButton>
                        <ReactBootstrap.Modal.Title>
                            {t('desktop-create')}
                        </ReactBootstrap.Modal.Title>
                    </ReactBootstrap.Modal.Header>
                    <ReactBootstrap.Modal.Body>
                        {submitError && <ReactBootstrap.Alert variant="danger" role="alert">{submitError}</ReactBootstrap.Alert>}
                        <Formik
                            key={createDesktopModal}
                            initialValues={{
                                description: '',
                                detail_description: '',
                            }}
                            validationSchema={createDesktopValidationSchema}
                            onSubmit={submitCreateDesktop}
                        >
                            {({ isValid, dirty, isSubmitting }) => (
                                <Form>
                                    <ReactBootstrap.Row>
                                        <FormField
                                            name="description"
                                            label={t('desktop-main-description')}
                                        />
                                    </ReactBootstrap.Row>
                                    <ReactBootstrap.Row>
                                        <FormField
                                            name="detail_description"
                                            label={t('desktop-sub-description')}
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
            </ReactBootstrap.Container>
        </>
    );
}

export default Desktops;
