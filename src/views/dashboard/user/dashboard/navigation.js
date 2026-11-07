// The dashboard waits briefly before opening a viewer or setup page, as it always did.
export const NAVIGATE_DELAY_MS = 2000;

export const navigateLater = (navigate, route, beforeNavigate) =>
  setTimeout(() => {
    beforeNavigate?.();
    navigate(route);
  }, NAVIGATE_DELAY_MS);

// Stores a JSON value for the next page, or '' when there is none.
export const storeJson = (key, value) => localStorage.setItem(key, value === undefined ? '' : JSON.stringify(value));
