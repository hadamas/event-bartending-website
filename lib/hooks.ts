"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** true quando a media query corresponde (sempre false no servidor). */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Seção visível no centro da tela (para destacar o link ativo do menu). */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export const INTRO_DONE_EVENT = "mb:intro-done";

const noopSubscribe = () => () => {};

/** Valor que só existe no navegador (no servidor e na hidratação usa `serverValue`). */
export function useClientValue<T>(getter: () => T, serverValue: T) {
  return useSyncExternalStore(noopSubscribe, getter, () => serverValue);
}

let introFinished = false;

function subscribeIntro(onChange: () => void) {
  const handler = () => {
    introFinished = true;
    onChange();
  };
  window.addEventListener(INTRO_DONE_EVENT, handler);
  return () => window.removeEventListener(INTRO_DONE_EVENT, handler);
}

/** Fica true quando a introdução (preloader) termina ou já foi vista. */
export function useIntroDone() {
  return useSyncExternalStore(
    subscribeIntro,
    () => introFinished || document.documentElement.classList.contains("intro-seen"),
    () => false,
  );
}

/** Rola suavemente até uma seção (respeitando reduced motion). */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

/**
 * Preferência por menos movimento — segura para hidratação
 * (false no servidor e na primeira renderização, valor real logo em seguida).
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
