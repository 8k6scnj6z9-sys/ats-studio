type Props = {
  locale?: "pt" | "en";
  category: string;
  readTime: string;
  date?: string;
  publishedLabel?: string;
};

export default function ResourceMeta({
  locale = "pt",
  category,
  readTime,
  date,
  publishedLabel,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-smoke">
      <span className="rounded-full border border-flame/45 px-3 py-1 text-flame">
        {category}
      </span>
      <span>{readTime}</span>
      {date && (
        <>
          <span aria-hidden className="h-px w-5 bg-line" />
          <time dateTime={date}>
            {publishedLabel ? `${publishedLabel} · ` : ""}
            {formatDate(date, locale)}
          </time>
        </>
      )}
    </div>
  );
}

function formatDate(date: string, locale: "pt" | "en") {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(date));
}
