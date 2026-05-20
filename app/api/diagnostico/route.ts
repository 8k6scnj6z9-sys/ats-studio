import { lookup } from "node:dns/promises";
import net from "node:net";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { analyzeHtml } from "@/lib/diagnostico/html";
import { calculateDiagnostic } from "@/lib/diagnostico/scoring";
import { captureDiagnosticLead } from "@/lib/diagnostico/leads";
import type { DiagnosticInput, LighthouseScores } from "@/lib/diagnostico/types";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const HTML_TIMEOUT_MS = 9000;
const PAGESPEED_TIMEOUT_MS = 18000;
const MAX_HTML_BYTES = 900_000;
const DIAGNOSTIC_CACHE_MS = 1000 * 60 * 30;

const diagnosticCache = new Map<
  string,
  { expiresAt: number; result: Omit<Awaited<ReturnType<typeof calculateDiagnostic>>, "input"> }
>();

function jsonError(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

function isPrivateIp(ip: string) {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    const [a, b] = parts;
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    );
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    return (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80:") ||
      normalized === "::"
    );
  }

  return true;
}

function normalizeUrl(raw: string) {
  const trimmed = raw.trim();
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(withProtocol);

  if (!["http:", "https:"].includes(url.protocol)) throw new Error("invalid_protocol");
  if (url.username || url.password) throw new Error("invalid_url");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("invalid_port");

  return url;
}

async function assertSafePublicUrl(url: URL) {
  const hostname = url.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "0.0.0.0"
  ) {
    throw new Error("blocked_host");
  }

  if (net.isIP(hostname) && isPrivateIp(hostname)) throw new Error("blocked_ip");

  const records = await lookup(hostname, { all: true, verbatim: true });
  if (!records.length || records.some((record) => isPrivateIp(record.address))) {
    throw new Error("blocked_ip");
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number, init?: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchHtml(startUrl: URL) {
  let current = startUrl;

  for (let redirectCount = 0; redirectCount < 4; redirectCount += 1) {
    await assertSafePublicUrl(current);
    const res = await fetchWithTimeout(current.toString(), HTML_TIMEOUT_MS, {
      redirect: "manual",
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "ATS Studio Digital Diagnostic/1.0",
      },
    });

    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get("location");
      if (!location) throw new Error("website_inaccessible");
      current = new URL(location, current);
      continue;
    }

    if (!res.ok) throw new Error("website_inaccessible");

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new Error("not_html");
    }

    const reader = res.body?.getReader();
    if (!reader) return { html: await res.text(), finalUrl: current };

    let received = 0;
    const chunks: Uint8Array[] = [];
    while (received < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.length;
      chunks.push(value);
    }

    const html = new TextDecoder().decode(Buffer.concat(chunks));
    return { html, finalUrl: current };
  }

  throw new Error("too_many_redirects");
}

async function fetchPageSpeed(
  url: string,
  locale: NonNullable<DiagnosticInput["locale"]>
): Promise<LighthouseScores | null> {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.set("locale", locale === "pt" ? "pt-PT" : "en-US");
  ["performance", "accessibility", "best-practices", "seo"].forEach((category) =>
    endpoint.searchParams.append("category", category)
  );

  if (process.env.PAGESPEED_API_KEY) {
    endpoint.searchParams.set("key", process.env.PAGESPEED_API_KEY);
  }

  try {
    const res = await fetchWithTimeout(endpoint.toString(), PAGESPEED_TIMEOUT_MS);
    if (!res.ok) return null;
    const data = await res.json();
    const categories = data?.lighthouseResult?.categories ?? {};

    return {
      performance: scoreFromCategory(categories.performance),
      accessibility: scoreFromCategory(categories.accessibility),
      seo: scoreFromCategory(categories.seo),
      bestPractices: scoreFromCategory(categories["best-practices"]),
    };
  } catch {
    return null;
  }
}

function scoreFromCategory(category: unknown) {
  const score = (category as { score?: unknown } | undefined)?.score;
  return typeof score === "number" ? Math.round(score * 100) : undefined;
}

function cleanInput(data: Record<string, unknown>, url: URL): DiagnosticInput {
  const locale = data.locale === "en" ? "en" : "pt";

  return {
    url: url.toString(),
    email: String(data.email ?? "").trim().toLowerCase(),
    locale,
    name: String(data.name ?? "").trim() || undefined,
    businessType: String(data.businessType ?? "").trim() || undefined,
  };
}

function getCachedDiagnostic(url: string, input: DiagnosticInput) {
  const cached = diagnosticCache.get(url);
  if (!cached || cached.expiresAt < Date.now()) {
    diagnosticCache.delete(url);
    return null;
  }

  return {
    ...cached.result,
    input,
  };
}

function setCachedDiagnostic(url: string, result: Awaited<ReturnType<typeof calculateDiagnostic>>) {
  const cacheableResult = {
    ok: result.ok,
    scores: result.scores,
    rating: result.rating,
    issues: result.issues,
    recommendations: result.recommendations,
    source: result.source,
  };

  diagnosticCache.set(url, {
    expiresAt: Date.now() + DIAGNOSTIC_CACHE_MS,
    result: cacheableResult,
  });
}

export async function POST(req: Request) {
  const rateLimit = checkRateLimit(req, "diagnostico", {
    windowMs: 60 * 60 * 1000,
    max: 8,
  });

  if (rateLimit.limited) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      }
    );
  }

  try {
    const data = (await req.json()) as Record<string, unknown>;
    const rawUrl = String(data.url ?? "");
    const email = String(data.email ?? "").trim();
    const name = String(data.name ?? "").trim();
    const businessType = String(data.businessType ?? "").trim();
    const honeypot = String(data.website ?? "").trim();
    const privacyConsent = data.privacyConsent === true;

    if (honeypot) return jsonError("analysis_unavailable");
    if (!privacyConsent || !rawUrl || !email) return jsonError("missing_fields");
    if (rawUrl.length > 2048 || name.length > 120 || businessType.length > 160) {
      return jsonError("invalid_fields");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return jsonError("invalid_email");
    if (email.length > 254) return jsonError("invalid_email");

    let normalized: URL;
    try {
      normalized = normalizeUrl(rawUrl);
      await assertSafePublicUrl(normalized);
    } catch {
      return jsonError("invalid_url");
    }

    let htmlResult: Awaited<ReturnType<typeof fetchHtml>>;
    try {
      htmlResult = await fetchHtml(normalized);
    } catch {
      return jsonError("website_inaccessible", 422);
    }

    const input = cleanInput(data, htmlResult.finalUrl);
    const cacheKey = `${htmlResult.finalUrl.toString()}::${input.locale ?? "pt"}`;
    const cachedResult = getCachedDiagnostic(cacheKey, input);

    if (cachedResult) {
      await captureDiagnosticLead(input, cachedResult);
      return NextResponse.json(cachedResult);
    }

    const [htmlSignals, pageSpeedScores] = [
      analyzeHtml(htmlResult.html),
      await fetchPageSpeed(htmlResult.finalUrl.toString(), input.locale ?? "pt"),
    ];

    const result = calculateDiagnostic({
      input,
      htmlSignals,
      lighthouseScores: pageSpeedScores ?? {},
      pagespeedAvailable: Boolean(pageSpeedScores),
    });

    setCachedDiagnostic(cacheKey, result);
    await captureDiagnosticLead(input, result);

    return NextResponse.json(result);
  } catch (error) {
    Sentry.captureException(error);
    return jsonError("analysis_unavailable", 500);
  }
}
