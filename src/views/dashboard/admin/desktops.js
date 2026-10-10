import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import ActionLink from '../../../components/ActionLink';
import AsyncContent from '../../../components/AsyncContent';
import BackLink from '../../../components/BackLink';
import FormField from '../../../components/FormField';
import FormModal from '../../../components/FormModal';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getDesktops, createDesktop } from '../../../api/desktops';

const INITIAL_VALUES = { description: '', subDescription: '' };

function Desktops() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data, status, reload } = useResource(getDesktops);
    const desktops = data ?? [];

    const validationSchema = useMemo(() => Yup.object().shape({
        description: Yup.string()
            .required(t('error-desktop-main-description', 'Desktop main description invalid')),
        subDescription: Yup.string()
            .required(t('error-desktop-sub-description', 'Desktop sub description invalid')),
    }), [t]);

    const submitCreateDesktop = ({ description, subDescription }) =>
        createDesktop({
            description,
            // The API models the sub description as a single-entry `groups` list.
            groups: [{ description: subDescription }],
        });

    return (
        <PageLayout id="desktop" title={t('desktops')} wrapTitle>
            <Row>
                <Col xs={12}>
                    <AsyncContent status={status} onRetry={reload} isEmpty={desktops.length === 0}>
                        {desktops.map((desktop) => (
                            <Row key={desktop.id}>
                                <Col xs={12} md={10}>
                                    <div>
                                        <ul>
                                            <li>
                                                <span>{desktop.description}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col xs={12} md={2}>
                                    <div>
                                        <ul>
                                            <li>
                                                <span>
                                                    <Button type="button" variant="primary" onClick={() => navigate(ROUTES.admin.desktopDetail(desktop.id))}>
                                                        {t('choose')}
                                                    </Button>
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                        ))}
                    </AsyncContent>
                </Col>
            </Row>
            <Row>
                <BackLink to={ROUTES.admin.root} />
                <Col xs={12} md={6} lg={4}>
                    <ActionLink onClick={() => setCreateModalOpen(true)}>{t('desktop-create')}</ActionLink>
                </Col>
            </Row>
            <FormModal
                show={createModalOpen}
                onHide={() => setCreateModalOpen(false)}
                title={t('desktop-create')}
                titleId="create-desktop-modal-title"
                initialValues={INITIAL_VALUES}
                validationSchema={validationSchema}
                onSubmit={submitCreateDesktop}
                onSaved={reload}
            >
                <FormField name="description" label={t('desktop-main-description')} />
                <FormField name="subDescription" label={t('desktop-sub-description')} />
            </FormModal>
        </PageLayout>
    );
}

export default Desktops;