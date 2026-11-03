FROM node:22-bookworm-slim AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM deps AS builder
COPY . .
# The build only needs a throwaway database; real content lives in the /data volume.
RUN CMS_DB_PATH=/tmp/build/cms.db MEDIA_DIR=/tmp/build/media npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    CMS_DB_PATH=/data/cms.db \
    MEDIA_DIR=/data/media
RUN groupadd --gid 1001 ats && useradd --uid 1001 --gid 1001 --no-create-home ats \
    && mkdir -p /data && chown 1001:1001 /data
COPY --from=builder --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/.next/static ./.next/static
COPY --from=builder --chown=1001:1001 /app/public ./public
COPY --from=builder --chown=1001:1001 /app/scripts/backup-db.mjs ./scripts/backup-db.mjs
USER 1001:1001
VOLUME ["/data"]
EXPOSE 3000
# node:slim has no curl/wget, so the check uses Node itself.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health',{signal:AbortSignal.timeout(4000)}).then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
