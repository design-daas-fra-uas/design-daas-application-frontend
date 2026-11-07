# Application - DaaS

Desktop-as-a-Service without borders: the web frontend of DESIGN (React 19, Vite, React Bootstrap).

## Requirements

- Node.js 26 (LTS, see `.nvmrc`) and npm

## Configuration

Settings are read at build time from `REACT_APP_*` environment variables (or a `.env.local` file):

| Variable                    | Default                      | Purpose                                                   |
| --------------------------- | ---------------------------- | --------------------------------------------------------- |
| `REACT_APP_DAAS_API_URL`    | `http://<page host>:5000`    | DaaS backend (VMs, containers, viewer, monitoring)        |
| `REACT_APP_AUTH_API_URL`    | `http://<page host>:8080`    | Java backend (login, users, groups, desktops)             |
| `REACT_APP_OAUTH_CLIENT_ID` | `test-client`                | OAuth client id                                           |
| `REACT_APP_LOG_LEVEL`       | `debug` (dev), `warn` (prod) | Browser console logging: debug, info, warn, error, silent |

## Development

```sh
npm ci
npm start             # dev server on http://localhost:3000
npm test              # unit tests (Vitest)
npm run lint          # ESLint, no warnings allowed
npm run format        # Prettier
npm run build         # production build in ./build
npm run preview       # serve ./build locally
```

## Project layout

- `src/api` – HTTP clients (`client.js`) and backend calls
- `src/auth` – session and token handling
- `src/components` – shared UI; `components/actions` renders the config-driven DaaS admin forms
- `src/hooks` – shared hooks
- `src/views` – pages (admin pages are lists of actions, see `components/actions/ActionPage.jsx`)

## Docker

```sh
docker compose -f docker-compose.dev.yml up      # dev server with hot reload on :3000
docker compose -f docker-compose.prod.yml build  # nginx image serving the build on :8080
docker image save -o designapplication.tar design-daas-application-frontend-web
```

The production image takes the `REACT_APP_*` values above as build args.
