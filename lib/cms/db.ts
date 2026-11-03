import "server-only";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { and, asc, eq, sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { legalContent } from "@/lib/legal-content";
import seed from "./seed.json";
import type { EntryType } from "./schema";

export const entries = sqliteTable(
  "entries",
  {
    type: text("type").notNull(),
    key: text("key").notNull(),
    position: integer("position").notNull().default(0),
    data: text("data", { mode: "json" }).notNull(),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [primaryKey({ columns: [t.type, t.key] })],
);

export const dbPath = resolve(/* turbopackIgnore: true */ process.env.CMS_DB_PATH ?? "data/cms.db");

mkdirSync(dirname(dbPath), { recursive: true });
const db = drizzle(createClient({ url: `file:${dbPath}` }));

let ready: Promise<void> | undefined;

// Creates the table and loads the Sanity export + legal texts the first time the database is empty.
function init() {
  ready ??= (async () => {
    await db.run(sql`PRAGMA busy_timeout = 5000`);
    await db.run(sql`PRAGMA journal_mode = WAL`);
    await db.run(sql`CREATE TABLE IF NOT EXISTS entries (
      type TEXT NOT NULL,
      key TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (type, key)
    )`);
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(entries);
    if (count > 0) return;

    const rows: { type: string; key: string; position: number; data: unknown }[] = [];
    for (const [type, items] of Object.entries(seed)) {
      items.forEach((item, position) => rows.push({ type, key: item.key, position, data: item.data }));
    }
    (["privacy", "terms", "cookies"] as const).forEach((kind, position) =>
      rows.push({
        type: "legalPage",
        key: kind,
        position,
        data: { pt: legalContent.pt[kind], en: legalContent.en[kind] },
      }),
    );
    await db.insert(entries).values(rows).onConflictDoNothing();
  })().catch((error) => {
    ready = undefined;
    throw error;
  });
  return ready;
}

export async function listEntries<T>(type: EntryType) {
  await init();
  const rows = await db
    .select()
    .from(entries)
    .where(eq(entries.type, type))
    .orderBy(asc(entries.position), asc(entries.key));
  return rows.map((row) => ({ ...row, data: row.data as T }));
}

export async function getEntry<T>(type: EntryType, key: string) {
  await init();
  const [row] = await db
    .select()
    .from(entries)
    .where(and(eq(entries.type, type), eq(entries.key, key)));
  return row ? { ...row, data: row.data as T } : undefined;
}

export async function saveEntry(
  type: EntryType,
  key: string,
  data: unknown,
  previousKey?: string,
) {
  await init();
  await db.transaction(async (tx) => {
    let position = 0;
    const [existing] = await tx
      .select({ position: entries.position })
      .from(entries)
      .where(and(eq(entries.type, type), eq(entries.key, previousKey ?? key)));
    if (existing) {
      position = existing.position;
    } else {
      const [{ max }] = await tx
        .select({ max: sql<number>`coalesce(max(position), -1)` })
        .from(entries)
        .where(eq(entries.type, type));
      position = max + 1;
    }
    if (previousKey && previousKey !== key) {
      await tx.delete(entries).where(and(eq(entries.type, type), eq(entries.key, previousKey)));
    }
    await tx
      .insert(entries)
      .values({ type, key, position, data })
      .onConflictDoUpdate({
        target: [entries.type, entries.key],
        set: { data, updatedAt: sql`CURRENT_TIMESTAMP` },
      });
  });
}

export async function deleteEntry(type: EntryType, key: string) {
  await init();
  await db.delete(entries).where(and(eq(entries.type, type), eq(entries.key, key)));
}

export async function moveEntry(type: EntryType, key: string, direction: -1 | 1) {
  const rows = await listEntries(type);
  const index = rows.findIndex((row) => row.key === key);
  const other = rows[index + direction];
  if (index < 0 || !other) return;
  const ordered = rows.map((row) => row.key);
  [ordered[index], ordered[index + direction]] = [ordered[index + direction], ordered[index]];
  await db.transaction(async (tx) => {
    for (const [position, k] of ordered.entries()) {
      await tx.update(entries).set({ position }).where(and(eq(entries.type, type), eq(entries.key, k)));
    }
  });
}

export async function checkDatabase() {
  await init();
  await db.run(sql`SELECT 1 FROM entries LIMIT 1`);
}
