# Changelog

**Size of the change:** 58 files, +3,998 / −7,852 lines (the codebase got smaller overall).

---
## [2.0.0]

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