export type DiagnosticSeverity = "low" | "medium" | "high";
export type DiagnosticPriority = "medium" | "high";

export type DiagnosticInput = {
  url: string;
  email: string;
  locale?: "pt" | "en";
  name?: string;
  businessType?: string;
};

export type DiagnosticScores = {
  overall: number;
  performance: number;
  seo: number;
  accessibility: number;
  conversion: number;
};

export type DiagnosticIssue = {
  title: string;
  description: string;
  severity: DiagnosticSeverity;
};

export type DiagnosticRecommendation = {
  title: string;
  description: string;
  priority: DiagnosticPriority;
};

export type DiagnosticSource = {
  pagespeed: boolean;
  htmlChecks: boolean;
};

export type DiagnosticResult = {
  ok: true;
  input: DiagnosticInput;
  scores: DiagnosticScores;
  rating: string;
  issues: DiagnosticIssue[];
  recommendations: DiagnosticRecommendation[];
  source: DiagnosticSource;
};

export type HtmlSignals = {
  title: boolean;
  metaDescription: boolean;
  h1: boolean;
  canonical: boolean;
  viewport: boolean;
  robots: boolean;
  sitemap: boolean;
  openGraph: boolean;
  lang: boolean;
  imagesWithAltRatio: number | null;
  inputsWithLabelsRatio: number | null;
  contactLinkOrText: boolean;
  visibleEmailOrPhone: boolean;
  clearCta: boolean;
  form: boolean;
  legalLinks: boolean;
  schema: boolean;
  headingStructure: boolean;
};

export type LighthouseScores = Partial<{
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}>;
