# Changelog

**Size of the change:** 58 files, +3,998 / −7,852 lines (the codebase got smaller overall).

---
## [2.0.0]

Code review and refactoring of the whole frontend: dead and duplicated code removed, the remaining logic moved into shared modules, and the bugs found along the way fixed.

**Size of the change:** `src` went from 50,474 to 23,714 lines (−53 %). Lint went from 600 warnings to 0 (`--max-warnings=0` in CI), and tests went from 1 to 33.

### Breaking / behavior changes

- **Hard-coded service credentials removed.** `USERNAME`/`PASSWORD` were deleted from `constants.js`. Nothing used them any more, but they are still in the git history of a public repo. ⚠️ **Rotate that password.**
- **Constants renamed.** `DEVELOPMENT` → `DAAS_API_URL` and `DEVELOPMENT_INTERN` → `AUTH_API_URL`. `TEST`, `LIVE`, `*_INTERN`, `URL_SYSTEM` and `URL_SYSTEM_WITHOUT_PORT` were removed (unused). The `REACT_APP_*` build args are unchanged.
- **Client-side navigation.** In-app navigation now uses React Router instead of `window.location.href`, so pages no longer reload fully. The exception is opening a connection from the header, which still reloads so the viewer restarts.
- **Request banners** ("request successful/failed") now hide after 2 s everywhere. A few pages used 5 s or 10 s.
- **Monitoring**
  - The user page's "total" count is now tasks + files + apps, as on the admin page. It used to be `utilization.objects`.
  - The user page now also has a "Host" tab.
  - The refresh button now shows a success or failure banner.
- **Logout** clears all of the app's `localStorage` (tokens, selections, language) instead of a hand-maintained key list that had drifted out of date.
- **Removed calls with no effect:** `/phases/object_list` + `/phases/object_status` on the user dashboard (their result was only written to an unused key), the empty-handler `/monitoring/get_monitor_info` and `/admin/get_monitor_info`, and the `dashboard-info` localStorage cache (written but never read).

### Fixed

- **Session**
  - After login the refresh token was stored as `Bearer <token>`, and the hourly background refresh sent it that way. It is now stored and sent bare, and old stored values are still read correctly.
  - The hourly refresh now ends the session only if the refresh token is rejected (400/401). Network or server errors no longer log the user out.
- **CI** triggered on `main`, but this repo uses `master`. Pushes never ran CI and no image was ever pushed to GHCR.
- **Docker image create** (`settingsDocker`) sent `ceph_public` and `ceph_shared` from the **ceph_user** checkbox.
- **User dashboard**
  - "My files" was not refreshed after creating or cloning a base image or creating or updating an app or file. Four copies of the refresh code called `setOwnApplication` twice and never `setOwnFiles`.
  - On the first visit after login, own apps and files could be empty: the dashboard loaded before the session call had stored the user id. Session → dashboard is now sequential.
  - Selecting an object stored the wrong running instance (empty) unless that instance was last in the list.
  - Stopping an environment read dashboard data from the *stop* response. When that data was missing, it threw after showing "successful", so the banner flipped to "failed". It now refetches the dashboard instead.
  - Search narrowed the already-filtered list, so deleting characters never widened the results, and `null` values crashed it.
  - The "request an application" message was not URL-encoded in the request path, so text with `/`, `?` or `#` broke the URL. The page now also shows success or failure.
- **Monitoring**
  - The admin "Tasks" sections and the owner-search "Tasks" tab showed **file** fields instead of task fields.
  - Owner search showed its results after a fixed 10 s delay instead of when loaded.
  - Owner search always displayed the raw text `error-vm-id-owner-all`, a missing translation key.
- **Viewer pages**
  - The loading spinner was switched on only after the response arrived, and off again immediately, so it never appeared.
  - `settingsPhase` had three iframes with the same id, so only the first one was ever filled.
- **Header** called the dashboard API on the login page too, because its guard `token !== "" || token !== undefined` was always true.
- **Checkbox handlers** kept an inverted duplicate `"on"`/`""` state. It was harmless because submissions used the `…Checked` flag; the duplicate is removed.
- **Timers**
  - Alert timers no longer update state after a page is left.
  - The viewer-session redirect timer is cleared when the page unmounts.
- **Tooling**
  - `docker-compose.prod.yml` mapped ports `8080`/`8443`, but nginx listens on `80`, so the container was unreachable. It now maps `8080:80`.
  - The Jest run hung on CRA's "babel-plugin-proposal-private-property-in-object" warning timer. The plugin is now declared as a devDependency.

