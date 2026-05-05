"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale, Dictionary } from "@/lib/i18n";

type Props = {
  locale: Locale;
  dict: Dictionary;
  solid?: boolean;
};

export default function Navbar({ locale, dict, solid = false }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    window.dispatchEvent(new Event("ats:menu-lock"));
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
      window.dispatchEvent(new Event("ats:menu-unlock"));
    };
  }, [open]);

  const otherLocale: Locale = locale === "pt" ? "en" : "pt";
  const otherPath =
    pathname && pathname.startsWith(`/${locale}`)
      ? `/${otherLocale}${pathname.slice(3) || "/"}`
      : `/${otherLocale}`;

  const links: { href: string; label: string }[] = [
    { href: `/${locale}#work`, label: dict.nav.work },
    { href: `/${locale}#services`, label: dict.nav.services },
    { href: `/${locale}#about`, label: dict.nav.about },
    { href: `/${locale}#process`, label: dict.nav.process },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  const handleMobileLink = (
    href: string,
    event: MouseEvent<HTMLAnchorElement>
  ) => {
    const hash = href.split("#")[1];
    if (!hash || !href.startsWith(`/${locale}#`)) {
      setOpen(false);
      return;
    }

    event.preventDefault();
    setOpen(false);

    window.setTimeout(() => {
      const target = document.getElementById(hash);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", href);
    }, 80);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || solid
          ? "backdrop-blur-md bg-ink/60 border-b border-line"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto max-w-[1600px] px-5 md:px-10 h-18 md:h-24 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-4 z-50"
          aria-label="ATS Studio"
        >
          <Image
            src="/logos/logo-mark-white.png"
            alt=""
            width={64}
            height={64}
            className="w-11 h-11 md:w-14 md:h-14 object-contain"
            priority
          />
          <span className="font-display text-2xl md:text-3xl leading-none">
            ATS<span className="text-flame">.</span>Studio
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="relative text-paper/80 hover:text-flame transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-flame after:transition-transform hover:after:scale-x-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href={otherPath}
            className="font-mono text-xs tracking-widest uppercase text-smoke hover:text-paper transition-colors"
          >
            {locale.toUpperCase()} ↗
          </Link>
        </div>

        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden z-50 flex flex-col gap-1.5 w-9 h-9 items-center justify-center"
        >
          <span
            className={`block h-px w-6 bg-paper transition-transform ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-paper transition-transform ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden fixed inset-0 z-40 bg-ink flex flex-col justify-center px-6 overflow-hidden overscroll-none touch-none"
              onTouchMove={(event) => event.preventDefault()}
            >
              <ul className="flex flex-col gap-6">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <Link
                      href={l.href}
                      onClick={(event) => handleMobileLink(l.href, event)}
                      className="font-display text-5xl text-paper hover:text-flame"
                    >
                      {l.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-12 flex items-center gap-6 text-sm">
                <Link
                  href={otherPath}
                  onClick={() => setOpen(false)}
                  className="font-mono uppercase tracking-widest text-smoke"
                >
                  {locale.toUpperCase()} ↗
                </Link>
                <span className="font-mono text-xs text-smoke">
                  geral@atstudio.pt
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
