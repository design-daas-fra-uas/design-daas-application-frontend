import React from 'react';
import { useTranslation } from 'react-i18next';

// Admin list: one row per item with a name, a settings button and an info
// button. Pass `limit` to show only the first N items (dashboard preview);
// omit it to show the full list.
function EntityList({ items, onSettings, onInfo, limit }) {
  const { t } = useTranslation();
  const displayedItems = typeof limit === 'number' ? items.slice(0, limit) : items;

  return (
    <ul>
      {displayedItems.map((item) => (
        <li key={item.id ?? item.name}>
          <span>{item.name}</span>
          <span>
            <button type="button" className="icon-button" aria-label={t('settings', 'Settings')} onClick={() => onSettings(item)}>
              <i className="fa-solid fa-gear" aria-hidden="true" />
            </button>
          </span>
          <span>
            <button type="button" className="icon-button" aria-label={t('information')} onClick={() => onInfo(item)}>
              <i className="fa-solid fa-circle-info" aria-hidden="true" />
            </button>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default EntityList;
