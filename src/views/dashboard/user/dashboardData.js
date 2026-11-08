// Pure helpers for the data shown on the user dashboard.

const SEARCH_EXCLUDE_COLUMNS = ['id_file', 'id_owner', 'id_template', 'installer_type', 'version'];

// Items owned by `ownerId`; the backend uses owner 0 for shared items.
// Ids arrive as numbers or strings, so compare them as numbers.
export const ownedBy = (items = [], ownerId) =>
  items.filter(
    (item) => item.id_owner !== null && item.id_owner !== undefined && Number(item.id_owner) === Number(ownerId),
  );

// Case-insensitive search over all visible columns of `items`.
export const filterBySearch = (items, query) => {
  const needle = query.toLowerCase().trim();
  if (!needle) {
    return items;
  }
  return items.filter((item) =>
    Object.entries(item).some(
      ([key, value]) =>
        !SEARCH_EXCLUDE_COLUMNS.includes(key) &&
        String(value ?? '')
          .toLowerCase()
          .includes(needle),
    ),
  );
};

// The logged-in user's id, stored after the session lookup; null when unknown
// (Number(null) would be 0, the owner id of shared items).
export const getCurrentUserId = () => {
  const stored = localStorage.getItem('userDataID');
  return stored ? Number(stored) : null;
};