### Added

- `src/utils/logger.js`: leveled, scoped logger (`createLogger('Name')`). It reduces axios errors to method, URL, status and body. Level comes from `REACT_APP_LOG_LEVEL`; the default is `debug` in development, `warn` in production and silent in tests. ESLint `no-console` keeps views off `console`.
- `src/api/client.js`: one `authorize()` setup shared by both backends (auth header, one refresh-and-retry on 401). New `daasClient` for the DaaS backend and `isDaasSuccess()`.
- `src/api/phases.js`: start/run/connect calls that resolve to the viewer URL, plus `DaasRequestError` and `withFallback()`.
- `src/api/session.js` (`getSession`) and `requestApplication` in `src/api/users.js`.
- `logout()` in `src/auth/tokenManager.js`: the only logout implementation (the header and the dashboard each had their own copy).
- **Components**
  - `RequestAlert` with the `useRequestAlert` hook (replaces ~390 hand-written `setRequestAlert(true)` … `setTimeout(…, 2000)` blocks).
  - `ViewerFrame` (replaces 21 copies of an `XMLHttpRequest` + `getElementById(...).srcdoc` loader).
  - `RefreshButton`: an accessible `<button>` instead of a clickable `<div>`.
- **Viewer module** (`src/views/dashboard/user/viewer/`): `ViewerPage` and `useViewerSession` (spinner → viewer, or error and back to the dashboard after 5 s), plus `cachedViewer` for reusing an already started viewer.
- **Monitoring module** (`src/views/dashboard/monitoring/`): `monitoringConfig` (categories, endpoints, fields), `useMonitoring` (parallel loading; a failing category falls back to empty) and `MonitoringSections` (counts, tabs, record lists).
- `src/views/dashboard/user/dashboardData.js`: pure `ownedBy`, `filterBySearch` and `getCurrentUserId` helpers.
- `src/utils/formik.js`: `SUBMIT_HANDLED_BY_FORM` explains why the legacy forms' Formik `onSubmit` does nothing (they submit through `<Form onSubmit>`).
- **Tests** (33): token manager (storage, refresh, concurrent refresh, logout), phase API and fallback, request alert hook, monitoring loader and sections, dashboard helpers, viewer page.
- **Tooling**
  - Prettier (`.prettierrc.json`) with `npm run format` / `format:check`.
  - `npm run lint` (zero warnings allowed).
  - CI now runs lint and the format check before the tests.

### Changed

- **Monitoring:** `monitoring.js` (11,106 lines) and `monitoringUser.js` (3,226 lines) were one layout copy-pasted for 3 scopes × 8 categories. They are now ~110 lines of pages on the shared monitoring module.
- **Viewer pages:** `applicationRunning`, `environmentRunning`, `instanceRunning`, `sharedRunning`, `connectionRunning` and `objectStartSetup` went from ~1,600 lines to ~110. Each now only says what to start.
- **User dashboard** (`mainUser.js`, 4,179 → 2,514 lines)
  - Eight inline copies of the dashboard refresh were replaced by one `fetchDashboardInfo`.
  - Its own copy of the navbar was replaced by `<Header connections={…} />`.
  - The filtered lists are derived values instead of state.
  - The object and environment select handlers were rewritten.
- **Header** was rewritten: it loads only `available_connections` and only when logged in, uses buttons for actions, and adds keys to its lists.
- **Python-backend calls:** all ~230 went through `daasClient` instead of `axios` with copy-pasted headers.
- **Back links:** the clickable `<div>` back links on 14 pages became the existing `BackLink` component, a real link.
- **Expert setup pages** take their initial values from `useState(...)` instead of setting them in a mount effect.
- **Formatting:** the whole `src` tree was formatted with Prettier (single quotes, 2-space indent, 120 columns). This makes up a large part of the diff.
- **Dockerfile**
  - Installs with `npm ci` from the lockfile (it ran `npm install` on `package.json` alone).
  - Node is pinned to `18.20.8-alpine` and nginx to `1.27-alpine`.
  - `chmod -R 777 /var /run` was dropped.
  - Accepts `REACT_APP_LOG_LEVEL`.
  - `.dockerignore` now also excludes `build`, `.git`, coverage and `.env*`.
- **Compose files:** the obsolete `version:` key and commented-out volumes were removed.

### Removed

