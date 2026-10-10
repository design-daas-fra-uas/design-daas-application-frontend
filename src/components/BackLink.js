import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function BackLink({ to }) {
  const { t } = useTranslation();

  return (
    <Col xs={12} md={6} lg={4}>
      <Link to={to} className="link-daas-design">
        <div>{t('back-link')}</div>
      </Link>
    </Col>
  );
}

export default BackLink;