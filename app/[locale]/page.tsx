import { notFound } from "next/navigation";
import { hasLocale, getDictionary, type Locale } from "@/lib/i18n";
import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Services from "@/components/sections/Services";
import Audience from "@/components/sections/Audience";
import About from "@/components/sections/About";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Navbar locale={locale as Locale} dict={dict} />
      <main className="relative z-10">
        <Hero locale={locale as Locale} dict={dict} />
        <Work locale={locale as Locale} dict={dict} />
        <Services dict={dict} />
        <Audience dict={dict} />
        <About dict={dict} />
        <Process dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer locale={locale as Locale} dict={dict} />
    </>
  );
}
