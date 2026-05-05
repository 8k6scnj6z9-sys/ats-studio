import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { hasLocale, getDictionary, locales, type Locale } from "@/lib/i18n";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

const siteUrl = "https://atstudio.pt";

export const viewport: Viewport = {
  themeColor: "#ff5a1f",
  colorScheme: "dark",
};

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
    authors: [{ name: "Alexandre Terras Simões", url: siteUrl }],
    creator: "Alexandre Terras Simões",
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
        { url: "/favicon.ico", type: "image/x-icon", sizes: "32x32" },
        { url: "/favicon.png", type: "image/png" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [{ url: "/favicon.png", type: "image/png" }],
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
          url: "/favicon.png",
          width: 512,
          height: 512,
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
  const dict = await getDictionary(typedLocale);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "ATS Studio",
    alternateName: "AT Studio",
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    image: `${siteUrl}/og-image.png`,
    founder: {
      "@type": "Person",
      name: "Alexandre Terras Simões",
      jobTitle: "Founder, Designer and Developer",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Guarda",
        addressCountry: "PT",
      },
    },
    email: "geral@atstudio.pt",
    areaServed: ["Portugal", "Guarda"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guarda",
      addressCountry: "PT",
    },
    sameAs: [
      "https://www.instagram.com/atstudioagency/",
      "https://www.linkedin.com/in/alexandre-sim%C3%B5es-a4aaba407/",
      "https://www.behance.net/atstudioagency",
      "https://www.facebook.com/profile.php?id=61589157155371",
    ],
    description: dict.meta.description,
    serviceType: [
      "Web design",
      "Web development",
      "Branding",
      "UI/UX design",
      "Digital strategy",
    ],
  };

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-paper grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />
        {props.children}
      </body>
    </html>
  );
}
