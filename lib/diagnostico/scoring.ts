import type {
  DiagnosticIssue,
  DiagnosticRecommendation,
  DiagnosticResult,
  HtmlSignals,
  LighthouseScores,
  DiagnosticInput,
} from "@/lib/diagnostico/types";

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const stableScore = (value: number) => clampScore(Math.round(value / 5) * 5);
type DiagnosticLocale = NonNullable<DiagnosticInput["locale"]>;

const diagnosticCopy = {
  pt: {
    ratings: {
      veryGood: "Muito bom",
      good: "Bom, mas com margem para melhorar",
      attention: "Precisa de atenção",
      limiting: "Está a limitar o potencial do negócio",
    },
    issues: {
      performance: {
        title: "O website pode estar lento em mobile",
        description:
          "A experiência móvel pode estar a perder visitantes antes de estes perceberem o valor do negócio.",
      },
      seo: {
        title: "A estrutura SEO básica pode ser melhorada",
        description:
          "Títulos, descrições e hierarquia de conteúdo ajudam o Google e os clientes a perceberem melhor a oferta.",
      },
      accessibility: {
        title: "A experiência pode não estar clara para todos os utilizadores",
        description:
          "Pequenas falhas de acessibilidade também afetam leitura, navegação e confiança em mobile.",
      },
      action: {
        title: "Faltam sinais claros de contacto ou próxima ação",
        description:
          "Quando o visitante não sabe o próximo passo, o website deixa de transformar atenção em oportunidades.",
      },
      trust: {
        title: "O website pode não transmitir confiança suficiente à primeira vista",
        description:
          "Contactos visíveis, páginas legais e dados estruturados reforçam legitimidade e reduzem dúvidas.",
      },
      sharing: {
        title: "A página não parece estar otimizada para partilha",
        description:
          "Sem dados de partilha, links enviados por WhatsApp, LinkedIn ou Facebook podem parecer menos profissionais.",
      },
    },
    recommendations: {
      performance: {
        title: "Melhorar velocidade em mobile",
        description:
          "Priorizar compressão de imagens, redução de scripts e otimização do carregamento inicial.",
      },
      seo: {
        title: "Rever títulos, descrições e hierarquia de conteúdo",
        description:
          "Organizar a mensagem principal para que motores de busca e clientes entendam rapidamente o serviço.",
      },
      action: {
        title: "Adicionar uma chamada para ação clara acima da dobra",
        description:
          "Mostrar cedo o próximo passo: pedir orçamento, agendar chamada ou falar diretamente com a equipa.",
      },
      trust: {
        title: "Reforçar sinais de confiança",
        description:
          "Adicionar contactos visíveis, páginas legais, prova social e informação institucional consistente.",
      },
      sharing: {
        title: "Preparar o website para partilha e leitura por plataformas",
        description:
          "Configurar dados Open Graph e schema para melhorar a apresentação da marca fora do próprio site.",
      },
      accessibility: {
        title: "Melhorar leitura e navegação acessível",
        description:
          "Garantir textos alternativos, labels e estrutura semântica para tornar a experiência mais robusta.",
      },
    },
  },
  en: {
    ratings: {
      veryGood: "Very good",
      good: "Good, with room to improve",
      attention: "Needs attention",
      limiting: "It is limiting the business potential",
    },
    issues: {
      performance: {
        title: "The website may be slow on mobile",
        description:
          "The mobile experience may be losing visitors before they understand the value of the business.",
      },
      seo: {
        title: "The basic SEO structure can be improved",
        description:
          "Titles, descriptions and content hierarchy help Google and clients understand the offer more clearly.",
      },
      accessibility: {
        title: "The experience may not be clear for every user",
        description:
          "Small accessibility gaps also affect readability, navigation and trust on mobile.",
      },
      action: {
        title: "Clear contact or next-action signals are missing",
        description:
          "When visitors do not know the next step, the website stops turning attention into opportunities.",
      },
      trust: {
        title: "The website may not build enough trust at first glance",
        description:
          "Visible contacts, legal pages and structured data reinforce legitimacy and reduce doubts.",
      },
      sharing: {
        title: "The page does not appear optimized for sharing",
        description:
          "Without sharing data, links sent through WhatsApp, LinkedIn or Facebook can look less professional.",
      },
    },
    recommendations: {
      performance: {
        title: "Improve mobile speed",
        description:
          "Prioritize image compression, script reduction and optimization of the initial load.",
      },
      seo: {
        title: "Review titles, descriptions and content hierarchy",
        description:
          "Organize the main message so search engines and clients quickly understand the service.",
      },
      action: {
        title: "Add a clear call to action above the fold",
        description:
          "Show the next step early: request a quote, schedule a call or talk directly with the team.",
      },
      trust: {
        title: "Strengthen trust signals",
        description:
          "Add visible contacts, legal pages, social proof and consistent institutional information.",
      },
      sharing: {
        title: "Prepare the website for sharing and platform previews",
        description:
          "Configure Open Graph data and schema to improve how the brand appears outside its own website.",
      },
      accessibility: {
        title: "Improve accessible reading and navigation",
        description:
          "Ensure alternative text, labels and semantic structure to make the experience more robust.",
      },
    },
  },
} as const;

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

function scoreChecks(checks: boolean[]) {
  return clampScore((checks.filter(Boolean).length / checks.length) * 100);
}

function htmlSeoScore(signals: HtmlSignals) {
  return scoreChecks([
    signals.title,
    signals.metaDescription,
    signals.h1,
    signals.canonical,
    signals.viewport,
    signals.openGraph,
    signals.robots || signals.sitemap,
  ]);
}

