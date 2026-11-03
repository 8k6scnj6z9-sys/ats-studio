#!/usr/bin/env bash
# Daily off-site backup of atstudio.pt (CMS database + uploaded media) to the EU R2 bucket.
# Install on the VPS as /root/ats-backup/atstudio-backup.sh (700) and run from cron.
# Needs: APP_UUID (Coolify app), /root/.config/ats-secrets/r2-backup-eu.env with
# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and R2_ENDPOINT, and resend.env with RESEND_API_KEY.
# --dry-run builds the archive but does not upload.
set -euo pipefail

APP_UUID="${APP_UUID:?APP_UUID em falta}"
BUCKET="s3://ats-supabase-backups-eu/atstudio-site"
KEEP_DAYS=30
ALERT_TO="${ALERT_TO:?ALERT_TO em falta}"
DRY_RUN=0; [[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

stamp="$(date -u +%Y%m%dT%H%M%SZ)"
work="$(mktemp -d)"; chmod 700 "$work"
trap 'rm -rf "$work"' EXIT

alert() {
  # shellcheck disable=SC1091
  source /root/.config/ats-secrets/resend.env
  curl -fsS https://api.resend.com/emails -H "Authorization: Bearer $RESEND_API_KEY" -H "Content-Type: application/json" \
    -d "{\"from\":\"Backups ATS <autarquias@atstudio.pt>\",\"to\":[\"$ALERT_TO\"],\"subject\":\"Falha no backup do atstudio.pt\",\"text\":\"$1 ($stamp)\"}" >/dev/null || true
}
trap 'alert "O backup falhou na linha $LINENO"; rm -rf "$work"' ERR

container="$(docker ps --filter "name=^${APP_UUID}" --filter health=healthy --format '{{.Names}}' | head -n1)"
[[ -n "$container" ]] || { alert "Contentor saudável não encontrado"; exit 1; }

docker exec "$container" mkdir -p /data/backups
docker exec "$container" node scripts/backup-db.mjs "/data/backups/cms-$stamp.db" > "$work/counts.json"
mkdir -p "$work/files"
docker cp "$container:/data/backups/cms-$stamp.db" "$work/files/cms.db"
docker exec "$container" rm -f "/data/backups/cms-$stamp.db"
docker cp "$container:/data/media" "$work/files/media" 2>/dev/null || mkdir -p "$work/files/media"
cp "$work/counts.json" "$work/files/"
(cd "$work/files" && find . -type f ! -name MANIFEST.sha256 -print0 | sort -z | xargs -0 sha256sum > MANIFEST.sha256)
archive="atstudio-$stamp.tar.gz"
tar -C "$work/files" -czf "$work/$archive" .
echo "$(date -Is) archive $archive $(stat -c %s "$work/$archive") bytes, entries $(cat "$work/counts.json")"

if [[ $DRY_RUN -eq 1 ]]; then echo "dry-run: sem envio"; exit 0; fi

aws() {
  docker run --rm --env-file /root/.config/ats-secrets/r2-backup-eu.env -e AWS_DEFAULT_REGION=auto \
    -v "$work:/work" amazon/aws-cli:2.27.0 --endpoint-url "$(grep '^R2_ENDPOINT=' /root/.config/ats-secrets/r2-backup-eu.env | cut -d= -f2-)" "$@"
}
aws s3 cp "/work/$archive" "$BUCKET/$archive" --only-show-errors
aws s3api head-object --bucket ats-supabase-backups-eu --key "atstudio-site/$archive" >/dev/null

# Retention by the timestamp in the name.
cutoff="$(date -u -d "-$KEEP_DAYS days" +%Y%m%d)"
aws s3 ls "$BUCKET/" | awk '{print $4}' | while read -r name; do
  day="${name#atstudio-}"; day="${day:0:8}"
  if [[ "$day" =~ ^[0-9]{8}$ && "$day" < "$cutoff" ]]; then aws s3 rm "$BUCKET/$name" --only-show-errors; fi
done
echo "$(date -Is) ok"
