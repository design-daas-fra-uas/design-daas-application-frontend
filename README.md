# Application - DaaS

Desktop-as-a-Service without borders: the web frontend of DESIGN (React 19, Vite, React Bootstrap).

It is one of the repositories that together form the DESIGN DaaS system:

| Repository                                                                                  | Part                                                             |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [design-daas](https://github.com/design-daas-fra-uas/design-daas)                           | DaaS backend (Python) and the **installer for the whole system** |
| design-daas-application-frontend (this one)                                                 | Web frontend users and admins work in                            |
| [design-daas-backend-java](https://github.com/design-daas-fra-uas/design-daas-backend-java) | Auth service: login, users, permissions                          |
| [design-daas-e2e](https://github.com/design-daas-fra-uas/design-daas-e2e)                   | End-to-end tests of the installed system                         |

## Installing the complete system

This frontend is **not installed on its own**. The complete system (DaaS backend, this frontend,
auth service, Proxmox, desktops) is installed by the installer in the `design-daas` repository.
It builds this frontend as a container (`frontend.service`, listening on `127.0.0.1:5001`
only), and nginx serves it to the browsers on `https://<host>:8443`. No Node.js is needed on
the host for that.

1. Clone these three repositories next to each other (into the same folder):
   `design-daas`, `design-daas-application-frontend` and `design-daas-backend-java`.
2. Set the needed values in `design-daas/installer/daas.env`. Which keys of that file set this
   frontend's settings is shown in [Configuration](#configuration).
3. Run the installer.

Every step, from a freshly installed operating system to the first login, is described in the
**[design-daas README → Installation: from a blank machine to a running system](https://github.com/design-daas-fra-uas/design-daas)**.

The rest of this README is only about running the frontend for **development and debugging**.

## Configuration

Settings are read at **build time** from `REACT_APP_*` environment variables (or a `.env.local`
file), so a change needs a new build. In the complete system the installer passes them as build
args from `design-daas/installer/daas.env` (column _From `daas.env`_, see
`design-daas/installer/frontend/docker-compose.yml`); a `–` means the installer leaves the
default.

| Variable                    | Default                      | From `daas.env`                                             | Purpose                                                   |
| --------------------------- | ---------------------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| `REACT_APP_DAAS_API_URL`    | `http://<page host>:5000`    | `DAAS_PUBLIC_URL` (default `https://HOST_NAME.HOST_DOMAIN`) | DaaS backend (VMs, containers, viewer, monitoring)        |
| `REACT_APP_AUTH_API_URL`    | `http://<page host>:8080`    | `AUTH_PUBLIC_URL` (default `FRONTEND_PUBLIC_URL/auth`)      | Auth service (login, users, groups, desktops)             |
| `REACT_APP_OAUTH_CLIENT_ID` | `test-client`                | `OAUTH_CLIENT_ID` (default `test-client`)                   | OAuth client id                                           |
| `REACT_APP_LOG_LEVEL`       | `debug` (dev), `warn` (prod) | –                                                           | Browser console logging: debug, info, warn, error, silent |

The address the browsers open, `https://<host>:8443`, is `FRONTEND_PUBLIC_URL` in `daas.env`
(default `https://HOST_NAME.HOST_DOMAIN:8443`); the installer uses it for the nginx site and
the certificate. Normally leave all three URLs in `daas.env` empty, then they follow
`HOST_NAME.HOST_DOMAIN`. Changing them later affects more than this frontend (nginx, the
certificate, the auth service): the comment above these keys in `daas.env` lists the `make`
steps to re-run.

## Development

### Requirements

- Node.js 26 and npm (see `.nvmrc`). Debian's own `nodejs` package is too old. On Debian 12,
  install the official build as root:

  ```bash
  apt-get install -y git curl ca-certificates xz-utils libatomic1
  cd /tmp
  curl -fsSLO https://nodejs.org/dist/v26.13.0/node-v26.13.0-linux-x64.tar.xz
  mkdir -p /usr/local/lib/nodejs
  tar -xJf node-v26.13.0-linux-x64.tar.xz -C /usr/local/lib/nodejs
  for b in node npm npx; do ln -sf /usr/local/lib/nodejs/node-v26.13.0-linux-x64/bin/$b /usr/local/bin/$b; done
  node -v           # must print v26.13.0
  ```

- For logging in: an auth service. Run it locally as described in the
  [backend-java README](https://github.com/design-daas-fra-uas/design-daas-backend-java#development)
  (it allows the origin `http://localhost:3000` by default). The installed auth service does not
  work for this: it only accepts requests from the installed frontend's address (CORS).
- For the dashboard, desktops and monitoring: additionally a DaaS backend.

### Run it locally

As your normal user:

```bash
git clone https://github.com/design-daas-fra-uas/design-daas-application-frontend.git
cd design-daas-application-frontend
npm ci
cat > .env.local <<'EOF'
REACT_APP_AUTH_API_URL=http://localhost:8080
REACT_APP_DAAS_API_URL=http://localhost:5000
EOF
npm start
```

Open <http://localhost:3000> and log in on the _Admin_ tab, e.g. with the local auth service's
development admin `admin@design.local` / `Admin123!`. All settings are listed under
[Configuration](#configuration).

### Commands

```sh
npm ci
npm start             # dev server on http://localhost:3000
npm test              # unit tests (Vitest)
npm run lint          # ESLint, no warnings allowed
npm run format        # Prettier
npm run build         # production build in ./build
npm run preview       # serve ./build locally
```

Before committing: `npm run lint`, `npm test` and `npm run build` must pass.

### Debugging the installed frontend

On the DaaS host the installer uses this repository from the folder next to `design-daas`
(`/root/design-daas-application-frontend` in the guide).
As root:

```bash
make -C /root/design-daas/installer frontend-logs      # follow its logs
make -C /root/design-daas/installer frontend-check     # test it the way a browser does
make -C /root/design-daas/installer frontend-install   # rebuild it after changing the code
```

For detailed browser console output, build with `REACT_APP_LOG_LEVEL=debug` (see
[Configuration](#configuration)). Every
request carries an `X-Request-ID`; search the DaaS backend and auth service logs for it to
follow one action through all parts.

## Project layout

- `src/api` – HTTP clients (`client.js`) and backend calls; every request carries an `X-Request-ID`
  (`requestId.js`) that the DaaS backend and the auth service write into their logs
- `src/auth` – session and token handling
- `src/components` – shared UI; `components/actions` renders the config-driven DaaS admin forms
- `src/hooks` – shared hooks
- `src/views` – pages (admin pages are lists of actions, see `components/actions/ActionPage.jsx`);
  `views/dashboard/status` has the users' "My resources" page and the admins' "System status" page

## Docker

```sh
docker compose -f docker-compose.dev.yml up      # dev server with hot reload on :3000
docker compose -f docker-compose.prod.yml build  # nginx image serving the build on :8081
docker image save -o designapplication.tar design-daas-application-frontend-web
```

The production image takes the `REACT_APP_*` values above as build args. (The complete system
does not use these files: the installer has its own compose setup in `design-daas/installer/frontend`.)
