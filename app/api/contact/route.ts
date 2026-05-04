import { NextResponse } from "next/server";

const TO_EMAIL = "geral@atstudio.pt";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL ?? "ATS Studio <noreply@atstudio.pt>";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const name = String(data.name ?? "").trim();
    const email = String(data.email ?? "").trim();
    const message = String(data.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("[contact] RESEND_API_KEY is not configured", {
        to: TO_EMAIL,
        name,
        email,
        length: message.length,
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
      const error = await res.text();
      console.error("[contact] failed to send email", error);
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
