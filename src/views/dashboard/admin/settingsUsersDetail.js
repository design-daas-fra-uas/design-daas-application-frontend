import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import AsyncContent from '../../../components/AsyncContent';
import BackLink from '../../../components/BackLink';
import FormField from '../../../components/FormField';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getUsers, updateUser, disableUser, enableUser } from '../../../api/users';

const findUserById = async (id) => (await getUsers()).find((user) => String(user.id) === String(id)) ?? null;

function SettingsUsersDetail() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [isToggling, setIsToggling] = useState(false);
    const [actionError, setActionError] = useState('');
    const { data: user, status, reload } = useResource(() => findUserById(id), [id]);

    const updateUserSchema = useMemo(() => Yup.object().shape({
        name: Yup.string()
            .required(t('error-name', 'Username invalid')),
        email: Yup.string()
            .email(t('error-email', 'Invalid email'))
            .required(t('error-email', 'Email invalid')),
    }), [t]);

    // Saving and refreshing share one error message; the refresh is silent so the form stays mounted.
    const runAction = async (action) => {
        setActionError('');
        try {
            await action();
            await reload({ silent: true });
        } catch (e) {
            console.error(e);
            setActionError(t('update-error', 'The request failed. Please try again.'));
        }
    };

    const updateUserAccount = ({ name, email }) => runAction(() => updateUser(user.id, { name, email }));

    const toggleUserAccount = async (action) => {
        if (isToggling) {
            return;
        }
        setIsToggling(true);
        await runAction(() => action(user.id));
        setIsToggling(false);
    };

    return (
        <PageLayout id="settingsOverviewUsers" title={t('user-management')} wrapTitle>
            <AsyncContent status={status} notFoundText={t('user-not-found', 'User not found.')}>
                {() => (
                    <>
                        {actionError && <Alert variant="danger">{actionError}</Alert>}
                        <Row>
                            <Col xs={12} sm={6}>
                                <div>
                                    <ul>
                                        <li>
                                            <span>{t('username')}: {user.name}</span>
                                        </li>
                                        <li>
                                            <span>{t('email')}: {user.email}</span>
                                        </li>
                                        <li>
                                            <span>{t('status', 'Status')}: {user.enabled ? t('active') : t('inactive')}</span>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                            <Col xs={12} sm={6} className="text-sm-end">
                                <div>
                                    <ul>
                                        <li>
                                            <span>
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    disabled={isToggling}
                                                    onClick={() => toggleUserAccount(user.enabled ? disableUser : enableUser)}
                                                >
                                                    {user.enabled ? t('disable') : t('enable')}
                                                </Button>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12}>
                                <Formik
                                    key={user.id}
                                    enableReinitialize
                                    initialValues={{ name: user.name || '', email: user.email || '' }}
                                    validationSchema={updateUserSchema}
                                    onSubmit={updateUserAccount}
                                >
                                    {({ isValid, isSubmitting }) => (
                                        <Form>
                                            <Row id="updating-user-data">
                                                <FormField name="name" label={t('username')} />
                                                <FormField name="email" label={t('email')} type="email" />
                                            </Row>
                                            <Row>
                                                <Col xs={12}>
                                                    <Button type="submit" variant="primary" className="submit-full-width" disabled={!isValid || isSubmitting}>
                                                        {t('submit')}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    )}
                                </Formik>
                            </Col>
                        </Row>
                    </>
                )}
            </AsyncContent>
            <Row>
                <BackLink to={ROUTES.admin.users} />
            </Row>
        </PageLayout>
    );
}

export default SettingsUsersDetail;