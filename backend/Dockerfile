# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/
ARG NODE_VERSION=20.10.0
FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
# Set the environment variable to point Puppeteer to the correct cache directory
USER node
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
