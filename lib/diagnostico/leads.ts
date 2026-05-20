import * as Sentry from "@sentry/nextjs";
import type { DiagnosticInput, DiagnosticResult } from "@/lib/diagnostico/types";

const ATS_EMAIL = "geral@atstudio.pt";
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? "ATS Studio <noreply@atstudio.pt>";
type DiagnosticLocale = NonNullable<DiagnosticInput["locale"]>;

const emailCopy = {
  pt: {
    greetingFallback: "Olá",
    notSpecified: "Não indicado",
    visitorSubject: "O teu Diagnóstico Digital - ATS Studio",
    visitorPretitle: "Diagnóstico Digital Gratuito",
    visitorTitle: (score: number) => `O teu website recebeu ${score}/100`,
    visitorIntro: (name: string) =>
      [
        `Olá${name === "Olá" ? "" : ` ${escapeHtml(name)}`},`,
        "obrigado por usares o Diagnóstico Digital da ATS Studio.",
        "Abaixo tens um resumo simples dos principais sinais encontrados e das prioridades que podem ajudar o website a transmitir mais confiança e converter melhor.",
      ].join(" "),
    internalPretitle: "Novo lead de diagnóstico",
    internalTitle: (score: number) => `Novo diagnóstico: ${score}/100`,
    internalIntro:
      "Foi gerado um novo diagnóstico no website da ATS Studio. Seguem os dados do contacto e o resumo enviado ao visitante.",
    labels: {
      website: "Website",
      name: "Nome",
      email: "Email",
      businessType: "Tipo de negócio",
      rating: "Classificação",
      overallScore: "Score geral",
      scores: "Scores",
      issuesVisitor: "Principais sinais a rever",
      issuesInternal: "Problemas principais",
      recommendationsVisitor: "Prioridades recomendadas",
      recommendationsInternal: "Recomendações",
      performance: "Performance",
      seo: "SEO",
      accessibility: "Acessibilidade",
      conversion: "Confiança/Conversão",
      contact: "Contacto direto",
    },
    ctaTitle: "Queres transformar este diagnóstico num plano de ação?",
    ctaText: `Este endereço é apenas de envio automático. Para falar com a ATS Studio, envia email diretamente para ${ATS_EMAIL}.`,
    ctaButton: "Falar com a ATS Studio",
    disclaimer: (pagespeed: boolean) =>
      `Este diagnóstico é uma análise automática inicial${pagespeed ? ", combinando PageSpeed Insights e sinais HTML" : ", baseada em sinais HTML disponíveis no momento"}. Para decisões de design, estratégia e desenvolvimento, recomendamos uma avaliação manual completa.`,
    textOutro: `Para transformar este diagnóstico num plano de ação, envia email diretamente para ${ATS_EMAIL}.`,
    internalSubject: (score: number, url: string) =>
      `Novo Diagnóstico Digital - ${score}/100 - ${url}`,
    internalTextTitle: "Novo Diagnóstico Digital",
  },
  en: {
    greetingFallback: "Hello",
    notSpecified: "Not specified",
    visitorSubject: "Your Digital Diagnostic - ATS Studio",
    visitorPretitle: "Free Digital Diagnostic",
    visitorTitle: (score: number) => `Your website scored ${score}/100`,
    visitorIntro: (name: string) =>
      [
        `Hello${name === "Hello" ? "" : ` ${escapeHtml(name)}`},`,
        "thank you for using ATS Studio's Digital Diagnostic.",
        "Below is a simple summary of the main signals found and the priorities that can help your website build more trust and convert better.",
      ].join(" "),
    internalPretitle: "New diagnostic lead",
    internalTitle: (score: number) => `New diagnostic: ${score}/100`,
    internalIntro:
      "A new diagnostic was generated on the ATS Studio website. Below are the contact details and the summary sent to the visitor.",
    labels: {
      website: "Website",
      name: "Name",
      email: "Email",
      businessType: "Business type",
      rating: "Rating",
      overallScore: "Overall score",
      scores: "Scores",
      issuesVisitor: "Main signals to review",
      issuesInternal: "Main issues",
      recommendationsVisitor: "Recommended priorities",
      recommendationsInternal: "Recommendations",
      performance: "Performance",
      seo: "SEO",
      accessibility: "Accessibility",
      conversion: "Trust/Conversion",
      contact: "Direct contact",
    },
    ctaTitle: "Want to turn this diagnostic into an action plan?",
    ctaText: `This address only sends automated emails. To talk to ATS Studio, email ${ATS_EMAIL} directly.`,
    ctaButton: "Talk to ATS Studio",
    disclaimer: (pagespeed: boolean) =>
      `This diagnostic is an initial automated analysis${pagespeed ? ", combining PageSpeed Insights and HTML signals" : ", based on HTML signals available at the time"}. For design, strategy and development decisions, we recommend a complete manual evaluation.`,
    textOutro: `To turn this diagnostic into an action plan, email ${ATS_EMAIL} directly.`,
    internalSubject: (score: number, url: string) =>
      `New Digital Diagnostic - ${score}/100 - ${url}`,
    internalTextTitle: "New Digital Diagnostic",
  },
} as const;

