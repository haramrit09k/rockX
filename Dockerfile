FROM node:16.20.2-bullseye-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM node:24.4.0-bookworm-slim AS runtime

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/dist/rockX ./dist/rockX
COPY server.js ./server.js

USER node
CMD ["node", "server.js"]
