import { checkRateLimit } from "@/lib/security/rate-limit";

// Wall Guard: MalwareBazaar reputation for one SHA-256. Only the hash is received; nothing is stored.
export const dynamic = "force-dynamic";

const cache = new Map<string, { at: number; body: unknown }>();
const TTL = 6 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const limit = checkRateLimit(req, "wallguard-lookup", { windowMs: 60 * 60 * 1000, max: 120 });
  if (limit.limited) {
    return Response.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }
  const key = process.env.WALLGUARD_ABUSECH_KEY;
  if (!key) return Response.json({ error: "unavailable" }, { status: 503 });
  const body = (await req.json().catch(() => null)) as { sha256?: unknown } | null;
  const sha = typeof body?.sha256 === "string" ? body.sha256.toLowerCase() : "";
  if (!/^[a-f0-9]{64}$/.test(sha)) return Response.json({ error: "invalid_hash" }, { status: 400 });

  const hit = cache.get(sha);
  if (hit && Date.now() - hit.at < TTL) return Response.json(hit.body);
  const res = await fetch("https://mb-api.abuse.ch/api/v1/", {
    method: "POST",
    headers: { "Auth-Key": key, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ query: "get_info", hash: sha }),
    cache: "no-store",
  });
  if (!res.ok) return Response.json({ error: "upstream_error" }, { status: 502 });
  const data = (await res.json()) as { query_status?: string; data?: Array<{ signature?: string; tags?: string[]; first_seen?: string }> };
  const d = data.query_status === "ok" ? data.data?.[0] : undefined;
  const out = { known_malware: Boolean(d), signature: d?.signature ?? null, tags: d?.tags ?? [], first_seen: d?.first_seen ?? null };
  if (cache.size > 2000) cache.clear();
  cache.set(sha, { at: Date.now(), body: out });
  return Response.json(out);
}
