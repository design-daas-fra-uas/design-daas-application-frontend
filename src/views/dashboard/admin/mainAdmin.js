import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import ActionLink from '../../../components/ActionLink';
import PageLayout from '../../../components/PageLayout';
import UserInfoModal from '../../../components/UserInfoModal';
import useDashboardData from '../../../hooks/useDashboardData';
import useNotice from '../../../hooks/useNotice';
import { ROUTES } from '../../../routes';

import CreateAccountModal from './components/CreateAccountModal';
import EntitySection from './components/EntitySection';
import GroupModal from './components/GroupModal';
import QuickLinks from './components/QuickLinks';

const SECTION_LABEL_KEYS = { admins: 'admins', users: 'users', groups: 'group' };

function MainAdmin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { admins, users, groups, loading, loadErrors, reload, refreshAdmins, refreshUsers, refreshGroups } = useDashboardData();
  const [notice, showNotice] = useNotice();

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Saving and refreshing are reported separately so a refresh failure is not shown as a failed save.
  const saveThenRefresh = async ({ save, refresh, onSaved, closeModal }) => {
    try {
      await save();
    } catch (error) {
      console.error(error);
      showNotice({ text: 'request-failed', success: false }, false);
      return;
    }

    onSaved?.();
    try {
      await refresh();
      showNotice({ text: 'request-successful', success: true }, true);
      closeModal();
    } catch (error) {
      console.error(error);
      closeModal();
      showNotice(
        { text: 'refresh-failed', fallback: 'Saved, but the list could not be refreshed. Please reload the data.', success: false },
        false
      );
    }
  };

  const closeGroupModal = () => setGroupModalOpen(false);
  const closeAccountModal = () => setAccountModalOpen(false);

  const createGroup = ({ description }, { resetForm }) =>
    saveThenRefresh({
      save: () => createUserGroup({ description }),
      refresh: refreshGroups,
      onSaved: resetForm,
      closeModal: closeGroupModal,
    });

  const updateGroup = (group, { description }) => {
    if (!group) {
      return undefined;
    }

    return saveThenRefresh({
      save: () => updateUserGroup(group.id, { description }),
      refresh: refreshGroups,
      closeModal: closeGroupModal,
    });
  };

  const createUserAccount = ({ name, email, password, group }, { resetForm }) =>
    saveThenRefresh({
      save: () => createUser({ name, email, password, groups: [Number(group)] }),
      refresh: refreshUsers,
      onSaved: resetForm,
      closeModal: closeAccountModal,
    });

  const createAdminAccount = ({ name, email, password }, { resetForm }) =>
    saveThenRefresh({
      save: () => createAdmin({ name, email, password }),
      refresh: refreshAdmins,
      onSaved: resetForm,
      closeModal: closeAccountModal,
    });

  return (
    <PageLayout id="dashboardAdmin" title={t('user-management')}>
      {loading && (
        <Row>
          <Col xs={12}>
            <p role="status">{t('loading', 'Loading...')}</p>
          </Col>
        </Row>
      )}

      <Row>
        <EntitySection
          title={t('admins')}
          allLink={ROUTES.admin.admins}
          items={admins}
          onSettings={(admin) => navigate(ROUTES.admin.adminDetail(admin.name))}
          onInfo={setSelectedUser}
        />
        <EntitySection
          title={t('users')}
          allLink={ROUTES.admin.users}
          items={users}
          onSettings={(user) => navigate(ROUTES.admin.userDetail(user.id))}
          onInfo={setSelectedUser}
        />
      </Row>

      {loadErrors.length > 0 && (
        <Row>
          <Col xs={12}>
            <Alert variant="danger" role="alert">
              {t('load-error', 'Could not load the data. Please try again.')} ({loadErrors.map((name) => t(SECTION_LABEL_KEYS[name])).join(', ')}){' '}
              <Button variant="link" className="p-0 align-baseline" onClick={reload}>
                {t('retry', 'Retry')}
              </Button>
            </Alert>
          </Col>
        </Row>
      )}

      {notice && (
        <Row>
          <Col xs={12}>
            <div role="alert" className={notice.success ? 'request-success-alert' : 'request-fail-alert'}>
              {t(notice.text, notice.fallback)}
            </div>
          </Col>
        </Row>
      )}

      <Row>
        <Col xs={12} md={6} lg={4}>
          <ActionLink onClick={() => setGroupModalOpen(true)}>{t('create-update-group')}</ActionLink>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <ActionLink onClick={() => setAccountModalOpen(true)}>{t('create-user')}</ActionLink>
        </Col>
        <QuickLinks />
      </Row>

      <GroupModal show={groupModalOpen} onHide={closeGroupModal} groups={groups} onCreate={createGroup} onUpdate={updateGroup} />
      <CreateAccountModal
        show={accountModalOpen}
        onHide={closeAccountModal}
        groups={groups}
        onCreateUser={createUserAccount}
        onCreateAdmin={createAdminAccount}
      />
      <UserInfoModal user={selectedUser} onHide={() => setSelectedUser(null)} />
    </PageLayout>
  );
}

export default MainAdmin;