import Link from "next/link";
import type { DiagnosticResult } from "@/lib/diagnostico/types";
import type { Dictionary } from "@/lib/i18n";
import ScoreCard from "@/components/diagnostico/ScoreCard";
import RecommendationList from "@/components/diagnostico/RecommendationList";

type Props = {
  result: DiagnosticResult;
  copy: Dictionary["diagnosticPage"]["results"];
  contactHref: string;
};

export default function DiagnosticResults({ result, copy, contactHref }: Props) {
  const scores = [
    [copy.scores.performance, result.scores.performance],
    [copy.scores.seo, result.scores.seo],
    [copy.scores.accessibility, result.scores.accessibility],
    [copy.scores.conversion, result.scores.conversion],
  ] as const;

  return (
    <section aria-labelledby="diagnostico-resultado" className="space-y-6">
      <ScoreCard
        featured
        label={copy.overallLabel}
        score={result.scores.overall}
        scoreSuffix={copy.scoreSuffix}
        detail={result.rating}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {scores.map(([label, score]) => (
          <ScoreCard
            key={label}
            label={label}
            score={score}
            scoreSuffix={copy.scoreSuffix}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecommendationList
          title={copy.issuesTitle}
          type="issues"
          items={result.issues}
          badges={copy.badges}
        />
        <RecommendationList
          title={copy.recommendationsTitle}
          type="recommendations"
          items={result.recommendations}
          badges={copy.badges}
        />
      </div>

      <div className="rounded-xl border border-flame/35 bg-flame/10 p-6 md:p-8">
        <h2 id="diagnostico-resultado" className="font-display text-4xl text-balance">
          {copy.ctaTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/72">
          {copy.ctaDescription}
        </p>
        <Link
          href={contactHref}
          className="mt-6 inline-flex rounded-full bg-flame px-6 py-4 text-sm font-medium text-ink transition-colors hover:bg-paper"
        >
          {copy.ctaButton}
        </Link>
      </div>

      <p className="text-xs leading-relaxed text-smoke">
        {copy.disclaimer}
      </p>
    </section>
  );
}
