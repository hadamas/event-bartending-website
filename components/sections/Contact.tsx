"use client";

import { Mail, Phone } from "lucide-react";
import { contacts } from "@/data/contacts";
import { site } from "@/data/site";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { scrollToSection } from "@/lib/hooks";
import { whatsappLink } from "@/lib/whatsapp";
import { RevealText } from "@/components/ui/RevealText";
import { PourButton } from "@/components/ui/PourButton";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";

export function Contact() {
  const { t } = useI18n();

  const channels = [
    {
      key: "whatsapp",
      label: t.contact.whatsapp,
      value: contacts.whatsapp.display,
      href: whatsappLink(),
      icon: <WhatsAppIcon size={22} />,
      external: true,
    },
    {
      key: "instagram",
      label: t.contact.instagram,
      value: contacts.instagram.handle,
      href: contacts.instagram.url,
      icon: <InstagramIcon size={22} />,
      external: true,
    },
    contacts.email && {
      key: "email",
      label: t.contact.email,
      value: contacts.email,
      href: `mailto:${contacts.email}`,
      icon: <Mail size={22} strokeWidth={1.5} aria-hidden />,
      external: false,
    },
    contacts.phone.display && {
      key: "phone",
      label: t.contact.phone,
      value: contacts.phone.display,
      href: contacts.phone.href,
      icon: <Phone size={22} strokeWidth={1.5} aria-hidden />,
      external: false,
    },
  ].filter(Boolean) as Array<{
    key: string;
    label: string;
    value: string;
    href: string;
    icon: React.ReactNode;
    external: boolean;
  }>;

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-champagne pb-16 pt-28 text-ink lg:pt-36">
      <div className="container-x flex flex-col items-center text-center">
        <RevealText
          id="contact-title"
          lines={t.contact.heading}
          stagger={0.05}
          className="max-w-[18ch] text-balance font-display text-[clamp(2.3rem,5.6vw,5.2rem)] leading-[1.06]"
        />
        <p className="mt-7 max-w-[46ch] text-lg text-ink/70">{t.contact.intro}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3.5">
          <PourButton
            href="#quote"
            variant="solid-dark"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("quote");
            }}
          >
            {t.contact.quoteCta}
          </PourButton>
          <PourButton
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-dark"
            size="lg"
            icon={<WhatsAppIcon size={18} />}
          >
            {t.contact.whatsappCta}
          </PourButton>
        </div>
      </div>

      <div className="container-x mt-20">
        <ul className="grid border-t border-ink/15 sm:grid-cols-2">
          {channels.map((c, i) => (
            <li key={c.key} className={i % 2 === 1 ? "sm:border-l sm:border-ink/15" : undefined}>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-5 border-b border-ink/15 py-7 sm:px-8"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-ink/20 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-champagne">
                  {c.icon}
                </span>
                <span className="flex min-w-0 flex-col text-left">
                  <span className="text-sm text-ink/60">{c.label}</span>
                  <span className="truncate text-[clamp(1.2rem,2.2vw,1.65rem)] font-light">{c.value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-ink/65">
          <span className="text-ink">{t.contact.regionsTitle}:</span> {site.regions.join(" · ")}{" "}
          {t.common.andRegions}
        </p>
      </div>
    </section>
  );
}
