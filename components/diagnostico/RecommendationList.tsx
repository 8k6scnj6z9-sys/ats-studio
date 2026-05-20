import type {
  DiagnosticIssue,
  DiagnosticRecommendation,
} from "@/lib/diagnostico/types";
import type { Dictionary } from "@/lib/i18n";

type BadgeCopy = Dictionary["diagnosticPage"]["results"]["badges"];

type Props =
  | {
      title: string;
      type: "issues";
      items: DiagnosticIssue[];
      badges: BadgeCopy;
    }
  | {
      title: string;
      type: "recommendations";
      items: DiagnosticRecommendation[];
      badges: BadgeCopy;
    };

export default function RecommendationList({ title, items, type, badges }: Props) {
  return (
    <section className="rounded-xl border border-line bg-ash p-5 md:p-7">
      <h3 className="font-display text-3xl">{title}</h3>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article key={item.title} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-base font-medium text-paper">{item.title}</h4>
              <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-smoke">
                {getBadge(type, item, badges)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-paper/68">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function getBadge(
  type: Props["type"],
  item: DiagnosticIssue | DiagnosticRecommendation,
  labels: BadgeCopy
) {
  if (type === "issues" && "severity" in item) return labels[item.severity];
  if (type === "recommendations" && "priority" in item) return labels[item.priority];
  return labels.medium;
}
