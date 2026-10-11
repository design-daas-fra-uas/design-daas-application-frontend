import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import AccountFields from '../../../components/AccountFields';
import ActionLink from '../../../components/ActionLink';
import AsyncContent from '../../../components/AsyncContent';
import BackLink from '../../../components/BackLink';
import EntityList from '../../../components/EntityList';
import FormField from '../../../components/FormField';
import FormModal from '../../../components/FormModal';
import PageLayout from '../../../components/PageLayout';
import UserInfoModal from '../../../components/UserInfoModal';
import useAccountSchemas, { NO_GROUP } from '../../../hooks/useAccountSchemas';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getUsers, createUser } from '../../../api/users';
import { getUserGroups } from '../../../api/userGroups';

const INITIAL_VALUES = { name: '', password: '', email: '', group: NO_GROUP };

function SettingsUsers() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: users, status, reload } = useResource(getUsers);
    const { data: groups } = useResource(getUserGroups);

    const { userSchema } = useAccountSchemas(t);

    const submitCreateUser = ({ username, email, password, group }) =>
        createUser({ name: username.trim(), email: email.trim(), password, groups: [Number(group)] });

    return (
        <PageLayout id="dashboardAdminSettingsUser" title={t('user-management')} wrapTitle>
            <Row>
                <Col xs={12}>
                    <h4>{t('users')}</h4>
                </Col>
                <Col xs={12}>
                    <AsyncContent status={status} onRetry={reload}>
                        <div>
                            <EntityList
                                items={users ?? []}
                                onSettings={(user) => navigate(ROUTES.admin.userDetail(user.id))}
                                onInfo={setSelectedUser}
                            />
                        </div>
                    </AsyncContent>
                </Col>
            </Row>
            <Row>
                <BackLink to={ROUTES.admin.root} />
                <Col xs={12} md={6} lg={4}>
                    <ActionLink onClick={() => setCreateModalOpen(true)}>{t('create-user')}</ActionLink>
                </Col>
            </Row>
            <FormModal
                show={createModalOpen}
                onHide={() => setCreateModalOpen(false)}
                title={t('create-user')}
                titleId="create-user-modal-title"
                initialValues={INITIAL_VALUES}
                validationSchema={userSchema}
                requireDirty={false}
                fullWidthSubmit
                onSubmit={submitCreateUser}
                onSaved={reload}
            >
                <AccountFields />
                <FormField name="group" label={t('group')} as="select">
                    <option value={NO_GROUP}>{t('select-group')}</option>
                    {(groups ?? []).map((group) => (
                        <option key={group.id} value={group.id}>{group.description}</option>
                    ))}
                </FormField>
            </FormModal>
            <UserInfoModal user={selectedUser} onHide={() => setSelectedUser(null)} />
        </PageLayout>
    );
}

export default SettingsUsers;
