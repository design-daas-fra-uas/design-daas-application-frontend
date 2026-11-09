import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import AsyncContent from '../../../components/AsyncContent';
import ConfirmDeleteModal from '../../../components/ConfirmDeleteModal';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { deleteDesktop, getDesktop } from '../../../api/desktops';

function DesktopDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: desktop, status, reload } = useResource(() => getDesktop(id), [id]);

  return (
    <PageLayout backTo={ROUTES.admin.desktops} id="desktop-details" title={t('desktop-details')}>
      <Row>
        <Col xs={12}>
          <AsyncContent status={status} onRetry={reload} notFoundText={t('desktop-not-found', 'Desktop not found.')}>
            {() => (
              <Row>
                <Col xs={12} sm={8}>
                  <p>
                    {desktop.id}.) {desktop.description}
                  </p>
                </Col>
                <Col xs={12} sm={4} className="text-sm-end">
                  <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}>
                    {t('delete')}
                  </Button>
                </Col>
                <ConfirmDeleteModal
                  show={deleteOpen}
                  onHide={() => setDeleteOpen(false)}
                  title={t('delete-desktop', 'Delete desktop')}
                  message={t('delete-desktop-confirm', { name: desktop.description })}
                  onConfirm={() => deleteDesktop(desktop.id)}
                  onDeleted={() => navigate(ROUTES.admin.desktops)}
                />
              </Row>
            )}
          </AsyncContent>
        </Col>
      </Row>
    </PageLayout>
  );
}

export default DesktopDetail;
