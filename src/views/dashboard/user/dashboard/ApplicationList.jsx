import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { filterBySearch } from '../dashboardData';
import AppIcons from './AppIcons';

// Searchable grid of application cards with "clone" and "create" buttons.
function ApplicationList({ apps, onOpen }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const visible = filterBySearch(apps, search);

  return (
    <>
      <input
        className="search-input"
        type="search"
        placeholder={t('search-text-placeholder')}
        aria-label={t('search-text-placeholder')}
        aria-controls="application-grid"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {visible.length === 0 ? (
        <p className="empty-state">{t('no-data-available')}</p>
      ) : (
        <div className="app-grid" id="application-grid">
          {visible.map((app) => (
            <article key={app.id_app} className="app-card">
              <h3 id={`app-${app.id_app}-name`} className="app-card-name" title={app.name}>
                {app.name}
              </h3>
              <div className="app-card-icons">
                <AppIcons app={app} />
              </div>
              <div className="app-card-actions">
                {/* Cloning needs a template; "create" builds a new base image from the app. */}
                <Button
                  variant="outline-primary"
                  onClick={() => onOpen(app.id_app, 'clone')}
                  disabled={!app.id_template}
                  aria-describedby={`app-${app.id_app}-name`}
                >
                  {t('clone-headline')}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => onOpen(app.id_app, 'create')}
                  aria-describedby={`app-${app.id_app}-name`}
                >
                  {t('create-headline')}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

export default ApplicationList;