export async function captureDiagnosticLead(input: DiagnosticInput, result: DiagnosticResult) {
  console.info("[diagnostico] lead captured for future CRM integration", {
    hasName: Boolean(input.name),
    score: result.scores.overall,
  });

  await sendDiagnosticEmails(input, result);
}

async function sendDiagnosticEmails(input: DiagnosticInput, result: DiagnosticResult) {
  if (!process.env.RESEND_API_KEY) {
    console.error("[diagnostico] email provider is not configured");
    Sentry.captureMessage("Diagnostic email provider is not configured", {
      level: "warning",
      extra: { score: result.scores.overall },
    });
    return;
  }

  const summary = buildSummary(input, result);
  const copy = emailCopy[summary.locale];

  const visitorEmail = sendResendEmail({
    to: input.email,
    subject: copy.visitorSubject,
    html: buildVisitorHtml(summary, copy),
    text: buildVisitorText(summary, copy),
  });

  const internalEmail = sendResendEmail({
    to: ATS_EMAIL,
    replyTo: input.email,
    subject: copy.internalSubject(result.scores.overall, input.url),
    html: buildInternalHtml(summary, copy),
    text: buildInternalText(summary, copy),
  });

  const results = await Promise.allSettled([visitorEmail, internalEmail]);
  results.forEach((emailResult, index) => {
    if (emailResult.status === "rejected") {
      console.error("[diagnostico] failed to send email", {
        type: index === 0 ? "visitor" : "internal",
        error:
          emailResult.reason instanceof Error
            ? emailResult.reason.message
            : "unknown_error",
      });
      Sentry.captureMessage("Diagnostic email send failed", {
        level: "error",
        extra: { type: index === 0 ? "visitor" : "internal" },
      });
    }
  });
}

async function sendResendEmail({
  to,
  replyTo,
  subject,
  html,
  text,
}: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`resend_status_${res.status}`);
  }
}

function buildSummary(input: DiagnosticInput, result: DiagnosticResult) {
  const locale: DiagnosticLocale = input.locale ?? "pt";
  const copy = emailCopy[locale];

  return {
    locale,
    name: input.name || copy.greetingFallback,
    url: input.url,
    email: input.email,
    businessType: input.businessType || copy.notSpecified,
    rating: result.rating,
    scores: result.scores,
    issues: result.issues,
    recommendations: result.recommendations,
    pagespeed: result.source.pagespeed,
  };
}

function buildVisitorHtml(
  summary: ReturnType<typeof buildSummary>,
  copy: (typeof emailCopy)[DiagnosticLocale]
) {
  return emailShell({
    locale: summary.locale,
    pretitle: copy.visitorPretitle,
    title: copy.visitorTitle(summary.scores.overall),
    intro: copy.visitorIntro(summary.name),
    body: [
      scoreBlock(summary, copy),
      sectionBlock(
        copy.labels.issuesVisitor,
        summary.issues.map((issue) => ({
          title: issue.title,
          text: issue.description,
        }))
      ),
      sectionBlock(
        copy.labels.recommendationsVisitor,
        summary.recommendations.map((recommendation) => ({
          title: recommendation.title,
          text: recommendation.description,
        }))
      ),
      ctaBlock(copy),
      disclaimerBlock(summary.pagespeed, copy),
    ].join(""),
  });
}

