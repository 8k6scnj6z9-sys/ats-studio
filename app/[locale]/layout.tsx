import type { Metadata } from "next";
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

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]">
): Promise<Metadata> {
  const { locale } = await props.params;
  if (!hasLocale(locale)) return {};
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon", sizes: "32x32" },
        { url: "/favicon.png", type: "image/png" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [{ url: "/favicon.png", type: "image/png" }],
    },
  };
}

export default async function LocaleLayout(props: LayoutProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${fraunces.variable} ${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-paper grain">
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />
        {props.children}
      </body>
    </html>
  );
}
