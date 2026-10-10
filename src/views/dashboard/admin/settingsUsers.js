import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import ActionLink from '../../../components/ActionLink';
import AsyncContent from '../../../components/AsyncContent';
import BackLink from '../../../components/BackLink';
import EntityList from '../../../components/EntityList';
import FormField from '../../../components/FormField';
import FormModal from '../../../components/FormModal';
import PageLayout from '../../../components/PageLayout';
import UserInfoModal from '../../../components/UserInfoModal';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';
import { emailSchema, newPasswordSchema } from '../../../utils/validation';

import { getUsers, createUser } from '../../../api/users';
import { getUserGroups } from '../../../api/userGroups';

const INITIAL_VALUES = { username: '', password: '', email: '', group: '0' };

function SettingsUsers() {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: users, status, reload } = useResource(getUsers);
    const { data: groups } = useResource(getUserGroups);

    const validationSchema = useMemo(() => Yup.object().shape({
        username: Yup.string()
            .required(t('error-username-required', 'Username is required.')),
        password: newPasswordSchema(t),
        email: emailSchema(t),
        group: Yup.string()
            .notOneOf(['0'], t('error-group-required', 'Group is required.'))
            .required(t('error-group-required', 'Group is required.')),
    }), [t]);

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
                validationSchema={validationSchema}
                requireDirty={false}
                fullWidthSubmit
                onSubmit={submitCreateUser}
                onSaved={reload}
            >
                <FormField name="username" label={t('username')} />
                <FormField name="password" label={t('password')} type="password" />
                <FormField name="email" label={t('email')} />
                <FormField name="group" label={t('group')} as="select">
                    <option value="0">{t('select-group')}</option>
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