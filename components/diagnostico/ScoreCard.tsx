type Props = {
  label: string;
  score: number;
  scoreSuffix: string;
  detail?: string;
  featured?: boolean;
};

export default function ScoreCard({
  label,
  score,
  scoreSuffix,
  detail,
  featured = false,
}: Props) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <article
      className={`rounded-xl border border-line bg-ash p-5 ${
        featured ? "md:p-7" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-smoke">
            {label}
          </h3>
          {detail && <p className="mt-3 text-sm leading-relaxed text-paper/68">{detail}</p>}
        </div>
        <div className="relative h-24 w-24 shrink-0" aria-label={`${score} ${scoreSuffix}`}>
          <svg viewBox="0 0 100 100" className="-rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(250,250,247,0.12)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-flame transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-display text-3xl">
            {score}
          </span>
        </div>
      </div>
    </article>
  );
}
