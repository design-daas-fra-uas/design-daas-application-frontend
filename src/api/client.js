import axios from 'axios';

import { AUTH_API_URL, DAAS_API_URL } from '../constants/constants';
import { clearSession, getAccessToken, isSessionInvalid, refreshSession } from '../auth/tokenManager';
import { withRequestId } from './requestId';

const unwrapData = (response) => response.data;

// Adds the current access token to every request and, on a 401, refreshes the
// session once and retries the original request. With `unwrap`, responses
// resolve to `response.data` (the retried request is already unwrapped).
const authorize = (client, { unwrap = false } = {}) => {
  client.interceptors.request.use((config) => {
    if (!config.headers.has('Authorization')) {
      config.headers.set('Authorization', getAccessToken());
    }
    return config;
  });

  client.interceptors.response.use(unwrap ? unwrapData : undefined, async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || !original || original._retried) {
      return Promise.reject(error);
    }
    original._retried = true;
    try {
      const token = await refreshSession();
      original.headers.set('Authorization', token);
      return client(original);
    } catch (refreshError) {
      if (isSessionInvalid(refreshError)) {
        clearSession();
      }
      return Promise.reject(error);
    }
  });

  return client;
};

// Java backend (users, groups, desktops). Responses resolve to `response.data`.
const apiClient = authorize(withRequestId(axios.create({ baseURL: AUTH_API_URL })), { unwrap: true });

// Java backend without auth headers or the refresh flow (e.g. email validation).
export const publicClient = withRequestId(axios.create({ baseURL: AUTH_API_URL }));
publicClient.interceptors.response.use(unwrapData);

// Python DaaS backend (VMs, containers, viewer, monitoring). It expects
// multipart form bodies and wraps results in `{ response_code, response_data }`,
// so the full axios response is returned; use `isDaasSuccess` to check it.
// Errors come back as JSON (with the reason in `sys_log`) only when the
// request asks for exactly `application/json`, otherwise as an HTML page.
export const daasClient = authorize(
  withRequestId(
    axios.create({
      baseURL: DAAS_API_URL,
      headers: { 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
    }),
  ),
);

export const isDaasSuccess = (response) => response?.status === 200 && response?.data?.response_code === 200;

export default apiClient;