function htmlAccessibilityScore(signals: HtmlSignals) {
  const ratioChecks = [
    signals.imagesWithAltRatio === null ? true : signals.imagesWithAltRatio >= 0.8,
    signals.inputsWithLabelsRatio === null ? true : signals.inputsWithLabelsRatio >= 0.8,
  ];

  return scoreChecks([signals.lang, signals.headingStructure, ...ratioChecks]);
}

function conversionScore(signals: HtmlSignals) {
  return scoreChecks([
    signals.contactLinkOrText,
    signals.visibleEmailOrPhone,
    signals.clearCta,
    signals.form,
    signals.legalLinks,
    signals.schema,
    signals.headingStructure,
    signals.openGraph,
  ]);
}

function combinedScore(lighthouse: number | undefined, htmlScore: number) {
  if (typeof lighthouse !== "number") return htmlScore;
  return stableScore(lighthouse * 0.78 + htmlScore * 0.22);
}

export function getRating(overall: number, locale: DiagnosticLocale = "pt") {
  const ratings = diagnosticCopy[locale].ratings;
  if (overall >= 90) return ratings.veryGood;
  if (overall >= 70) return ratings.good;
  if (overall >= 50) return ratings.attention;
  return ratings.limiting;
}

function buildIssues(
  scores: DiagnosticResult["scores"],
  signals: HtmlSignals,
  locale: DiagnosticLocale
): DiagnosticIssue[] {
  const issues: DiagnosticIssue[] = [];
  const copy = diagnosticCopy[locale].issues;

  if (scores.performance < 70) {
    issues.push({
      title: copy.performance.title,
      description: copy.performance.description,
      severity: scores.performance < 50 ? "high" : "medium",
    });
  }

  if (scores.seo < 75) {
    issues.push({
      title: copy.seo.title,
      description: copy.seo.description,
      severity: scores.seo < 55 ? "high" : "medium",
    });
  }

  if (scores.accessibility < 75) {
    issues.push({
      title: copy.accessibility.title,
      description: copy.accessibility.description,
      severity: scores.accessibility < 55 ? "high" : "medium",
    });
  }

  if (!signals.clearCta || !signals.contactLinkOrText) {
    issues.push({
      title: copy.action.title,
      description: copy.action.description,
      severity: "high",
    });
  }

  if (!signals.visibleEmailOrPhone || !signals.legalLinks || !signals.schema) {
    issues.push({
      title: copy.trust.title,
      description: copy.trust.description,
      severity: "medium",
    });
  }

  if (!signals.openGraph) {
    issues.push({
      title: copy.sharing.title,
      description: copy.sharing.description,
      severity: "low",
    });
  }

  return issues.slice(0, 5);
}

function buildRecommendations(
  scores: DiagnosticResult["scores"],
  signals: HtmlSignals,
  locale: DiagnosticLocale
): DiagnosticRecommendation[] {
  const recommendations: DiagnosticRecommendation[] = [];
  const copy = diagnosticCopy[locale].recommendations;

  if (scores.performance < 75) {
    recommendations.push({
      title: copy.performance.title,
      description: copy.performance.description,
      priority: "high",
    });
  }

  if (scores.seo < 80) {
    recommendations.push({
      title: copy.seo.title,
      description: copy.seo.description,
      priority: "high",
    });
  }

  if (!signals.clearCta || !signals.contactLinkOrText) {
    recommendations.push({
      title: copy.action.title,
      description: copy.action.description,
      priority: "high",
    });
  }

  if (!signals.visibleEmailOrPhone || !signals.legalLinks) {
    recommendations.push({
      title: copy.trust.title,
      description: copy.trust.description,
      priority: "high",
    });
  }

  if (!signals.openGraph || !signals.schema) {
    recommendations.push({
      title: copy.sharing.title,
      description: copy.sharing.description,
      priority: "medium",
    });
  }

  if (scores.accessibility < 80) {
    recommendations.push({
      title: copy.accessibility.title,
      description: copy.accessibility.description,
      priority: "medium",
    });
  }

  return recommendations.slice(0, 3);
}

export function calculateDiagnostic({
  input,
  htmlSignals,
  lighthouseScores,
  pagespeedAvailable,
}: {
  input: DiagnosticInput;
  htmlSignals: HtmlSignals;
  lighthouseScores: LighthouseScores;
  pagespeedAvailable: boolean;
}): DiagnosticResult {
  const locale = input.locale ?? "pt";
  const htmlSeo = htmlSeoScore(htmlSignals);
  const htmlAccessibility = htmlAccessibilityScore(htmlSignals);
  const conversion = conversionScore(htmlSignals);
  const performanceFallback = clampScore(
    average([htmlSignals.viewport ? 78 : 58, htmlSignals.imagesWithAltRatio === null ? 72 : 58 + htmlSignals.imagesWithAltRatio * 30])
  );

  const performance = combinedScore(lighthouseScores.performance, performanceFallback);
  const seo = combinedScore(lighthouseScores.seo, htmlSeo);
  const accessibility = combinedScore(lighthouseScores.accessibility, htmlAccessibility);
  const conversionFinal = stableScore(conversion);
  const overall = stableScore(
    performance * 0.3 + seo * 0.25 + accessibility * 0.2 + conversionFinal * 0.25
  );

  const scores = {
    overall,
    performance,
    seo,
    accessibility,
    conversion: conversionFinal,
  };

  return {
    ok: true,
    input,
    scores,
    rating: getRating(overall, locale),
    issues: buildIssues(scores, htmlSignals, locale),
    recommendations: buildRecommendations(scores, htmlSignals, locale),
    source: {
      pagespeed: pagespeedAvailable,
      htmlChecks: true,
    },
  };
}
