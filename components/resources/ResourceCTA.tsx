import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizedResourceHref } from "@/lib/resources";

type Props = {
  locale: Locale;
  title: string;
  text: string;
  label: string;
  href: string;
  variant?: "solid" | "outline";
};

export default function ResourceCTA({
  locale,
  title,
  text,
  label,
  href,
  variant = "solid",
}: Props) {
  const isSolid = variant === "solid";

  return (
    <section
      className={`rounded-xl border p-6 md:p-8 ${
        isSolid
          ? "border-flame/35 bg-flame/10"
          : "border-line bg-ash"
      }`}
    >
      <h2 className="max-w-3xl font-display text-4xl leading-none text-balance md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-paper/72 md:text-base">
        {text}
      </p>
      <Link
        href={localizedResourceHref(locale, href)}
        className={`mt-7 inline-flex rounded-full px-6 py-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-4 focus-visible:ring-offset-ink ${
          isSolid
            ? "bg-flame text-ink hover:bg-paper"
            : "border border-line text-paper hover:border-flame hover:text-flame"
        }`}
      >
        {label}
      </Link>
    </section>
  );
}
