# Use the official Bun image
# See all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:latest as base

# Set the working directory
WORKDIR /app

# Install dependencies into temp folder for caching
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies (excluding devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copy node_modules from temp folder and all project files into the image
FROM install AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Final image for production
FROM base AS release
# Copy only production dependencies into the final image
COPY --from=install /temp/prod/node_modules node_modules

# Copy necessary files for the app to run
COPY --from=prerelease /app/api/bot.ts /app/api/bot.ts
COPY --from=prerelease /app/package.json /app/package.json

# Set the user to 'bun' for security
USER bun

# Expose port 3000 (or adjust based on your app)
EXPOSE 3000/tcp

# Run the app
CMD ["bun", "run", "dev"]
