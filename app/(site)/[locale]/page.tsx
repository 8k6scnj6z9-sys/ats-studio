import { notFound } from "next/navigation";
import { hasLocale, getDictionary, type Locale } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";
import { getProcessSteps } from "@/lib/process";
import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/sections/Hero";
import DiagnosticInvite from "@/components/sections/DiagnosticInvite";
import Work from "@/components/sections/Work";
import Services from "@/components/sections/Services";
import Audience from "@/components/sections/Audience";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import TrustSignals from "@/components/sections/TrustSignals";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { getSiteSettings } from "@/lib/site-settings";
import { getServicePages } from "@/lib/service-pages";

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const [dict, projects, processSteps, siteSettings, servicePages] = await Promise.all([
    getDictionary(locale as Locale),
    getProjects(),
    getProcessSteps(),
    getSiteSettings(),
    getServicePages(),
  ]);
  const serviceLinks = servicePages.map((page) => ({
    href: `/${locale}/servicos/${page.slug}`,
    label: page.content[locale as Locale].eyebrow,
  }));

  return (
    <>
      <Navbar locale={locale as Locale} dict={dict} />
      <main className="relative z-10">
        <Hero locale={locale as Locale} dict={dict} />
        <DiagnosticInvite locale={locale as Locale} dict={dict} />
        <Work locale={locale as Locale} dict={dict} projects={projects} />
        <Services dict={dict} serviceLinks={serviceLinks} />
        <Audience dict={dict} />
        <About dict={dict} />
        <Process locale={locale as Locale} dict={dict} steps={processSteps} />
        <TrustSignals locale={locale as Locale} />
        <Contact dict={dict} socialLinks={siteSettings.socialLinks} />
      </main>
      <Footer locale={locale as Locale} dict={dict} />
    </>
  );
}
