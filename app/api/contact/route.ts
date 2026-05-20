import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

const TO_EMAIL = "geral@atstudio.pt";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "ATS Studio <noreply@atstudio.pt>";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const rateLimit = checkRateLimit(req, "contact", {
    windowMs: 10 * 60 * 1000,
    max: 5,
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

    const name = String(data.name ?? "").trim();
    const email = String(data.email ?? "").trim().toLowerCase();
    const message = String(data.message ?? "").trim();
    const honeypot = String(data.website ?? "").trim();
    const privacyConsent = data.privacyConsent === true;

    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (
      !privacyConsent ||
      name.length < 2 ||
      name.length > 120 ||
      !EMAIL_PATTERN.test(email) ||
      email.length > 254 ||
      message.length < 10 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { ok: false, error: "invalid_fields" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("[contact] email provider is not configured");
      Sentry.captureMessage("Contact email provider is not configured", {
        level: "warning",
      });
      return NextResponse.json(
        { ok: false, error: "email_provider_not_configured" },
        { status: 500 }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Novo contacto ATS Studio - ${name}`,
        text: [
          "Nova mensagem enviada pelo website ATS Studio.",
          "",
          `Nome: ${name}`,
          `Email: ${email}`,
          "",
          "Mensagem:",
          message,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      console.error("[contact] failed to send email", { status: res.status });
      Sentry.captureMessage("Contact email send failed", {
        level: "error",
        extra: { status: res.status },
      });
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
