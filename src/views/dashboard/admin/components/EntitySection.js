import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import EntityPreviewList from '../../../../components/EntityPreviewList';

// Dashboard widget: section title, "all" link and a short preview list.
function EntitySection({ title, allLink, items, onSettings, onInfo, limit = 3 }) {
  const { t } = useTranslation();

  return (
    <>
      <Col xs={12}>
        <Row>
          <Col xs={9}>
            <h4>{title}</h4>
          </Col>
          <Col xs={3} className="text-end text-decoration-underline all-data">
            <Link to={allLink}>
              <h4>{t('all')}</h4>
            </Link>
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        <EntityPreviewList items={items} limit={limit} onSettings={onSettings} onInfo={onInfo} />
      </Col>
    </>
  );
}

export default EntitySection;