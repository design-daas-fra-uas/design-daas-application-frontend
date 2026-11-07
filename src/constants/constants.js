// Backend endpoints and OAuth settings.
//
// Set at build time with the REACT_APP_* build args (the design-daas installer
// passes them from installer/daas.env). Without them the backends are expected
// on the host the page was opened from, so the same build works on the VM
// itself and from a remote browser (e.g. http://<vm-ip>:3000).
const BACKEND_HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

// DaaS backend (VMs, containers, viewer, monitoring).
export const DAAS_API_URL = process.env.REACT_APP_DAAS_API_URL || `http://${BACKEND_HOST}:5000`;

// Java backend (login, users, groups, desktops).
export const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL || `http://${BACKEND_HOST}:8080`;

export const OAUTH_CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID || 'test-client';
