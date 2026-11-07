# ---- development: CRA dev server with hot reload ----
FROM node:18.20.8-alpine AS development

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]

# ---- production build ----
FROM node:18.20.8-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Backend URLs baked into the build (see src/constants/constants.js);
# empty = backends on the host the page is served from.
ARG REACT_APP_DAAS_API_URL=
ARG REACT_APP_AUTH_API_URL=
ARG REACT_APP_OAUTH_CLIENT_ID=
ARG REACT_APP_LOG_LEVEL=

# Lint runs in CI; skip CRA's build-time ESLint plugin here.
RUN DISABLE_ESLINT_PLUGIN=true npm run build

# ---- server: static files behind nginx ----
FROM nginx:1.27-alpine AS server

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/
COPY --from=production /app/build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
