import React from 'react';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import PageLink from './PageLink';

// "Back" link already wrapped in its grid column (for use inside a <Row>).
function BackLink({ to }) {
  const { t } = useTranslation();

  return (
    <Col xs={12} md={6} lg={4}>
      <PageLink to={to}>{t('back-link')}</PageLink>
    </Col>
  );
}

export default BackLink;
