"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { contacts } from "@/data/contacts";
import { whatsappLink } from "@/lib/whatsapp";
import { RevealText } from "@/components/ui/RevealText";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { QuoteForm } from "./QuoteForm";

export function Quote() {
  const { t } = useI18n();

  return (
    <section id="quote" aria-labelledby="quote-title" className="relative bg-ink py-28 text-foam lg:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-10 lg:col-span-4">
          <div>
            <RevealText
              id="quote-title"
              lines={t.quote.heading}
              className="text-balance font-display text-[clamp(2.1rem,3.8vw,3.4rem)] leading-[1.1]"
            />
            <p className="mt-6 max-w-[40ch] text-foam/70">{t.quote.intro}</p>
          </div>

          <ol className="flex flex-col">
            {t.quote.steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-t border-foam/10 py-5">
                <span aria-hidden className="font-display text-xl text-brass">
                  {i + 1}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-foam">{step.title}</span>
                  <span className="text-[0.95rem] text-foam/60">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="border-t border-foam/10 pt-6">
            <p className="text-sm text-foam/55">{t.quote.directTitle}</p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex items-center gap-3 text-lg text-foam"
            >
              <WhatsAppIcon size={20} className="text-brass" />
              <span className="border-b border-foam/25 pb-0.5 transition-colors group-hover:border-brass">
                {contacts.whatsapp.display}
              </span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