- **Dead views** (not routed or imported anywhere): `demo/*`, `settingsAuthentification`, `createBaseImage`, `createSystem`, `createEnvironmentBase`, `environmentImage`, `snapshotsOverview`, `runningApplicationSystem`, `expert/mainExpert`, `components/footer`, `logo.svg`, `reportWebVitals`.
- **Commented-out code:** ~1,300 blocks, including whole hidden forms (e.g. the "viewer settings" tab) and their handlers and state.
- **Unused code:** ~280 imports, variables, functions and `useState` pairs, plus 45 redundant checkbox states.
- **Logging noise:** every `console.log(response)` after a request (noise, and it logged response data); `console.log(e)` became `log.error(...)`.
- **Fake CORS request headers** (`Access-Control-Allow-*`) on XHR requests.
- **Unused dependencies:** `bootstrap-icons`, `move-js`, `scrolling-tabs-bootstrap-5`, `web-vitals`, `react-router` (`react-router-dom` stays).
- **`yarn.lock`:** npm is used everywhere (CI, Docker), and the two lockfiles had diverged.
- **CSS:** the unused `.show-alert` / `.hide-alert` classes.

### Not done yet / next steps

- The big admin and expert form pages still keep one `useState` and one change handler per field: `settingsPhase` (3.8k lines), `settingsVirtualEnvironment` (2.1k), `settingsDocker` (1.9k), `settingsInstances` (1.6k), `settingsApps` (1.4k), `settingsFiles` (1k), the `objectEnvironmentSetup*` pages and the forms in `mainUser`. The next step is to let Formik own the values and describe each form as config, as was done for monitoring.
- The main bundle is still ~700 kB, mostly `@fortawesome/fontawesome-free/js/all.js`, which carries every icon to render ten. Switching to the webfont CSS needs the `svg` selectors in `App.css` adapted and a visual check.
- Everything was verified with lint, unit tests and a production build, but **not against a running backend**. Please smoke-test login, the dashboards, starting and stopping objects, monitoring and the viewer pages before deploying.

## [1.0.0] 

### Breaking / behavior changes

- **Backend URLs are no longer hard-coded.** `src/constants/constants.js`
  - `DEVELOPMENT` (Python DaaS backend) was `https://cluster.daas-design.de:443` → now `REACT_APP_DAAS_API_URL`, falling back to `http://<current host>:5000`.
  - `DEVELOPMENT_INTERN` (Java auth/user backend) was `https://backend.application.daas-design.de` → now `REACT_APP_AUTH_API_URL`, falling back to `http://<current host>:8080`.
  - New `OAUTH_CLIENT_ID` from `REACT_APP_OAUTH_CLIENT_ID` (default `test-client`, which was hard-coded before).
  - ⚠️ A build made **without** these env vars talks to ports 5000/8080 on whatever host serves the page, not the cluster.
- **Logout calls a different backend.** Before: `POST {DEVELOPMENT}/logout` with the shared service username/password, then a 2 s delay. Now: `POST {DEVELOPMENT_INTERN}/oauth2/user/logout` with the user's access + refresh token, then redirect. The Java backend must provide this endpoint.
- **User enable/disable uses `PATCH`** instead of `POST` (`/user/{id}/enable`, `/user/{id}/disable`). The backend must accept PATCH.
- **Stricter account validation.** Creating users/admins now requires a valid email (`name@domain.tld`) and a password of ≥ 8 chars with upper-case, lower-case and a special character. Previously any non-empty password was accepted.
- **Unknown URLs show the "Not found" page** instead of silently redirecting to login. Pages a role is not allowed to see still redirect to login.
- **Two routes are now enabled** for `user` and `admin` that were commented out upstream: `/dashboard/startApplication` and `/dashboard/instanceRun`.

### Added

- **API layer** (`src/api/`): one module per resource — `auth`, `users`, `admins`, `desktops`, `desktopGroups`, `userGroups` — on a shared axios client (`client.js`) that:
  - attaches the `Authorization` header automatically,
  - on a `401`, refreshes the token once and retries the request,
  - logs the user out only if the refresh token itself is rejected (network errors no longer end the session),
  - supports request cancellation (`signal`) so leaving a page aborts its pending loads.
