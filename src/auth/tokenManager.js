// Centralizes all token/session localStorage access and the background
// refresh-token polling so views don't duplicate this logic (previously
// hard-coded inside src/views/login.js).
import { refreshAccessToken } from '../api/auth';

const TOKEN_KEY = 'userToken';
const REFRESH_TOKEN_KEY = 'userRefreshToken';
const TOKEN_TIME_KEY = 'userTimeToken';
const ROLE_KEY = 'role';

const REFRESH_INTERVAL_MS = 3600000;

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getTokenTime = () => localStorage.getItem(TOKEN_TIME_KEY);
export const getRole = () => localStorage.getItem(ROLE_KEY);

// Persists a freshly issued login session (access token, refresh token and role).
export const setSession = ({ tokenType, accessToken, refreshToken, role }) => {
  localStorage.setItem(TOKEN_KEY, `${tokenType} ${accessToken}`);
  localStorage.setItem(REFRESH_TOKEN_KEY, `${tokenType} ${refreshToken}`);
  localStorage.setItem(TOKEN_TIME_KEY, String(new Date().getTime()));
  localStorage.setItem(ROLE_KEY, role);
};

// Persists the tokens returned by a successful silent refresh.
const updateTokensAfterRefresh = ({ tokenType, accessToken, refreshToken }) => {
  localStorage.setItem(TOKEN_KEY, `${tokenType} ${accessToken}`);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(TOKEN_TIME_KEY, String(new Date().getTime()));
};

export const clearSession = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TIME_KEY);
  localStorage.removeItem(ROLE_KEY);
};

// Starts the hourly silent-refresh polling. Calls `onSessionExpired` whenever
// the session is missing/invalid or the refresh call fails (after clearing
// the stored session). Returns a cleanup function to stop the timer.
export const scheduleTokenRefresh = (onSessionExpired) => {
  const intervalId = setInterval(() => {
    const refreshToken = getRefreshToken();
    const accessToken = getAccessToken();
    const timeToken = getTokenTime();
    const role = getRole();

    if (!refreshToken || !accessToken || !timeToken || !role) {
      onSessionExpired();
      return;
    }

    refreshAccessToken({ refreshToken, role })
      .then((res) => {
        updateTokensAfterRefresh({
          tokenType: res.data.token_type,
          accessToken: res.data.access_token,
          refreshToken: res.data.refresh_token,
        });
      })
      .catch(() => {
        clearSession();
        onSessionExpired();
      });
  }, REFRESH_INTERVAL_MS);

  return () => clearInterval(intervalId);
};
