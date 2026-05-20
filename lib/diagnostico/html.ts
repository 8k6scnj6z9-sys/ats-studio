import type { HtmlSignals } from "@/lib/diagnostico/types";

const tagRegex = (tag: string) => new RegExp(`<${tag}\\b[^>]*>`, "gi");

function hasPattern(html: string, pattern: RegExp) {
  return pattern.test(html);
}

function countMatches(html: string, pattern: RegExp) {
  return html.match(pattern)?.length ?? 0;
}

function getAttr(tag: string, attr: string) {
  const match = tag.match(new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1]?.trim() ?? "";
}

function imageAltRatio(html: string) {
  const images = html.match(tagRegex("img")) ?? [];
  if (images.length === 0) return null;
  const withAlt = images.filter((tag) => getAttr(tag, "alt").length > 0).length;
  return withAlt / images.length;
}

function inputLabelRatio(html: string) {
  const inputs = (html.match(tagRegex("input")) ?? []).filter(
    (tag) => !/type\s*=\s*["']?(hidden|submit|button|checkbox|radio)/i.test(tag)
  );
  if (inputs.length === 0) return null;

  const labels = html.match(/<label\b[^>]*>/gi) ?? [];
  const labelFors = new Set(labels.map((label) => getAttr(label, "for")).filter(Boolean));
  const labelled = inputs.filter((input) => {
    const id = getAttr(input, "id");
    const ariaLabel = getAttr(input, "aria-label");
    const ariaLabelledBy = getAttr(input, "aria-labelledby");
    return Boolean((id && labelFors.has(id)) || ariaLabel || ariaLabelledBy);
  });

  return labelled.length / inputs.length;
}

export function analyzeHtml(html: string): HtmlSignals {
  const lower = html.toLowerCase();
  const h1Count = countMatches(html, /<h1\b[^>]*>/gi);
  const headingCount = countMatches(html, /<h[1-6]\b[^>]*>/gi);

  return {
    title: hasPattern(html, /<title\b[^>]*>[^<]{8,}<\/title>/i),
    metaDescription: hasPattern(
      html,
      /<meta\b(?=[^>]*name=["']description["'])(?=[^>]*content=["'][^"']{40,}["'])[^>]*>/i
    ),
    h1: h1Count >= 1,
    canonical: hasPattern(html, /<link\b(?=[^>]*rel=["']canonical["'])(?=[^>]*href=)[^>]*>/i),
    viewport: hasPattern(html, /<meta\b(?=[^>]*name=["']viewport["'])(?=[^>]*content=)[^>]*>/i),
    robots: hasPattern(html, /<meta\b(?=[^>]*name=["']robots["'])(?=[^>]*content=)[^>]*>/i),
    sitemap: lower.includes("sitemap.xml"),
    openGraph: hasPattern(html, /<meta\b(?=[^>]*property=["']og:[^"']+["'])/i),
    lang: hasPattern(html, /<html\b(?=[^>]*lang=["'][a-z]{2}[^"']*["'])/i),
    imagesWithAltRatio: imageAltRatio(html),
    inputsWithLabelsRatio: inputLabelRatio(html),
    contactLinkOrText: /contact|contacto|contato|fale connosco|falar|marcar|orçamento|orcamento/i.test(html),
    visibleEmailOrPhone:
      /mailto:|[\w.+-]+@[\w.-]+\.[a-z]{2,}|\+?\d[\d\s().-]{7,}\d/i.test(html),
    clearCta:
      /pedir orçamento|pedir orcamento|falar connosco|falar conosco|contactar|agendar|marcar|comprar|reservar|começar|comecar|solicitar/i.test(
        html
      ),
    form: hasPattern(html, /<form\b/i),
    legalLinks: /privacy|privacidade|terms|termos|cookies|legal/i.test(html),
    schema: hasPattern(html, /application\/ld\+json|schema\.org/i),
    headingStructure: h1Count === 1 && headingCount >= 2,
  };
}
