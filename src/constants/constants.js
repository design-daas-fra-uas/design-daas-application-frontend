/**
 * Constants
 */

/* Environments */
export const DEVELOPMENT = 'https://cluster.daas-design.de:443';
export const TEST = 'https://cluster.daas-design.de:443';
export const LIVE = 'https://cluster.daas-design.de:443';
export const DEVELOPMENT_INTERN = 'https://backend.application.daas-design.de';
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
