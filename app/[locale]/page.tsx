import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { contacts } from "@/data/contacts";
import { site } from "@/data/site";
import { Preloader } from "@/components/layout/Preloader";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Manifesto } from "@/components/sections/Manifesto";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { FirstSip } from "@/components/sections/FirstSip";
import { Drinks } from "@/components/sections/drinks/Drinks";
import { DrinkDialogProvider } from "@/components/sections/drinks/DrinkDialog";
import { Signature } from "@/components/sections/Signature";
import { Experience } from "@/components/sections/Experience";
import { Quote } from "@/components/sections/quote/Quote";
import { Contact } from "@/components/sections/Contact";
import { SkipLink } from "@/components/layout/SkipLink";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = await getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: t.meta.description,
    url: `${site.url}/${locale}`,
    image: `${site.url}/images/og.jpg`,
    telephone: `+${contacts.whatsapp.number}`,
    foundingDate: String(site.foundedYear),
    areaServed: site.regions.map((name) => ({ "@type": "Place", name })),
    sameAs: [contacts.instagram.url, ...contacts.socials.map((s) => s.url)],
    ...(contacts.email ? { email: contacts.email } : {}),
  };

  return (
    <DrinkDialogProvider>
      <SkipLink />
      <Preloader />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Manifesto />
        <About />
        <Testimonials />
        <FirstSip />
        <Drinks />
        <Signature />
        <Experience />
        <Quote />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </DrinkDialogProvider>
  );
}
