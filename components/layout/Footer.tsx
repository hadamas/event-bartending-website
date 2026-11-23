"use client";

import { ArrowUp } from "lucide-react";
import { contacts } from "@/data/contacts";
import { site } from "@/data/site";
import { getDrink } from "@/data/drinks";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fill } from "@/lib/i18n/localize";
import { navItems } from "@/lib/navigation";
import { scrollToSection, useClientValue } from "@/lib/hooks";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "@/components/ui/Logo";
import { GlassIllustration } from "@/components/ui/GlassIllustration";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Footer() {
  const { t } = useI18n();
  const year = useClientValue(() => new Date().getFullYear(), site.foundedYear);
  const drink = getDrink("negroni");

  return (
    <div className="bg-champagne p-2.5 sm:p-3">
      <footer id="site-footer" className="grain relative overflow-hidden rounded-[18px] bg-ink text-foam sm:rounded-[26px]">
        {drink && (
          <GlassIllustration
            visual={drink.visual}
            fill={0}
            details={false}
            strokeWidth={1.2}
            className="pointer-events-none absolute right-[7%] top-[24%] hidden h-[42%] text-champagne/15 lg:block"
          />
        )}

        <div className="container-x relative py-16 lg:py-20">
          <div className="flex flex-col items-start gap-10 border-b border-foam/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5">
              <span className="text-foam">
                <Logo size="md" />
              </span>
              <p className="max-w-[30ch] text-foam/60">{t.footer.tagline}</p>
            </div>
            <ul className="flex gap-3" aria-label={t.footer.social}>
              <li>
                <a
                  href={contacts.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Instagram ${contacts.instagram.handle}`}
                  className="grid size-12 place-items-center rounded-full border border-foam/20 transition-colors hover:border-brass hover:text-brass"
                >
                  <InstagramIcon size={20} />
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`WhatsApp ${contacts.whatsapp.display}`}
                  className="grid size-12 place-items-center rounded-full border border-foam/20 transition-colors hover:border-brass hover:text-brass"
                >
                  <WhatsAppIcon size={20} />
                </a>
              </li>
              {contacts.socials.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-12 place-items-center rounded-full border border-foam/20 px-4 text-sm transition-colors hover:border-brass hover:text-brass"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-10 py-12 sm:grid-cols-3 lg:max-w-4xl">
            <nav aria-label={t.footer.navigation}>
              <h2 className="mb-4 text-sm text-brass">{t.footer.navigation}</h2>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className="text-foam/75 transition-colors hover:text-foam"
                    >
                      {t.nav[item.key]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h2 className="mb-4 text-sm text-brass">{t.footer.contact}</h2>
              <ul className="space-y-2 text-foam/75">
                <li>
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-foam">
                    {contacts.whatsapp.display}
                  </a>
                </li>
                <li>
                  <a href={contacts.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-foam">
                    {contacts.instagram.handle}
                  </a>
                </li>
                {contacts.email && (
                  <li>
                    <a href={`mailto:${contacts.email}`} className="hover:text-foam">
                      {contacts.email}
                    </a>
                  </li>
                )}
                {contacts.phone.display && (
                  <li>
                    <a href={contacts.phone.href} className="hover:text-foam">
                      {contacts.phone.display}
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm text-brass">{t.footer.language}</h2>
              <LanguageSwitcher className="text-base" />
            </div>
          </div>

          <div className="flex flex-col gap-6 border-t border-foam/10 pt-8 text-sm text-foam/50 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-1.5">
              <p>{fill(t.footer.rights, { year })}</p>
              <p>{t.footer.responsibility}</p>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="group inline-flex items-center gap-3 self-start text-foam/75 transition-colors hover:text-foam lg:self-auto"
            >
              {t.footer.backToTop}
              <span className="grid size-10 place-items-center rounded-full border border-foam/20 transition-colors group-hover:border-brass">
                <ArrowUp size={16} strokeWidth={1.5} aria-hidden />
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
