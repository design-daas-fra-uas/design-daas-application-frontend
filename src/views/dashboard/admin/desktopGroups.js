import React, { useMemo, useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
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

import { getDesktopGroups, createDesktopGroup, addUserGroupToDesktopGroup } from '../../../api/desktopGroups';
import { getUserGroups } from '../../../api/userGroups';

const CREATE_INITIAL_VALUES = { description: '' };

// Mounted only while open, so the user groups are loaded on demand.
function AddUserGroupModal({ desktopGroupId, onHide }) {
    const { t } = useTranslation();
    const { data, status } = useResource(getUserGroups);
    const userGroups = data ?? [];

    const validationSchema = useMemo(() => Yup.object().shape({
        userGroupId: Yup.string()
            .required(t('error-select-user-group', 'Select a user group')),
    }), [t]);

    const initialValues = useMemo(
        () => ({ userGroupId: data?.[0] ? String(data[0].id) : '' }),
        [data]
    );

    return (
        <FormModal
            show
            onHide={onHide}
            title={t('desktop-groups-add-user-group')}
            titleId="add-user-group-modal-title"
            initialValues={initialValues}
            validationSchema={validationSchema}
            requireDirty={false}
            onSubmit={({ userGroupId }) => addUserGroupToDesktopGroup(desktopGroupId, userGroupId)}
        >
            {status === 'error' && (
                <Col xs={12}>
                    <Alert variant="danger" role="alert">{t('load-error', 'Could not load the data. Please try again.')}</Alert>
                </Col>
            )}
            <FormField name="userGroupId" label={t('select-user-group')} as="select">
                {userGroups.map((group) => (
                    <option key={group.id} value={group.id}>{group.description}</option>
                ))}
            </FormField>
        </FormModal>
    );
}

function DesktopGroups() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedDesktopGroupId, setSelectedDesktopGroupId] = useState(null);
    const { t } = useTranslation();

    const { data: desktopGroupsData, status, reload } = useResource(getDesktopGroups);
    const desktopGroups = desktopGroupsData ?? [];

    const createValidationSchema = useMemo(() => Yup.object().shape({
        description: Yup.string()
            .required(t('error-desktop-groups-main-description', 'Desktop main description invalid')),
    }), [t]);

    return (
        <PageLayout id="desktop" title={t('desktop-groups')} wrapTitle>
            <Row>
                <Col xs={12}>
                    <AsyncContent status={status} onRetry={reload} isEmpty={desktopGroups.length === 0}>
                        {desktopGroups.map((desktopGroup) => (
                            <Row key={desktopGroup.id}>
                                <Col xs={12} md={8}>
                                    <div>
                                        <ul>
                                            <li>
                                                <span>{desktopGroup.description}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col xs={12} md={4} className="text-end">
                                    <div>
                                        <ul>
                                            <li>
                                                <span>
                                                    <Button type="button" variant="primary" onClick={() => setSelectedDesktopGroupId(desktopGroup.id)}>
                                                        {t('add-user-group')}
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
                    <ActionLink onClick={() => setCreateModalOpen(true)}>{t('desktop-groups-create')}</ActionLink>
                </Col>
            </Row>
            <FormModal
                show={createModalOpen}
                onHide={() => setCreateModalOpen(false)}
                title={t('desktop-groups-create')}
                titleId="create-desktop-group-modal-title"
                initialValues={CREATE_INITIAL_VALUES}
                validationSchema={createValidationSchema}
                onSubmit={({ description }) => createDesktopGroup({ description })}
                onSaved={reload}
            >
                <FormField name="description" label={t('desktop-groups-main-description')} />
            </FormModal>
            {selectedDesktopGroupId !== null && (
                <AddUserGroupModal desktopGroupId={selectedDesktopGroupId} onHide={() => setSelectedDesktopGroupId(null)} />
            )}
        </PageLayout>
    );
}

export default DesktopGroups;