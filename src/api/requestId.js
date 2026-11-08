import axios from 'axios';

// Every request carries an `X-Request-ID`. The DaaS backend and the auth
// service write it into each of their log lines (and the DaaS backend passes
// it on to the auth service), so one click can be followed through the logs
// of all three services. The id is also in the frontend's own error logs
// (utils/logger.js).
export const REQUEST_ID_HEADER = 'X-Request-ID';

const fallbackId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// crypto.randomUUID only exists in secure contexts (https, localhost).
export const newRequestId = () => globalThis.crypto?.randomUUID?.() ?? fallbackId();

export const addRequestId = (config) => {
  if (!config.headers.has(REQUEST_ID_HEADER)) {
    config.headers.set(REQUEST_ID_HEADER, newRequestId());
  }
  return config;
};

// Adds the header to every request of `client` (an axios instance).
export const withRequestId = (client) => {
  client.interceptors.request.use(addRequestId);
  return client;
};

// The plain `axios` calls (login, token refresh, logout in api/auth.js).
withRequestId(axios);
