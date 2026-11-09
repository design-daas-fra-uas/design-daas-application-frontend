import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import AsyncContent from '../../../components/AsyncContent';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import FormField from '../../../components/FormField';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';
import { emailSchema } from '../../../utils/validation';

import { deleteUserData } from '../../../api/daasAdmin';
import { getUser, updateUser, disableUser, enableUser, deleteUser } from '../../../api/users';

import { createLogger } from '../../../utils/logger';
const log = createLogger('SettingsUsersDetail');

function SettingsUsersDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isToggling, setIsToggling] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  const [actionError, setActionError] = useState('');
  const { data: user, status, reload } = useResource(({ signal }) => getUser(id, { signal }), [id]);

  const updateUserSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t('error-name', 'Username invalid')),
        email: emailSchema(t),
      }),
    [t],
  );

  // Saving and refreshing share one error message; the refresh is silent so the form stays mounted.
  // `reload` reports failure by returning false instead of throwing.
  const runAction = async (action) => {
    setActionError('');
    try {
      await action();
      if (!(await reload({ silent: true }))) {
        throw new Error('Refresh after save failed');
      }
    } catch (e) {
      log.error('runAction', e);
      setActionError(t('update-error', 'The request failed. Please try again.'));
    }
  };

  const updateUserAccount = ({ name, email }) =>
    runAction(() => updateUser(user.id, { name: name.trim(), email: email.trim() }));

  const toggleUserAccount = async (action) => {
    if (isToggling) {
      return;
    }
    setIsToggling(true);
    try {
      await runAction(() => action(user.id));
    } finally {
      if (mountedRef.current) {
        setIsToggling(false);
      }
    }
  };

  return (
    <PageLayout backTo={ROUTES.admin.users} id="settingsOverviewUsers" title={t('user-management')}>
      <AsyncContent status={status} onRetry={reload} notFoundText={t('user-not-found', 'User not found.')}>
        {() => (
          <>
            {actionError && <Alert variant="danger">{actionError}</Alert>}
            <Row>
              <Col xs={12} sm={6}>
                <div>
                  <ul>
                    <li>
                      <span>
                        {t('username')}: {user.name}
                      </span>
                    </li>
                    <li>
                      <span>
                        {t('email')}: {user.email}
                      </span>
                    </li>
                    <li>
                      <span>
                        {t('status', 'Status')}: {user.enabled ? t('active') : t('inactive')}
                      </span>
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
                    <li>
                      <span>
                        <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}>
                          {t('delete')}
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
                  {({ isValid, dirty, isSubmitting }) => (
                    <Form>
                      <Row id="updating-user-data">
                        <FormField name="name" label={t('username')} />
                        <FormField name="email" label={t('email')} type="email" />
                      </Row>
                      <Row>
                        <Col xs={12}>
                          <Button
                            type="submit"
                            variant="primary"
                            className="submit-full-width"
                            disabled={!isValid || !dirty || isSubmitting}
                          >
                            {t('submit')}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Row>
            <ConfirmDeleteModal
              show={deleteOpen}
              onHide={() => setDeleteOpen(false)}
              title={t('delete-user', 'Delete user')}
              message={t('delete-user-confirm', { name: user.name })}
              onConfirm={async () => {
                // Remove the user's VMs, containers and files first; keep the account if that fails.
                await deleteUserData(user.id);
                await deleteUser(user.id);
              }}
              onDeleted={() => navigate(ROUTES.admin.users)}
            />
          </>
        )}
      </AsyncContent>
    </PageLayout>
  );
}

export default SettingsUsersDetail;
