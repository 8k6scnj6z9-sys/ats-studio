import { checkRateLimit } from "@/lib/security/rate-limit";

// Wall Guard: recent malware SHA-256 hashes (MalwareBazaar), served with ATS Studio's abuse.ch key.
// The key lives only in the server environment (WALLGUARD_ABUSECH_KEY); installers never carry it.
export const dynamic = "force-dynamic";

let cache: { at: number; body: string } | null = null;
const TTL = 60 * 60 * 1000;

export async function GET(req: Request) {
  const limit = checkRateLimit(req, "wallguard-hashes", { windowMs: 60 * 60 * 1000, max: 30 });
  if (limit.limited) {
    return new Response("rate_limited", { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }
  const key = process.env.WALLGUARD_ABUSECH_KEY;
  if (!key) return new Response("unavailable", { status: 503 });
  if (!cache || Date.now() - cache.at > TTL) {
    const res = await fetch(`https://mb-api.abuse.ch/v2/files/exports/${encodeURIComponent(key)}/recent.csv`, { cache: "no-store" });
    if (!res.ok) return new Response("upstream_error", { status: 502 });
    const hashes = new Set((await res.text()).match(/\b[a-f0-9]{64}\b/gi) ?? []);
    cache = { at: Date.now(), body: [...hashes].map((h) => h.toLowerCase()).join("\n") };
  }
  return new Response(cache.body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=900" } });
}
