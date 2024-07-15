# Use the official Bun image
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies into a temp directory
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy dependencies and application code
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules ./node_modules
COPY . .

# Build the application
ENV NODE_ENV=production
RUN bun build src/index.ts --outfile=dist/index.js --target=bun

# Prepare the final image
FROM base AS release
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/dist ./dist
COPY --from=prerelease /usr/src/app/package.json ./package.json

# Run the application
USER bun
CMD ["bun", "dist/index.js"]
