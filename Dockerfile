# syntax=docker/dockerfile:1

# ---- build ----
FROM node:22-slim AS build
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --config.strict-dep-builds=false

COPY . .
RUN pnpm --filter tbh-shared-types build && pnpm build
RUN CI=true pnpm prune --prod --ignore-scripts --config.strict-dep-builds=false

# ---- runtime ----
FROM node:22-slim
ENV NODE_ENV=production PORT=5000
WORKDIR /app

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/packages ./packages
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./package.json

USER node
EXPOSE 5000
CMD ["node", "dist/main.js"]
