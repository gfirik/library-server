FROM oven/bun:latest as base

WORKDIR /app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM install AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules

COPY --from=prerelease /app/api/bot.ts /app/api/bot.ts
COPY --from=prerelease /app/package.json /app/package.json

USER bun

EXPOSE 3000/tcp

CMD ["bun", "api/bot.ts"]
