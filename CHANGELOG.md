# Changelog

All notable changes to this project are documented in this file. The project uses [Semantic
Versioning](https://semver.org/).

## [2.0.0]

- **Breaking — backend URLs and client id** come from `REACT_APP_DAAS_API_URL`, `REACT_APP_AUTH_API_URL` and
  `REACT_APP_OAUTH_CLIENT_ID` instead of hard-coded hosts; hard-coded service credentials were removed.
- **Breaking — API calls:** logout goes to the auth service with the user's tokens, user enable/disable uses `PATCH`,
  and new accounts need a valid email and a strong password.
- Moved to Node 26, Vite 8 (was Create React App), Vitest 4 (was Jest), React 19, React Router 7, ESLint 10 and
  Font Awesome 7 as a webfont (main bundle ~700 kB → 265 kB).
- Rewrote the code: `src` went from 50,474 to 7,140 lines, lint warnings from 600 to 0, tests from 1 to 72.
- Added an API layer (`src/api/`) with one client per backend, token refresh and retry on `401`, and cancelled
  requests when leaving a page.
- Added the `X-Request-ID` header on every request, also in the frontend error logs.
- Added the "My resources" page (limits vs. usage) and the admin "System status" page.
- Added central routes with a role guard, lazy-loaded pages, an error boundary, a leveled logger and shared
  components, hooks and Yup schemas.
- Admin settings, monitoring, viewer and setup pages are generated from configuration instead of copy-pasted code;
  each form keeps its own values and results show all returned fields.
- Unknown URLs show "Not found", navigation no longer reloads the page, and banners hide after 2 s everywhere.
- The request alert is centered and says what was done and, on failure, why (the backend's reason and status code,
  e.g. "Only admins may change system objects (403)"); failures stay 6 s. DaaS requests ask for JSON so its errors
  carry that reason.
- On the user dashboard, Delete is disabled with a hint for system objects (owner 0) and their environments, which
  only admins may delete.
- Added CI (lint, tests, build, audit, secret and image scans, push to GHCR), a manual deploy workflow, Dependabot and
  Prettier; the Dockerfile uses `npm ci` and pinned Node and nginx images.
- Fixed: the session (refresh token stored as `Bearer …`, logout on network errors).
- Fixed: stopping an environment always failed, "My files" did not refresh, shared items showed as own, and search
  could not widen its results.
- Fixed: viewer resize and scale values the backend does not accept, and Docker image create sending the wrong Ceph
  flags.
- Fixed: 307 placeholder error texts under every field, raw translation keys, "Get app/file" and admin task list
  showing no result, and monitoring showing file fields for tasks.
- Fixed: the loading spinner never appeared, the header called the API on the login page, and pages updated state
  after being left.
- Fixed: `docker-compose.prod.yml` mapped the wrong port.
- Removed dead views and routes, three admin actions whose endpoints do not exist, ~1,300 commented-out blocks, ~280
  unused imports and variables, unused localStorage keys and `console.log` calls.
- Removed `react-scripts`, `react-router-dom`, `yarn.lock`, ~15 MB of unused images and fonts, and CORS headers sent
  on requests.