- **Session management** (`src/auth/tokenManager.js`): all token/role `localStorage` access in one place, hourly background refresh, de-duplicated concurrent refreshes, and login/logout syncing across browser tabs.
- **Central routes** (`src/routes.js`): every path in one `ROUTES` object, plus `ADMIN_QUICK_LINKS` for the admin dashboard tiles.
- **Role-based route guard** (`RequireRole` in `App.js`) and **lazy-loaded** dashboard pages (smaller initial bundle).
- **Error boundary** (`ErrorBoundary.js`): a crash in one page no longer blanks the whole app.
- **Reusable components** (`src/components/`): `AsyncContent` (loading/error/empty + retry), `FormModal`, `FormField`, `AccountFields`, `LoginForm`, `EntityList`, `PageLayout`, `PageLink`, `ActionLink` (keyboard-accessible button), `BackLink`, `UserInfoModal`.
- **Admin dashboard parts** (`src/views/dashboard/admin/components/`): `CreateAccountModal`, `GroupModal`, `EntitySection`, `QuickLinks`.
- **Hooks** (`src/hooks/`): `useResource` (load + status), `useDashboardData`, `useAdminActions`, `useNotice` (auto-hiding inline messages), `useAccountSchemas`.
- **Validation** (`src/utils/validation.js`, `mainUserSchemas.js`): shared email/password/app/file Yup schemas.
- **Translations** (`src/i18n.js`, EN + DE): ~35 new keys for validation errors, load/retry/not-found states and login errors; a shared `changeLanguage` helper.
- **Back links** on admin detail/list pages.
- **DevOps**
  - `.github/workflows/ci-cd.yml`: tests + coverage, build check, `npm audit`, gitleaks secret scan, Docker image build, Trivy scan, container smoke test, push to GHCR; dependency review on PRs.
  - `.github/workflows/deploy.yml`: manual deploy that dispatches a `deploy` event to the `design-daas-infra` repo.
  - `.github/dependabot.yml`: weekly updates for npm, GitHub Actions and Docker.
  - `docker-compose-pve.yml`: runs the container on `127.0.0.1:5001`.
  - `Dockerfile`: accepts `REACT_APP_DAAS_API_URL`, `REACT_APP_AUTH_API_URL`, `REACT_APP_OAUTH_CLIENT_ID` build args; builds with `DISABLE_ESLINT_PLUGIN=true`.
  - `package.json`: version `0.1.0` → `2.0.0`; Jest maps `axios` to its CJS build so tests run.

### Changed

- **Login** (`views/login.js`, 504 → 72 lines): one `LoginForm` reused for the User and Admin tabs instead of duplicated code per role; clear error messages for bad credentials vs. server errors; the role comes from the token's `scope`.
- **Registration** (`views/registration.js`, 187 → 108 lines): shared email validation, better success/error alerts.
- **Admin dashboard** (`mainAdmin.js`, 1,087 → 126 lines): split into hooks and modal components; group and account creation in modals; proper loading/error states.
- **Admin settings pages** — users, user detail, admins, admin detail, desktops, desktop detail, desktop groups, settings overview — now use the API layer, `AsyncContent` with retry, and translated errors (including a specific message for `409 Conflict`).
- **User dashboard** (`mainUser.js`, 6,858 → 4,179 lines): duplicate app/file submit handlers merged (`submitApp`, `submitFile`, `renderAppForm`, `renderFileForm`), shared `multipartHeaders`, `filterBySearch` and alert helpers, Yup schemas moved to `mainUserSchemas.js`. Same backend endpoints as before.
- **Header**: uses `ROUTES`, the shared language helper and the new logout.
- **Styling** (`App.css`): colors are CSS variables, unused selectors and vendor prefixes removed, new `.submit-full-width` and icon-button styles, more visible error styling.
- **Copy fixes**: e.g. "Fullname" → "Full name", "Username are wrong" → "Username is wrong", "not more available" → "no longer available".
- The `Error` view was renamed to `NotFound` (same file, `views/error.js`).
- `App.test.js` now checks that the app renders, instead of the default CRA "learn react" test.

### Removed

- Hard-coded CORS *request* headers (`Access-Control-Allow-Origin/Headers`). These only make sense on server responses and could break preflight requests.
- The service-account (`USERNAME`/`PASSWORD`) logout call from the header and user dashboard.
- The duplicated token-refresh loop in `login.js`. The old loop also had a broken check (`localStorage.getItem('userRefreshToken' == '')`) that never matched.
- Commented-out routes from `App.js`: `/dashboard/admin/demo/*`, `/dashboard/admin/settings/authentification`, `/dashboard/environment`, `/snapshots`, `/createEnvironment`, `/createDeployment`, `/runningApplication`. These were already disabled upstream, so nothing users could reach was removed.

### Fixed

- Install/uninstall labels in the environment setup screens: the translation keys `os_install`/`os_uninstall` were renamed to `os-install`/`os-uninstall`, which is what the views already used. They showed raw keys before.
- Registration feedback after email validation.
- `useEffect` cleanups so pages no longer update state after you navigate away.

---