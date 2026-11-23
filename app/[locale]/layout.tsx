import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, localeMeta, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { site } from "@/data/site";
import "../globals.css";

/* Tipografia: Cinzel (capitulares inscritas, ecoando o logotipo) + Jost (sans de linhagem art déco). */
const cinzel = localFont({
  src: "../fonts/cinzel-latin-wght.woff2",
  variable: "--font-cinzel",
  weight: "400 900",
  display: "swap",
});

const jost = localFont({
  src: [
    { path: "../fonts/jost-latin-wght.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/jost-latin-wght-italic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-jost",
  display: "swap",
});

/**
 * Executa antes da primeira pintura: pula a introdução se o visitante já
 * a viu nesta sessão ou se prefere menos movimento.
 */
const introScript = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem('mb-intro')||window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-seen')}}catch(e){document.documentElement.classList.add('intro-seen')}})();`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0b0907",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = await getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    keywords: t.meta.keywords,
    applicationName: site.name,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "pt-BR": "/pt-BR",
        en: "/en",
        "x-default": "/pt-BR",
      },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: site.name,
      title: t.meta.title,
      description: t.meta.description,
      locale: localeMeta[locale].openGraph,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].openGraph),
      images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: ["/images/og.jpg"],
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} className={`${cinzel.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{".preloader{display:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <I18nProvider locale={locale} dictionary={dictionary}>
          <MotionProvider>{children}</MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
