import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import PageLayout from '../../../components/PageLayout';
import UserInfoModal from '../../../components/UserInfoModal';
import useAdminActions from '../../../hooks/useAdminActions';
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
  const { admins, users, groups, loading, loadErrors, reload, refreshAdmins, refreshUsers, refreshGroups } =
    useDashboardData();
  const [notice, showNotice] = useNotice();

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const closeGroupModal = () => setGroupModalOpen(false);
  const closeAccountModal = () => setAccountModalOpen(false);

  const { saveError, clearSaveError, createGroup, updateGroup, deleteGroup, createUserAccount, createAdminAccount } =
    useAdminActions({
      showNotice,
      refreshGroups,
      refreshUsers,
      refreshAdmins,
      closeGroupModal,
      closeAccountModal,
    });

  const openModal = (open) => () => {
    clearSaveError();
    open(true);
  };
  const hideModal = (close) => () => {
    clearSaveError();
    close();
  };

  return (
    <PageLayout
      id="dashboardAdmin"
      title={t('admin-dashboard-title')}
      backTo={ROUTES.dashboard}
      actions={
        <>
          <Button variant="outline-primary" size="sm" onClick={openModal(setGroupModalOpen)}>
            <i className="fa-solid fa-users-rectangle me-2" aria-hidden="true" />
            {t('create-update-group')}
          </Button>
          <Button size="sm" onClick={openModal(setAccountModalOpen)}>
            <i className="fa-solid fa-user-plus me-2" aria-hidden="true" />
            {t('create-user')}
          </Button>
        </>
      }
    >
      {loading && (
        <p role="status" className="text-center text-muted">
          {t('loading', 'Loading...')}
        </p>
      )}

      {loadErrors.length > 0 && (
        <Alert variant="danger" role="alert">
          {t('load-error', 'Could not load the data. Please try again.')} (
          {loadErrors.map((name) => t(SECTION_LABEL_KEYS[name])).join(', ')}){' '}
          <Button variant="link" className="p-0 align-baseline" onClick={reload}>
            {t('retry', 'Retry')}
          </Button>
        </Alert>
      )}

      {notice && (
        <div role="alert" className={notice.success ? 'request-success-alert' : 'request-fail-alert'}>
          {t(notice.text, notice.fallback)}
        </div>
      )}

      <div className="card-columns-2">
        <div className="panel">
          <EntitySection
            title={t('admins')}
            allLink={ROUTES.admin.admins}
            items={admins}
            onSettings={(admin) => navigate(ROUTES.admin.adminDetail(admin.id))}
            onInfo={setSelectedUser}
          />
        </div>
        <div className="panel">
          <EntitySection
            title={t('users')}
            allLink={ROUTES.admin.users}
            items={users}
            onSettings={(user) => navigate(ROUTES.admin.userDetail(user.id))}
            onInfo={setSelectedUser}
          />
        </div>
      </div>

      <QuickLinks />

      <GroupModal
        show={groupModalOpen}
        onHide={hideModal(closeGroupModal)}
        error={saveError}
        groups={groups}
        onCreate={createGroup}
        onUpdate={updateGroup}
        onDelete={deleteGroup}
      />
      <CreateAccountModal
        show={accountModalOpen}
        onHide={hideModal(closeAccountModal)}
        error={saveError}
        groups={groups}
        onCreateUser={createUserAccount}
        onCreateAdmin={createAdminAccount}
      />
      <UserInfoModal user={selectedUser} onHide={() => setSelectedUser(null)} />
    </PageLayout>
  );
}

export default MainAdmin;
