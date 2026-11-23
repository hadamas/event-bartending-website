"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { navItems, sectionIds } from "@/lib/navigation";
import { scrollToSection, useActiveSection } from "@/lib/hooks";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MenuOverlay } from "./MenuOverlay";

export function Header() {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(sectionIds);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 480);
  });

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? "-110%" : "0%" }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-brass/15 bg-ink/80 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <a
            href="#home"
            onClick={go("home")}
            aria-label={t.nav.homeLink}
            className="justify-self-start text-foam"
          >
            <Logo size="sm" />
          </a>

          <nav aria-label={t.nav.main} className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={go(item.id)}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "group relative py-2 text-[0.95rem] tracking-[0.02em] transition-colors duration-300",
                        isActive ? "text-foam" : "text-foam/65 hover:text-foam",
                      )}
                    >
                      {t.nav[item.key]}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-brass transition-transform duration-500 ease-pour",
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-5 justify-self-end sm:gap-7">
            <LanguageSwitcher />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={t.nav.openMenu}
              className="group flex items-center gap-3 rounded-full border border-foam/25 py-2 pl-4 pr-3.5 text-sm text-foam transition-colors hover:border-brass/70"
            >
              <span>{t.nav.menu}</span>
              <span aria-hidden className="flex w-5 flex-col items-end gap-[5px]">
                <span className="h-px w-5 bg-current" />
                <span className="h-px w-3.5 bg-current transition-[width] duration-300 group-hover:w-5" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MenuOverlay
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }}
        onNavigate={(id) => {
          setMenuOpen(false);
          requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)));
        }}
        active={active}
      />
    </>
  );
}
