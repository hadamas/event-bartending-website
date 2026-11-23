"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { easeOutExpo } from "@/lib/motion";

/** Seções onde o atalho some (já existem botões de WhatsApp nelas). */
const HIDE_ON = ["quote", "contact", "site-footer"];

/** Atalho fixo para o WhatsApp, exibido depois do topo da página. */
export function FloatingWhatsApp() {
  const { t } = useI18n();
  const { scrollY } = useScroll();
  const [pastHero, setPastHero] = useState(false);
  const [covered, setCovered] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setPastHero(y > window.innerHeight * 0.9));

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
      setCovered(visible.size > 0);
    });
    HIDE_ON.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !covered;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.floating.whatsapp}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-champagne pl-[17px] pr-[17px] text-ink shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)] transition-[gap,padding] duration-500 ease-pour hover:gap-3 hover:pr-6 sm:bottom-7 sm:right-7"
        >
          <WhatsAppIcon size={22} />
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-[max-width] duration-500 ease-pour group-hover:max-w-[12rem]">
            {t.floating.whatsapp}
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
