import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import AsyncContent from '../../../components/AsyncContent';
import BackLink from '../../../components/BackLink';
import EntityPreviewList from '../../../components/EntityPreviewList';
import PageLayout from '../../../components/PageLayout';
import UserInfoModal from '../../../components/UserInfoModal';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getAdmins } from '../../../api/admins';

function SettingsAdmins() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const { data, status, reload } = useResource(getAdmins);

  return (
    <PageLayout id="dashboardAdminSettingsAdmin" title={t('user-management')}>
      <Row>
        <Col xs={12}>
          <h4>{t('admins')}</h4>
        </Col>
        <Col xs={12}>
          <AsyncContent status={status} onRetry={reload}>
            <EntityPreviewList
              items={data ?? []}
              onSettings={(admin) => navigate(ROUTES.admin.adminDetail(admin.name))}
              onInfo={setSelectedAdmin}
            />
          </AsyncContent>
        </Col>
      </Row>

      <Row>
        <BackLink to={ROUTES.admin.root} />
      </Row>

      <UserInfoModal user={selectedAdmin} onHide={() => setSelectedAdmin(null)} />
    </PageLayout>
  );
}

export default SettingsAdmins;