import Image from "next/image";
import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";
import { company, footerContent } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";
import { getServicePages } from "@/lib/service-pages";

type Props = { locale: Locale; dict: Dictionary };

export default async function Footer({ locale, dict }: Props) {
  const year = 2026;
  const content = footerContent[locale];
  const [{ socialLinks }, services] = await Promise.all([getSiteSettings(), getServicePages()]);

  return (
    <footer className="relative border-t border-line bg-ash-2">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-5 py-12 md:grid-cols-12 md:px-10 md:py-16">
        <div className="md:col-span-3">
          <Link href={`/${locale}`} className="inline-flex items-center gap-4">
            <Image
              src="/logos/logo-mark-white.png"
              alt=""
              width={56}
              height={56}
              className="h-12 w-12 object-contain"
            />
            <span className="font-display text-3xl leading-none">
              ATS<span className="text-flame">.</span>Studio
            </span>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/68">
            {content.description}
          </p>
        </div>

        <div className="md:col-span-2">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-smoke">
            {content.contact}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-paper/72">
            <li>
              <a href={`mailto:${company.email}`} className="hover:text-flame">
                {company.email}
              </a>
            </li>
            {company.phone && (
              <li>
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-flame">
                  {company.phone}
                </a>
              </li>
            )}
            <li>{company.location}</li>
          </ul>
        </div>

        {services.length > 0 && (
          <div className="md:col-span-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-smoke">
              {content.services}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-paper/72">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/${locale}/servicos/${service.slug}`} className="hover:text-flame">
                    {service.content[locale].eyebrow}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="md:col-span-2">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-smoke">
            {content.social}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-paper/72">
            {socialLinks.map((social) => (
              <li key={`${social.label}-${social.url}`}>
                <a href={social.url} target="_blank" rel="noreferrer" className="hover:text-flame">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.16em] text-smoke">
            {content.legal}
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-paper/72">
            <li>
              <Link href={`/${locale}/privacy`} className="hover:text-flame">
                {content.privacy}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/terms`} className="hover:text-flame">
                {content.terms}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/cookies`} className="hover:text-flame">
                {content.cookies}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/faq`} className="hover:text-flame">
                {content.faq}
              </Link>
            </li>
            <li>
              <a
                href="https://www.livroreclamacoes.pt/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-flame"
              >
                {locale === "pt" ? "Livro de Reclamações" : "Complaints Book"}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-paper/50">
            Alexandre Terras Simões · NIF 234234903 · 6300 Guarda, Portugal
          </p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-5 font-mono text-[10px] uppercase tracking-[0.14em] text-smoke md:flex-row md:items-center md:justify-between md:px-10">
          <p>© {year} ATS Studio. {content.rights}</p>
          <p>
            Powered by{" "}
            <a
              href="https://atstudio.pt"
              className="transition-colors hover:text-flame"
            >
              ATS Studio
            </a>{" "}
            · {dict.footer.built} · {locale.toUpperCase()}
          </p>
        </div>
      </div>
    </footer>
  );
}
