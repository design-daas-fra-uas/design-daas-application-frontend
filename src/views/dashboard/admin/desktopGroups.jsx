import { useMemo, useState } from 'react';
import { Alert, Button, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import AsyncContent from '../../../components/AsyncContent';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import FormField from '../../../components/FormField';
import FormModal from '../../../components/FormModal';
import PageLayout from '../../../components/PageLayout';
import useNotice from '../../../hooks/useNotice';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import {
  getDesktopGroups,
  createDesktopGroup,
  addUserGroupToDesktopGroup,
  deleteDesktopGroup,
} from '../../../api/desktopGroups';
import { getDesktops } from '../../../api/desktops';
import { getUserGroups } from '../../../api/userGroups';
import { namesOf } from './desktopFormat';

const CREATE_INITIAL_VALUES = { description: '' };
// No user group is preselected: adding one must be a deliberate choice.
const ADD_INITIAL_VALUES = { userGroupId: '' };

// Mounted only while open, so the user groups are loaded on demand.
function AddUserGroupModal({ desktopGroup, onHide, onSaved }) {
  const { t } = useTranslation();
  const { data, status } = useResource(getUserGroups);
  const userGroups = data ?? [];

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        userGroupId: Yup.string().required(t('error-select-user-group', 'Select a user group')),
      }),
    [t],
  );

  return (
    <FormModal
      show
      onHide={onHide}
      title={`${t('desktop-groups-add-user-group')}: ${desktopGroup.description}`}
      titleId="add-user-group-modal-title"
      initialValues={ADD_INITIAL_VALUES}
      validationSchema={validationSchema}
      onSubmit={({ userGroupId }) => addUserGroupToDesktopGroup(desktopGroup.id, userGroupId)}
      onSaved={onSaved}
      fullWidthSubmit
    >
      {status === 'error' && (
        <Col xs={12}>
          <Alert variant="danger" role="alert">
            {t('load-error', 'Could not load the data. Please try again.')}
          </Alert>
        </Col>
      )}
      <FormField name="userGroupId" label={t('select-user-group')} as="select" disabled={status === 'loading'}>
        <option value="">{status === 'loading' ? t('loading') : t('please-select', 'Please select')}</option>
        {userGroups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.description}
          </option>
        ))}
      </FormField>
    </FormModal>
  );
}

function DesktopGroups() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [groupToAddTo, setGroupToAddTo] = useState(null);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const { t } = useTranslation();
  const [notice, showNotice] = useNotice();

  const { data: desktopGroupsData, status, reload } = useResource(getDesktopGroups);
  // Only used to show desktop names; the list works without them.
  const { data: desktops } = useResource(getDesktops);
  const desktopGroups = desktopGroupsData ?? [];

  const createValidationSchema = useMemo(
    () =>
      Yup.object().shape({
        description: Yup.string()
          .trim()
          .required(t('error-desktop-groups-main-description', 'Desktop main description invalid')),
      }),
    [t],
  );

  return (
    <PageLayout
      backTo={ROUTES.admin.root}
      id="desktop-groups"
      title={t('desktop-groups')}
      actions={
        <Button size="sm" onClick={() => setCreateModalOpen(true)}>
          <i className="fa-solid fa-plus me-2" aria-hidden="true" />
          {t('desktop-new-group')}
        </Button>
      }
    >
      {notice && (
        <div role="status" className="request-success-alert">
          {t(notice.text)}
        </div>
      )}
      <section className="panel" aria-labelledby="desktop-groups-list-title">
        <h2 id="desktop-groups-list-title" className="panel-title">
          {t('desktop-groups')} <span className="count-badge">{desktopGroups.length}</span>
        </h2>
        <AsyncContent status={status} onRetry={reload}>
          {desktopGroups.length === 0 ? (
            <p className="empty-state">{t('desktop-group-empty')}</p>
          ) : (
            <ul className="entity-list">
              {desktopGroups.map((desktopGroup) => (
                <li key={desktopGroup.id}>
                  <div className="entity-main">
                    <span className="entity-name">{desktopGroup.description}</span>
                    <span className="entity-meta">
                      {desktopGroup.desktopIds?.length
                        ? t('desktop-group-desktops', { names: namesOf(desktopGroup.desktopIds, desktops) })
                        : t('desktop-group-no-desktops')}
                    </span>
                  </div>
                  <div className="entity-actions">
                    <Button variant="outline-primary" size="sm" onClick={() => setGroupToAddTo(desktopGroup)}>
                      <i className="fa-solid fa-user-plus me-2" aria-hidden="true" />
                      {t('add-user-group')}
                      <span className="visually-hidden">: {desktopGroup.description}</span>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => setGroupToDelete(desktopGroup)}>
                      <i className="fa-solid fa-trash-can me-2" aria-hidden="true" />
                      {t('delete')}
                      <span className="visually-hidden">: {desktopGroup.description}</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AsyncContent>
      </section>
      <FormModal
        show={createModalOpen}
        onHide={() => setCreateModalOpen(false)}
        title={t('desktop-groups-create')}
        titleId="create-desktop-group-modal-title"
        initialValues={CREATE_INITIAL_VALUES}
        validationSchema={createValidationSchema}
        onSubmit={({ description }) => createDesktopGroup({ description: description.trim() })}
        onSaved={reload}
        fullWidthSubmit
      >
        <FormField name="description" label={t('desktop-name')} autoComplete="off" />
      </FormModal>
      <ConfirmDeleteModal
        show={groupToDelete !== null}
        onHide={() => setGroupToDelete(null)}
        title={t('delete-desktop-group', 'Delete desktop group')}
        message={t('delete-desktop-group-confirm', { name: groupToDelete?.description })}
        onConfirm={() => deleteDesktopGroup(groupToDelete.id)}
        onDeleted={() => reload({ silent: true })}
      />
      {groupToAddTo !== null && (
        <AddUserGroupModal
          desktopGroup={groupToAddTo}
          onHide={() => setGroupToAddTo(null)}
          onSaved={() => showNotice({ text: 'user-group-added', success: true }, { autoHide: true })}
        />
      )}
    </PageLayout>
  );
}

export default DesktopGroups;