function buildInternalHtml(
  summary: ReturnType<typeof buildSummary>,
  copy: (typeof emailCopy)[DiagnosticLocale]
) {
  return emailShell({
    locale: summary.locale,
    pretitle: copy.internalPretitle,
    title: copy.internalTitle(summary.scores.overall),
    intro: copy.internalIntro,
    body: [
      detailsBlock([
        [copy.labels.website, summary.url],
        [copy.labels.name, summary.name],
        [copy.labels.email, summary.email],
        [copy.labels.businessType, summary.businessType],
        [copy.labels.rating, summary.rating],
      ]),
      scoreBlock(summary, copy),
      sectionBlock(
        copy.labels.issuesInternal,
        summary.issues.map((issue) => ({
          title: issue.title,
          text: issue.description,
        }))
      ),
      sectionBlock(
        copy.labels.recommendationsInternal,
        summary.recommendations.map((recommendation) => ({
          title: recommendation.title,
          text: recommendation.description,
        }))
      ),
      disclaimerBlock(summary.pagespeed, copy),
    ].join(""),
  });
}

function emailShell({
  locale,
  pretitle,
  title,
  intro,
  body,
}: {
  locale: DiagnosticLocale;
  pretitle: string;
  title: string;
  intro: string;
  body: string;
}) {
  return `
<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#0a0a0a;color:#ffffff;font-family:Inter,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;">${escapeHtml(intro)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0a0a0a;padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;border:1px solid rgba(250,250,247,0.14);background:#141414;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:34px 30px 22px;border-bottom:1px solid rgba(250,250,247,0.12);">
                <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#ff5a1f;">${escapeHtml(pretitle)}</p>
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:42px;line-height:0.98;color:#ffffff;">${escapeHtml(title)}</h1>
                <p style="margin:20px 0 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.74);">${escapeHtml(intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 30px 34px;">
                ${body}
                <p style="margin:30px 0 0;padding-top:20px;border-top:1px solid rgba(250,250,247,0.12);font-size:12px;line-height:1.7;color:#a3a3a3;">
                  ATS Studio · Guarda, Portugal<br />
                  ${escapeHtml(emailCopy[locale].labels.contact)}: <a href="mailto:${ATS_EMAIL}" style="color:#ff5a1f;text-decoration:underline;">${ATS_EMAIL}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function scoreBlock(
  summary: ReturnType<typeof buildSummary>,
  copy: (typeof emailCopy)[DiagnosticLocale]
) {
  const items = [
    [copy.labels.performance, summary.scores.performance],
    [copy.labels.seo, summary.scores.seo],
    [copy.labels.accessibility, summary.scores.accessibility],
    [copy.labels.conversion, summary.scores.conversion],
  ];

  return `
    <div style="margin:0 0 24px;padding:22px;border:1px solid rgba(250,250,247,0.12);border-radius:14px;background:#1a1a1a;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#a3a3a3;">${escapeHtml(copy.labels.overallScore)}</p>
      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:58px;line-height:1;color:#ff5a1f;">${summary.scores.overall}<span style="font-size:22px;color:#a3a3a3;">/100</span></p>
      <p style="margin:10px 0 20px;font-size:16px;color:#ffffff;">${escapeHtml(summary.rating)}</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        ${items
          .map(
            ([label, score]) => `
          <tr>
            <td style="padding:10px 0;border-top:1px solid rgba(250,250,247,0.10);font-size:14px;color:rgba(255,255,255,0.72);">${escapeHtml(String(label))}</td>
            <td align="right" style="padding:10px 0;border-top:1px solid rgba(250,250,247,0.10);font-size:14px;color:#ffffff;">${score}/100</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>`;
}

function sectionBlock(title: string, items: { title: string; text: string }[]) {
  return `
    <div style="margin:0 0 24px;">
      <h2 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:28px;line-height:1.1;color:#ffffff;">${escapeHtml(title)}</h2>
      ${items
        .map(
          (item) => `
        <div style="padding:15px 0;border-top:1px solid rgba(250,250,247,0.12);">
          <h3 style="margin:0 0 6px;font-size:15px;line-height:1.35;color:#ffffff;">${escapeHtml(item.title)}</h3>
          <p style="margin:0;font-size:14px;line-height:1.65;color:rgba(255,255,255,0.68);">${escapeHtml(item.text)}</p>
        </div>`
        )
        .join("")}
    </div>`;
}

function detailsBlock(rows: [string, string][]) {
  return `
    <div style="margin:0 0 24px;padding:18px 20px;border:1px solid rgba(250,250,247,0.12);border-radius:14px;background:#1a1a1a;">
      ${rows
        .map(
          ([label, value]) => `
        <p style="margin:0;padding:8px 0;border-bottom:1px solid rgba(250,250,247,0.08);font-size:14px;line-height:1.5;color:rgba(255,255,255,0.72);">
          <strong style="display:inline-block;min-width:140px;color:#ffffff;">${escapeHtml(label)}:</strong>
          ${escapeHtml(value)}
        </p>`
        )
        .join("")}
    </div>`;
}

function ctaBlock(copy: (typeof emailCopy)[DiagnosticLocale]) {
  return `
    <div style="margin:26px 0;padding:22px;border-radius:14px;background:rgba(255,90,31,0.10);border:1px solid rgba(255,90,31,0.34);">
      <h2 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:28px;line-height:1.1;color:#ffffff;">${escapeHtml(copy.ctaTitle)}</h2>
      <p style="margin:0 0 18px;font-size:14px;line-height:1.65;color:rgba(255,255,255,0.72);">${escapeHtml(copy.ctaText)}</p>
      <a href="mailto:${ATS_EMAIL}" style="display:inline-block;padding:13px 18px;border-radius:999px;background:#ff5a1f;color:#0a0a0a;text-decoration:none;font-size:14px;font-weight:700;">${escapeHtml(copy.ctaButton)}</a>
    </div>`;
}

function disclaimerBlock(
  pagespeed: boolean,
  copy: (typeof emailCopy)[DiagnosticLocale]
) {
  return `
    <p style="margin:0;font-size:12px;line-height:1.65;color:#a3a3a3;">
      ${escapeHtml(copy.disclaimer(pagespeed))}
    </p>`;
}

function buildVisitorText(
  summary: ReturnType<typeof buildSummary>,
  copy: (typeof emailCopy)[DiagnosticLocale]
) {
  return [
    copy.visitorSubject,
    "",
    `${copy.labels.website}: ${summary.url}`,
    `${copy.labels.overallScore}: ${summary.scores.overall}/100`,
    `${copy.labels.rating}: ${summary.rating}`,
    "",
    `${copy.labels.scores}:`,
    `${copy.labels.performance}: ${summary.scores.performance}/100`,
    `${copy.labels.seo}: ${summary.scores.seo}/100`,
    `${copy.labels.accessibility}: ${summary.scores.accessibility}/100`,
    `${copy.labels.conversion}: ${summary.scores.conversion}/100`,
    "",
    `${copy.labels.issuesVisitor}:`,
    ...summary.issues.map((issue) => `- ${issue.title}: ${issue.description}`),
    "",
    `${copy.labels.recommendationsVisitor}:`,
    ...summary.recommendations.map(
      (recommendation) => `- ${recommendation.title}: ${recommendation.description}`
    ),
    "",
    copy.textOutro,
  ].join("\n");
}

function buildInternalText(
  summary: ReturnType<typeof buildSummary>,
  copy: (typeof emailCopy)[DiagnosticLocale]
) {
  return [
    copy.internalTextTitle,
    "",
    `${copy.labels.website}: ${summary.url}`,
    `${copy.labels.name}: ${summary.name}`,
    `${copy.labels.email}: ${summary.email}`,
    `${copy.labels.businessType}: ${summary.businessType}`,
    "",
    buildVisitorText(summary, copy),
  ].join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
