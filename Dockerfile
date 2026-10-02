# Development - Server setup

FROM node:18.6.0-alpine AS development

# Add a work directory
WORKDIR /app

# Cache dependencies
COPY package.json .

# Install dependencies
RUN npm install

# Start the app
CMD [ "npm", "start" ]

# Production setup

FROM node:18.6.0-alpine AS production

# Add a work directory
WORKDIR /app

# Cache dependencies
COPY package.json .

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Build the application (disable ESLint plugin to avoid jest/globals env error)
RUN DISABLE_ESLINT_PLUGIN=true npm run build

# ------------------------------------------------

# nginx state for serving content
FROM nginx:alpine as server

# Set working directory to nginx asset directory
# WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm /etc/nginx/conf.d/default.conf

# Change permissions
RUN chmod -R 777 /var ; chmod -R 777 /var/cache ; chmod -R 777 /run

# Copy static assets from builder stage
COPY --from=production /app/build /usr/share/nginx/html
COPY --from=production /app/nginx.conf /etc/nginx/conf.d

# Export settings
EXPOSE 80

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

