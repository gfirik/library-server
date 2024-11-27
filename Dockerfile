FROM oven/bun:latest as base

WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build the app
FROM install AS prerelease
WORKDIR /app
COPY . .  

# Final production image
FROM base AS release
WORKDIR /app
COPY --from=install /app/node_modules /app/node_modules  
COPY --from=prerelease /app .  

USER bun
EXPOSE 3000
CMD ["bun", "api/bot.ts"]