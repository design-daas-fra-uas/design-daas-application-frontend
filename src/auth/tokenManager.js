// Single owner of the login session in localStorage: tokens, role, the
// background refresh and logout. Views must not touch these keys directly.
import { logoutRequest, refreshAccessToken } from '../api/auth';
import { createLogger } from '../utils/logger';

const log = createLogger('Session');

const TOKEN_KEY = 'userToken';
const REFRESH_TOKEN_KEY = 'userRefreshToken';
const TOKEN_TIME_KEY = 'userTimeToken';
const ROLE_KEY = 'role';

const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

// Older sessions stored the refresh token as "Bearer <token>"; the token
// endpoint expects the bare value.
const stripTokenType = (token) => (token || '').replace(/^\S+\s+(?=\S)/, '');

// The access token is stored with its type ("Bearer <token>") because it is
// sent as-is in the Authorization header.
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => stripTokenType(localStorage.getItem(REFRESH_TOKEN_KEY));
export const getRole = () => localStorage.getItem(ROLE_KEY);

const sessionListeners = new Set();
const notifySessionChange = () => sessionListeners.forEach((listener) => listener());

// Lets React code react to login/logout, including changes made in other tabs.
// Returns an unsubscribe function.
export const subscribeToSession = (listener) => {
  sessionListeners.add(listener);
  const onStorage = (event) => {
    if (event.key === null || event.key === ROLE_KEY) {
      listener();
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    sessionListeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
};

const storeTokens = ({ tokenType, accessToken, refreshToken }) => {
  localStorage.setItem(TOKEN_KEY, `${tokenType} ${accessToken}`);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(TOKEN_TIME_KEY, String(Date.now()));
};

// Persists a freshly issued login session.
export const setSession = ({ tokenType, accessToken, refreshToken, role }) => {
  storeTokens({ tokenType, accessToken, refreshToken });
  localStorage.setItem(ROLE_KEY, role);
  notifySessionChange();
};

export const clearSession = () => {
  [REFRESH_TOKEN_KEY, TOKEN_KEY, TOKEN_TIME_KEY, ROLE_KEY].forEach((key) => localStorage.removeItem(key));
  notifySessionChange();
};

// Only a rejected refresh token (or a missing session) ends the session;
// transient network/server errors must not log the user out.
export const isSessionInvalid = (refreshError) => {
  const status = refreshError?.response?.status;
  return status === 400 || status === 401 || refreshError?.message === 'No session';
};

// Exchanges the refresh token for new tokens. Concurrent callers share one
// request. Resolves to the new Authorization header value.
let refreshPromise = null;
export const refreshSession = () => {
  if (!refreshPromise) {
    const refreshToken = getRefreshToken();
    if (!refreshToken || !getRole()) {
      return Promise.reject(new Error('No session'));
    }
    refreshPromise = refreshAccessToken({ refreshToken })
      .then(({ data }) => {
        storeTokens({
          tokenType: data.token_type,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });
        return getAccessToken();
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Refreshes the session every hour while the app is open. Clears the session
// when it is missing or the refresh token is rejected. Returns a cleanup function.
export const scheduleTokenRefresh = () => {
  const intervalId = setInterval(() => {
    refreshSession().catch((error) => {
      if (isSessionInvalid(error)) {
        log.info('Session expired');
        clearSession();
      } else {
        log.warn('Background token refresh failed, will retry', error);
      }
    });
  }, REFRESH_INTERVAL_MS);

  return () => clearInterval(intervalId);
};

// Ends the session on the server and wipes everything the app stored locally
// (tokens and per-page selections), then returns to the login page.
export const logout = (redirectTo = '/') => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  localStorage.clear();
  notifySessionChange();

  return logoutRequest({ accessToken, refreshToken })
    .catch((error) => log.warn('Server-side logout failed', error))
    .finally(() => {
      window.location.href = redirectTo;
    });
};
