import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import AsyncContent from '../../../components/AsyncContent';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getAdmin, deleteAdmin } from '../../../api/admins';
import { deleteUserData } from '../../../api/daasAdmin';

function SettingsAdminsDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: admin, status, reload } = useResource(({ signal }) => getAdmin(id, { signal }), [id]);

  return (
    <PageLayout backTo={ROUTES.admin.admins} id="settingsOverviewAdmins" title={t('user-management')}>
      <Row>
        <Col xs={12}>
          <AsyncContent
            status={status}
            onRetry={reload}
            notFoundText={t('admin-not-found', 'Administrator not found.')}
          >
            {() => (
              <Row>
                <Col xs={12} sm={6}>
                  <ul>
                    <li>
                      <span>
                        {t('username')}: {admin.name}
                      </span>
                    </li>
                    <li>
                      <span>
                        {t('email')}: {admin.email}
                      </span>
                    </li>
                  </ul>
                </Col>
                <Col xs={12} sm={6} className="text-sm-end">
                  <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}>
                    {t('delete')}
                  </Button>
                </Col>
                {/* The backend refuses to delete the caller's own account or the last admin (409). */}
                <ConfirmDeleteModal
                  show={deleteOpen}
                  onHide={() => setDeleteOpen(false)}
                  title={t('delete-admin', 'Delete administrator')}
                  message={t('delete-admin-confirm', { name: admin.name })}
                  onConfirm={async () => {
                    // Remove the admin's VMs, containers and files first; keep the account if that fails.
                    await deleteUserData(admin.id);
                    await deleteAdmin(admin.id);
                  }}
                  onDeleted={() => navigate(ROUTES.admin.admins)}
                />
              </Row>
            )}
          </AsyncContent>
        </Col>
      </Row>
    </PageLayout>
  );
}

export default SettingsAdminsDetails;
