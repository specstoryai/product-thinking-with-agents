# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.9.0
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install packages needed to build node modules
FROM base as build

RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential 

# Install node modules including dev dependencies for building
COPY --link package.json ./
RUN npm install --production=false

# Copy application code
COPY --link . .

# Build TypeScript
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Final stage for app image
FROM base

# Install packages needed for deployment (including SQLite, git, and CA certificates)
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y sqlite3 git ca-certificates && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Configure git for commits
RUN git config --global user.email "api@tnyoffice.com" && \
    git config --global user.name "TnyOffice API"

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/src/public ./dist/public

# Start the server by default, this can be overwritten at runtime
EXPOSE 3001
ENV PORT="3001"
ENV HOST="0.0.0.0"
CMD [ "node", "dist/index.js" ]