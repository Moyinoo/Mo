# Pin specific version for stability
# Use slim for reduced image size
FROM node AS build

# Set NODE_ENV
ENV NODE_ENV production

# Specify working directory other than /
WORKDIR /app

# Copy only files required to install
# dependencies (better layer caching)
COPY package*.json ./

RUN npm cache clear --force or npm cache clean --force

# Install only production dependencies
# Use cache mount to speed up install of existing dependencies
RUN --mount=type=cache,target=/app/.npm \
  npm set cache /app/.npm && \
  npm ci --only=production

# Use non-root user
# Use --chown on COPY commands to set file permissions
# USER node

# Copy remaining source code AFTER installing dependencies. 
# Again, copy only the necessary files
COPY --chown=node:node ./src/ .

# Indicate expected port
EXPOSE 3000

# Compile TypeScript files before running the application
RUN npm install run

FROM gcr.io/distroless/nodejs20-debian12

COPY --chown=node:node --from=build /app /app

# Start the application
CMD [ "node", "dist/index.js" ]
