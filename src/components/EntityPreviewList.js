import React from 'react';

// Shared "name + gear + info icon" list row used by the admin dashboard
// preview widgets (mainAdmin.js) and the full admin/user listing pages
// (settingsAdmins.js, settingsUsers.js). Pass `limit` to show only the first
// N items (used for the dashboard preview); omit it to show the full list.
function EntityPreviewList({ items, onSettings, onInfo, limit }) {
  const displayedItems = typeof limit === 'number' ? items.slice(0, limit) : items;

  return (
    <ul>
      {displayedItems.map((item) => (
        <li key={item.id ?? item.name}>
          <span>{item.name}</span>
          <span onClick={() => onSettings(item)}>
            <i className="fa-solid fa-gear" />
          </span>
          <span onClick={() => onInfo(item)}>
            <i className="fa-solid fa-circle-info" />
          </span>
        </li>
      ))}
    </ul>
  );
}

export default EntityPreviewList;
