/**
 * Constants
 */

/* Environments */
// Resolve the backend host from the browser's current location instead of a
// hardcoded "localhost" so the same build works whether it's opened from the
// VM itself or from a remote browser (e.g. http://<vm-ip>:3000).
const BACKEND_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

// Backend URLs. Set at build time with the REACT_APP_* build args (the
// design-daas installer passes them from installer/daas.env); without them
// the dev defaults on the current host are used.
// DaaS backend (VMs, containers, viewer)
export const DEVELOPMENT = process.env.REACT_APP_DAAS_API_URL || `http://${BACKEND_HOST}:5000`;
export const TEST = 'https://cluster.daas-design.de:443';
export const LIVE = 'https://cluster.daas-design.de:443';
// Java backend (login, users, permissions)
export const DEVELOPMENT_INTERN = process.env.REACT_APP_AUTH_API_URL || `http://${BACKEND_HOST}:8080`;
export const TEST_INTERN = 'https://backend.application.daas-design.de';
export const LIVE_INTERN = 'https://backend.application.daas-design.de';

/* Credentials - Frankfurt University */
export const USERNAME = "admin";
// Old
// export const PASSWORD = "kFg8%hPpawNkr3xY";
// New
export const PASSWORD = "chjaKLgh75dVG$.Hh-?o";

/* CORS requirements and prerequisite */
// Wildcard
// export const URL_SYSTEM = '*';
// Cluster live system
export const URL_SYSTEM = 'https://cluster.daas-design.de:443';
export const URL_SYSTEM_WITHOUT_PORT = 'https://cluster.daas-design.de';
/* OAuth */
export const OAUTH_CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID || 'test-client';
