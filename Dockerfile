# Production image for the k3s deployment (.github/workflows/deploy.yml).
#
# Reproduces the Nixpacks image Coolify used to build on gmk: Node 22 (Nixpacks
# ran nodejs_22 via NIXPACKS_NODE_VERSION=22, overriding .node-version), Bun
# 1.3.0 as the package manager, `bun install` → `bun run build` → `bun run start`
# (next start) listening on 0.0.0.0:3000. devDependencies stay installed, as
# with Nixpacks (NPM_CONFIG_PRODUCTION=false).
FROM oven/bun:1.3.0 AS bun

FROM node:22-bookworm-slim AS base
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app

FROM base AS builder
ENV NODE_ENV=production
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
# Next.js inlines NEXT_PUBLIC_* into the pages and bundles at build time.
ARG NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_GTM_ID=${NEXT_PUBLIC_GTM_ID}
RUN bun run build && rm -rf .next/cache

FROM base AS production
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
# Also kept at runtime, as on Coolify, for server code that reads process.env.
ARG NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_GTM_ID=${NEXT_PUBLIC_GTM_ID}
COPY --from=builder --chown=node:node /app ./
USER node
EXPOSE 3000
# Same command as the Nixpacks image: bun runs the "start" script, whose
# `next` binary runs under node.
CMD ["bun", "run", "start"]
