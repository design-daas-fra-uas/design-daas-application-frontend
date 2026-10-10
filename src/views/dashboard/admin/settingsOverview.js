import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import PageLayout from '../../../components/PageLayout';
import { ROUTES } from '../../../routes';

function SettingsOverview() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sections = [
    { label: t('admins'), to: ROUTES.admin.admins },
    { label: t('users'), to: ROUTES.admin.users },
  ];

  return (
    <PageLayout id="settingsOverview" title={t('user-management')}>
      <Row>
        <Col xs={12}>
          <ul>
            {sections.map(({ label, to }) => (
              <li key={to}>
                <span>{label}</span>
                <span>
                  <Button type="button" variant="primary" onClick={() => navigate(to)}>
                    {t('choose')}
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </PageLayout>
  );
}

export default SettingsOverview;
