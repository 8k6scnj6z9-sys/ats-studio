import Image from "next/image";
import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";

type Props = { locale: Locale; dict: Dictionary };

export default function Footer({ locale, dict }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/logos/logo-mark-white.png"
            alt=""
            width={56}
            height={56}
            className="w-11 h-11 object-contain"
          />
          <span className="font-display text-2xl leading-none">
            ATS<span className="text-flame">.</span>Studio
          </span>
        </div>

        <p className="font-mono text-xs uppercase tracking-widest text-smoke">
          © {year} ATS Studio. {dict.footer.rights}
        </p>

        <div className="flex flex-wrap items-center gap-5 md:gap-6 text-xs text-smoke">
          <Link
            href={`/${locale}/privacy`}
            className="font-mono uppercase tracking-widest hover:text-flame transition-colors"
          >
            {dict.footer.privacy}
          </Link>
          <Link
            href={`/${locale}/terms`}
            className="font-mono uppercase tracking-widest hover:text-flame transition-colors"
          >
            {dict.footer.terms}
          </Link>
          <span className="font-mono uppercase tracking-widest">
            {dict.contact.location}
          </span>
          <span className="font-mono uppercase tracking-widest">
            {locale.toUpperCase()}
          </span>
        </div>
      </div>
    </footer>
  );
}
