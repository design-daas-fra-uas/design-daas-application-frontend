import React from 'react';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import PageLink from '../../../../components/PageLink';
import { ADMIN_QUICK_LINKS } from '../../../../routes';

// Returns grid columns, so it must be rendered inside a <Row>.
function QuickLinks() {
  const { t } = useTranslation();

  return ADMIN_QUICK_LINKS.map(({ to, labelKeys }) => (
    <Col key={to} xs={12} md={6} lg={4}>
      <PageLink to={to}>{labelKeys.map((key) => t(key)).join(' / ')}</PageLink>
    </Col>
  ));
}

export default QuickLinks;