import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { hasLocale, getDictionary, locales, type Locale } from "@/lib/i18n";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CookieConsent from "@/components/privacy/CookieConsent";
import { company } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";
import { fontVariables } from "@/lib/fonts";

const siteUrl = company.siteUrl;
const portalAnalyticsWebsiteId = process.env.NEXT_PUBLIC_PORTAL_ANALYTICS_WEBSITE_ID ?? "atstudio-pt";
const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID ?? "daa9ba78-b2a2-4f7a-a684-e15399a698a9";

export const viewport: Viewport = {
  themeColor: "#ff5a1f",
  colorScheme: "dark",
};

// Content comes from the CMS database, so pages render per request and show edits immediately.
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  const typedLocale = locale as Locale;
  const canonical = typedLocale === "pt" ? `${siteUrl}/pt` : `${siteUrl}/en`;
  const alternateLocale = typedLocale === "pt" ? "en" : "pt";

  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    applicationName: dict.meta.siteName,
    authors: [{ name: company.founder, url: siteUrl }],
    creator: company.founder,
    publisher: "ATS Studio",
    category: "web design and development",
    keywords: dict.meta.keywords,
    alternates: {
      canonical,
      languages: {
        "pt-PT": `${siteUrl}/pt`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/pt`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon2.png", type: "image/png", sizes: "192x192" },
      ],
      shortcut: ["/favicon2.png"],
      apple: [{ url: "/favicon2.png", type: "image/png", sizes: "192x192" }],
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "website",
      url: canonical,
      siteName: dict.meta.siteName,
      title: dict.meta.shareTitle,
      description: dict.meta.shareDescription,
      locale: typedLocale === "pt" ? "pt_PT" : "en_US",
      alternateLocale: alternateLocale === "pt" ? "pt_PT" : "en_US",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "ATS Studio — web design, development and branding",
        },
        {
          url: "/favicon2.png",
          width: 192,
          height: 192,
          alt: "ATS Studio icon",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.shareTitle,
      description: dict.meta.shareDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const [dict, siteSettings] = await Promise.all([
    getDictionary(typedLocale),
    getSiteSettings(),
  ]);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organization`,
    name: company.name,
    alternateName: "AT Studio",
    url: siteUrl,
    logo: `${siteUrl}/favicon2.png`,
    image: `${siteUrl}/og-image.png`,
    founder: {
      "@type": "Person",
      name: company.founder,
      jobTitle: "Founder, Designer and Developer",
      address: {
        "@type": "PostalAddress",
        addressLocality: company.addressLocality,
        addressCountry: company.addressCountry,
      },
    },
    email: company.email,
    ...(company.phone ? { telephone: company.phone } : {}),
    areaServed: [
      { "@type": "City", name: "Guarda" },
      { "@type": "AdministrativeArea", name: "Distrito da Guarda" },
      { "@type": "Country", name: "Portugal" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: company.addressLocality,
      postalCode: "6300",
      addressRegion: "Guarda",
      addressCountry: company.addressCountry,
    },
    // City-level coordinates (Guarda), not a street address.
    geo: { "@type": "GeoCoordinates", latitude: 40.5373, longitude: -7.2676 },
    hasMap: "https://www.openstreetmap.org/?mlat=40.5373&mlon=-7.2676#map=13/40.5373/-7.2676",
    sameAs: siteSettings.socialLinks.map((social) => social.url),
    description: dict.meta.description,
    serviceType: [
      "Web design",
      "Web development",
      "Custom software development",
      "E-commerce development",
      "Branding",
      "UI/UX design",
      "Digital strategy",
    ],
  };

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
      // The pre-paint consent script adds a class to <html>.
      suppressHydrationWarning
    >
      <head>
        <script
          // Hides the cookie banner before first paint when a choice is already stored.
          dangerouslySetInnerHTML={{
            __html: `try{localStorage.getItem("ats_cookie_consent_v1")&&document.documentElement.classList.add("ats-consent")}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full bg-ink text-paper grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />
        {props.children}
        <CookieConsent
          locale={typedLocale}
          portalTrackerWebsiteId={portalAnalyticsWebsiteId}
          umamiWebsiteId={umamiWebsiteId}
        />
      </body>
    </html>
  );
}
