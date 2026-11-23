"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { navItems } from "@/lib/navigation";
import { contacts } from "@/data/contacts";
import { site } from "@/data/site";
import { getDrink } from "@/data/drinks";
import { whatsappLink } from "@/lib/whatsapp";
import { easeInOut, easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { GlassIllustration } from "@/components/ui/GlassIllustration";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/BrandIcons";
import { PourButton } from "@/components/ui/PourButton";
import { LanguageSwitcher } from "./LanguageSwitcher";

const origin = "at 92% 2.25rem";

export function MenuOverlay({
  open,
  onClose,
  onNavigate,
  active,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  active: string;
}) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeFromKeyboard = useEffectEvent(() => onClose());
  const signature = getDrink("old-fashioned");

  // Trava a rolagem, foco inicial, Esc para fechar e foco preso no menu.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      );
    const timer = window.setTimeout(
      () => panel?.querySelector<HTMLElement>("[data-autofocus]")?.focus(),
      80,
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeFromKeyboard();
      }
      if (e.key === "Tab") {
        const list = focusables();
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
          initial={{ clipPath: `circle(0% ${origin})` }}
          animate={{ clipPath: `circle(150% ${origin})` }}
          exit={{ clipPath: `circle(0% ${origin})` }}
          transition={{ duration: 0.85, ease: easeInOut }}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-smoke text-foam"
        >
          <div className="container-x flex h-[4.5rem] shrink-0 items-center justify-between">
            <span className="text-foam">
              <Logo size="sm" />
            </span>
            <div className="flex items-center gap-5 sm:gap-7">
              <LanguageSwitcher onSwitch={onClose} />
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                aria-label={t.nav.closeMenu}
                className="flex items-center gap-2.5 rounded-full border border-foam/25 py-2 pl-4 pr-3 text-sm transition-colors hover:border-brass/70"
              >
                <span>{t.common.close}</span>
                <X size={18} strokeWidth={1.5} aria-hidden />
              </button>
            </div>
          </div>

          <div className="container-x grid flex-1 gap-12 py-10 lg:grid-cols-12 lg:items-center lg:py-0">
            <nav aria-label={t.nav.main} className="lg:col-span-7">
              <ul className="flex flex-col gap-1 sm:gap-2">
                {navItems.map((item, i) => (
                  <li key={item.id} className="overflow-hidden">
                    <motion.a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(item.id);
                      }}
                      aria-current={active === item.id ? "location" : undefined}
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%", transition: { duration: 0.3 } }}
                      transition={{ duration: 0.9, delay: 0.25 + i * 0.06, ease: easeOutExpo }}
                      className={cn(
                        "group inline-flex items-baseline gap-4 py-1 font-display text-[clamp(2.4rem,7vw,5.2rem)] leading-[1.05] transition-colors",
                        active === item.id ? "text-champagne" : "text-foam/55 hover:text-champagne",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "h-px w-0 self-center bg-brass transition-[width] duration-500 ease-pour group-hover:w-10",
                          active === item.id && "w-10",
                        )}
                      />
                      {t.nav[item.key]}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: easeOutExpo }}
              className="relative flex flex-col gap-9 border-t border-foam/10 pt-9 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0"
            >
              <div>
                <h2 className="mb-3 text-sm text-brass">{t.menu.contactTitle}</h2>
                <ul className="space-y-2.5">
                  <li>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-lg text-foam/85 transition-colors hover:text-foam"
                    >
                      <WhatsAppIcon size={20} />
                      {contacts.whatsapp.display}
                    </a>
                  </li>
                  <li>
                    <a
                      href={contacts.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-lg text-foam/85 transition-colors hover:text-foam"
                    >
                      <InstagramIcon size={20} />
                      {contacts.instagram.handle}
                    </a>
                  </li>
                  {contacts.email && (
                    <li>
                      <a href={`mailto:${contacts.email}`} className="text-lg text-foam/85 hover:text-foam">
                        {contacts.email}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h2 className="mb-3 text-sm text-brass">{t.menu.regionsTitle}</h2>
                <p className="max-w-[28ch] text-foam/75">
                  {site.regions.join(", ")} {t.common.andRegions}.
                </p>
              </div>
              <PourButton
                href="#quote"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("quote");
                }}
                className="self-start"
              >
                {t.menu.cta}
              </PourButton>
            </motion.div>
          </div>

          {signature && (
            <GlassIllustration
              visual={signature.visual}
              fill={0}
              details={false}
              strokeWidth={1.2}
              className="pointer-events-none absolute -bottom-6 right-[3%] hidden h-[34vh] text-champagne/10 xl:block"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
