import React from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import AsyncContent from '../../../components/AsyncContent';
import BackLink from '../../../components/BackLink';
import PageLayout from '../../../components/PageLayout';
import useResource from '../../../hooks/useResource';
import { ROUTES } from '../../../routes';

import { getAdmins } from '../../../api/admins';

const findAdminByName = async (name) => (await getAdmins()).find((admin) => admin.name === name) ?? null;

function SettingsAdminsDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: admin, status, reload } = useResource(() => findAdminByName(id), [id]);

  return (
    <PageLayout id="settingsOverviewAdmins" title={t('user-management')}>
      <Row>
        <Col xs={12}>
          <AsyncContent status={status} onRetry={reload} notFoundText={t('admin-not-found', 'Administrator not found.')}>
            {() => (
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
            )}
          </AsyncContent>
        </Col>
      </Row>

      <Row>
        <BackLink to={ROUTES.admin.admins} />
      </Row>
    </PageLayout>
  );
}

export default SettingsAdminsDetails;