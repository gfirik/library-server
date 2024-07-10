FROM oven/bun:1

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY dist ./dist

CMD ["bun", "run", "start"]