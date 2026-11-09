import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import EntityList from '../../../../components/EntityList';

// Dashboard widget: section title with the total, a "show all" link and a short preview list.
function EntitySection({ title, allLink, items, onSettings, onInfo, limit = 3 }) {
  const { t } = useTranslation();

  return (
    <>
      <div className="entity-section-head">
        <h3 className="panel-title">
          {title} <span className="count-badge">{items.length}</span>
        </h3>
        <Link to={allLink} className="small fw-medium">
          {t('show-all')}
          <i className="fa-solid fa-arrow-right ms-1" aria-hidden="true" />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="empty-state">{t('no-data-available')}</p>
      ) : (
        <EntityList items={items} limit={limit} onSettings={onSettings} onInfo={onInfo} />
      )}
    </>
  );
}

export default EntitySection;
