import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import AsyncContent from '../../../components/AsyncContent';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { deleteDesktop, getDesktop } from '../../../api/desktops';
import { getDesktopGroups } from '../../../api/desktopGroups';
import { namesOf } from './desktopFormat';

function DesktopDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: desktop, status, reload } = useResource(() => getDesktop(id), [id]);
  // Only used to show group names.
  const { data: groups } = useResource(getDesktopGroups);

  return (
    <PageLayout
      backTo={ROUTES.admin.desktops}
      id="desktop-details"
      title={t('desktop-details')}
      actions={
        status === 'loaded' && (
          <Button variant="outline-danger" size="sm" onClick={() => setDeleteOpen(true)}>
            <i className="fa-solid fa-trash-can me-2" aria-hidden="true" />
            {t('delete-desktop', 'Delete desktop')}
          </Button>
        )
      }
    >
      <section className="panel">
        <AsyncContent status={status} onRetry={reload} notFoundText={t('desktop-not-found', 'Desktop not found.')}>
          {() => (
            <>
              <dl className="detail-list">
                <dt>{t('desktop-name')}</dt>
                <dd>{desktop.description}</dd>
                <dt>ID</dt>
                <dd>{desktop.id}</dd>
                <dt>{t('desktop-group-ids')}</dt>
                <dd>{desktop.groups?.length ? namesOf(desktop.groups, groups) : t('desktop-no-groups')}</dd>
              </dl>
              <ConfirmDeleteModal
                show={deleteOpen}
                onHide={() => setDeleteOpen(false)}
                title={t('delete-desktop', 'Delete desktop')}
                message={t('delete-desktop-confirm', { name: desktop.description })}
                onConfirm={() => deleteDesktop(desktop.id)}
                onDeleted={() => navigate(ROUTES.admin.desktops)}
              />
            </>
          )}
        </AsyncContent>
      </section>
    </PageLayout>
  );
}

export default DesktopDetail;
