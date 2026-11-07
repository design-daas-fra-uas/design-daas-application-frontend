import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { filterBySearch } from '../dashboardData';
import AppIcons from './AppIcons';

// Searchable list of applications with "clone" and "create" buttons.
// `compact` is the layout of the shared-apps tab in the create modal.
function ApplicationList({ apps, onOpen, compact = false }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const visible = filterBySearch(apps, search);

  // Cloning needs a template; "create" builds a new base image from the app.
  const cloneButton = (app) => (
    <Button variant="primary" onClick={() => onOpen(app.id_app, 'clone')} disabled={!app.id_template}>
      {t('clone-headline')}
    </Button>
  );
  const createButton = (app) => (
    <Button variant="primary" onClick={() => onOpen(app.id_app, 'create')}>
      {t('create-headline')}
    </Button>
  );

  return (
    <>
      <Row>
        <Col xs={12} className="text-left">
          <input
            style={{ marginLeft: 5 }}
            type="text"
            placeholder={t('search-text-placeholder')}
            aria-label={t('search-text-placeholder')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Col>
      </Row>
      <div className={compact ? undefined : 'scrollbar-menu-apps-main'}>
        {visible.length === 0 && <p className="text-left">{t('no-data-available')}</p>}
        {visible.map((app) =>
          compact ? (
            <Row key={app.id_app} className="border_apps_bottom">
              <Col xs={12} className="text-left">
                <span className="fw-bold">{t('environment-name') + ': '}</span>
                <span>{app.name}</span>
              </Col>
              <Col xs={12} className="text-center">
                <AppIcons app={app} />
              </Col>
              <Col xs={12} md={6} className="text-center">
                {cloneButton(app)}
              </Col>
              <Col xs={12} md={6} className="text-center">
                {createButton(app)}
              </Col>
            </Row>
          ) : (
            <div key={app.id_app} className="text-center">
              <div>{app.name}</div>
              <div className="icon-main">
                <AppIcons app={app} className="icon-brands" />
              </div>
              <div className="text-center">{cloneButton(app)}</div>
              <div className="text-center">{createButton(app)}</div>
            </div>
          ),
        )}
      </div>
    </>
  );
}

export default ApplicationList;
