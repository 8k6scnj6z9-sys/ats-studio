import { BlockList, isIPv4, isIPv6 } from "node:net";

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  request: Request,
  scope: string,
  { windowMs, max }: RateLimitOptions
) {
  const now = Date.now();
  const key = `${scope}:${getClientIdentifier(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }

  current.count += 1;
  buckets.set(key, current);

  return {
    limited: current.count > max,
    retryAfter: Math.ceil((current.resetAt - now) / 1000),
  };
}

// Cloudflare edge ranges (https://www.cloudflare.com/ips/, checked 2026-11-03).
// shortcut: static list, refresh it if Cloudflare announces new ranges.
const cloudflare = new BlockList();
for (const cidr of [
  "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22", "141.101.64.0/18",
  "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20", "197.234.240.0/22", "198.41.128.0/17",
  "162.158.0.0/15", "104.16.0.0/13", "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
  "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32", "2405:8100::/32",
  "2a06:98c0::/29", "2c0f:f248::/32",
]) {
  const [network, prefix] = cidr.split("/");
  cloudflare.addSubnet(network, Number(prefix), isIPv6(network) ? "ipv6" : "ipv4");
}

function fromCloudflare(ip: string) {
  const family = isIPv6(ip) ? "ipv6" : isIPv4(ip) ? "ipv4" : null;
  return family !== null && cloudflare.check(ip, family);
}

// Traefik replaces X-Forwarded-For with the connecting peer. When that peer is a Cloudflare
// edge, the visitor is in CF-Connecting-IP; from anyone else that header could be forged.
export function getClientIdentifier(request: Request) {
  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const peer = forwardedIp || realIp;
  const cloudflareIp = request.headers.get("cf-connecting-ip")?.trim();
  if (peer && cloudflareIp && fromCloudflare(peer)) return cloudflareIp;
  return peer || "anonymous";
}
