# syntax=docker/dockerfile:1

# ------------------------------------------------------------
# 1. Base Stage: Node LTS Alpine
# ------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app

# ------------------------------------------------------------
# 2. Dependencies Stage: Cached npm ci
# ------------------------------------------------------------
FROM base AS deps
# libc6-compat is required for some native binaries on Alpine Linux
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# ------------------------------------------------------------
# 3. Builder Stage: Build Next.js with standalone output
# ------------------------------------------------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry and set production build environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ------------------------------------------------------------
# 4. Runner Stage: Minimal production runtime
# ------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install curl for container health check probes
RUN apk add --no-cache curl

# Security: Create non-root system user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set permissions for cache folder
RUN mkdir .next && chown nextjs:nodejs .next

# Copy assets and standalone server bundle
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Container-level health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
