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

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const vercelIp = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  return forwardedIp || realIp || vercelIp || "anonymous";
}
