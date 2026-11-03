// Writes a consistent copy of the CMS database (safe while the site is running).
// Usage inside the container: node scripts/backup-db.mjs /data/backups/cms-<stamp>.db
import { mkdirSync } from "node:fs";
import { createClient } from "@libsql/client";

const target = process.argv[2];
if (!target?.startsWith("/data/backups/") || !target.endsWith(".db")) {
  console.error("Usage: node scripts/backup-db.mjs /data/backups/<name>.db");
  process.exit(1);
}
mkdirSync("/data/backups", { recursive: true });
const db = createClient({ url: `file:${process.env.CMS_DB_PATH ?? "/data/cms.db"}` });
await db.execute({ sql: "VACUUM INTO ?", args: [target] });
const { rows } = await db.execute("SELECT type, count(*) AS n FROM entries GROUP BY type");
console.log(JSON.stringify(Object.fromEntries(rows.map((r) => [r.type, Number(r.n)]))));
