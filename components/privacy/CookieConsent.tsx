"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { cookieContent } from "@/lib/site-content";

type Consent = {
  essential: true;
  analytics: boolean;
  updatedAt: string;
};

type Props = {
  locale: Locale;
  gaId?: string;
  metaPixelId?: string;
};

const STORAGE_KEY = "ats_cookie_consent_v1";

export default function CookieConsent({ locale, gaId, metaPixelId }: Props) {
  const copy = cookieContent[locale];
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent | null>(null);
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  const hasTracking = useMemo(() => Boolean(gaId || metaPixelId), [gaId, metaPixelId]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const initialState = getInitialConsentState();
      setConsent(initialState.consent);
      setVisible(initialState.visible);
      setAnalytics(initialState.analytics);
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (consent?.analytics) loadTracking({ gaId, metaPixelId });
  }, [consent?.analytics, gaId, metaPixelId]);

  useEffect(() => {
    if (!consent?.analytics || !gaId || !window.gtag) return;

    const pagePath = `${pathname}${window.location.search}`;
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [consent?.analytics, gaId, pathname]);

  const saveConsent = (allowAnalytics: boolean) => {
    const next: Consent = {
      essential: true,
      analytics: allowAnalytics,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setConsent(next);
    setAnalytics(allowAnalytics);
    setVisible(false);
    setPreferencesOpen(false);
    if (allowAnalytics) loadTracking({ gaId, metaPixelId });
  };

  return (
    <>
      {visible && (
        <section
          aria-label={copy.bannerTitle}
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-5xl rounded-lg border border-line bg-ash/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-md md:inset-x-8 md:p-5"
        >
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="font-display text-2xl">{copy.bannerTitle}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-paper/70">
                {copy.bannerText}{" "}
                <Link href={`/${locale}/cookies`} className="text-flame underline underline-offset-4">
                  {copy.policy}
                </Link>
              </p>
              {!hasTracking && (
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-smoke">
                  Tracking IDs not configured in this environment.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 md:justify-end">
              <button
                type="button"
                onClick={() => setPreferencesOpen(true)}
                className="rounded-full border border-line px-4 py-2 text-sm text-paper hover:border-flame hover:text-flame"
              >
                {copy.preferences}
              </button>
              <button
                type="button"
                onClick={() => saveConsent(false)}
                className="rounded-full border border-line px-4 py-2 text-sm text-paper hover:bg-paper hover:text-ink"
              >
                {copy.reject}
              </button>
              <button
                type="button"
                onClick={() => saveConsent(true)}
                className="rounded-full bg-flame px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
              >
                {copy.accept}
              </button>
            </div>
          </div>
        </section>
      )}

      {preferencesOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 px-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            className="w-full max-w-xl rounded-lg border border-line bg-ash p-5 shadow-2xl md:p-6"
          >
            <h2 id="cookie-preferences-title" className="font-display text-3xl">
              {copy.modalTitle}
            </h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-md border border-line p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{copy.essential}</h3>
                    <p className="mt-1 text-sm text-paper/65">{copy.essentialText}</p>
                  </div>
                  <span className="font-mono text-xs uppercase text-flame">On</span>
                </div>
              </div>
              <label className="block rounded-md border border-line p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-medium">{copy.analytics}</span>
                    <p className="mt-1 text-sm text-paper/65">{copy.analyticsText}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) => setAnalytics(event.target.checked)}
                    className="mt-1 h-5 w-5 accent-flame"
                  />
                </div>
              </label>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreferencesOpen(false);
                  setAnalytics(consent?.analytics ?? false);
                }}
                className="rounded-full border border-line px-4 py-2 text-sm text-paper hover:border-flame hover:text-flame"
              >
                {copy.reject}
              </button>
              <button
                type="button"
                onClick={() => saveConsent(analytics)}
                className="rounded-full bg-flame px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
              >
                {copy.save}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function getInitialConsentState(): {
  consent: Consent | null;
  visible: boolean;
  analytics: boolean;
} {
  if (typeof window === "undefined") {
    return { consent: null, visible: false, analytics: false };
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return { consent: null, visible: true, analytics: false };
    const parsed = JSON.parse(stored) as Consent;
    return {
      consent: parsed,
      visible: false,
      analytics: parsed.analytics,
    };
  } catch {
    return { consent: null, visible: true, analytics: false };
  }
}

function loadTracking({
  gaId,
  metaPixelId,
}: {
  gaId?: string;
  metaPixelId?: string;
}) {
  if (gaId && !document.querySelector(`script[data-ats-ga="${gaId}"]`)) {
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    gaScript.dataset.atsGa = gaId;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true, send_page_view: false });
  }

  if (metaPixelId && !document.querySelector(`script[data-ats-meta="${metaPixelId}"]`)) {
    const script = document.createElement("script");
    script.dataset.atsMeta = metaPixelId;
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${metaPixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  }
}
