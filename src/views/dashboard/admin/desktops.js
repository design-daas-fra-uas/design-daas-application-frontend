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
    const { t } = useTranslation();
    const navigate = useNavigate();

    const fetchDesktops = useCallback(() => {
        getDesktops()
            .then(setAllDesktops)
            .catch((e) => {
                console.log(e);
            });
    }, []);

    useEffect(() => {
        fetchDesktops();
    }, [fetchDesktops]);

    const showModalCreateDesktop = () => {
        setCreateDesktopModal(true);
    };
    const closeModalCreateDesktop = () => {
        setCreateDesktopModal(false);
    };

    const goToDetailView = (id) => {
        navigate("/dashboard/settings/desktops/" + id);
    };

    const submitCreateDesktop = (values, { setSubmitting, resetForm }) => {
        createDesktop({
            description: values.description,
            groups: [
                {
                    description: values.detail_description,
                }
            ]
        })
        .then(() => {
            fetchDesktops();
            resetForm();
            closeModalCreateDesktop();
        })
        .catch(e => {
            console.log(e)
        })
        .finally(() => {
            setSubmitting(false);
        });
    };

    const createDesktopValidationSchema = Yup.object().shape({
        description: Yup.string()
            .required(t('error-desktop-main-description') || 'Desktop main description invalid'),
        detail_description: Yup.string()
            .required(t('error-desktop-sub-description') || 'Desktop sub description invalid'),
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
                        {
                            allDesktops.map(desktopData => {
                                return (
                                    <ReactBootstrap.Row>
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
                                                            <ReactBootstrap.Button type="submit" variant="primary" onClick={() => goToDetailView(desktopData.id)}>
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
                            <div className="link-daas-design" onClick={showModalCreateDesktop}>
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
