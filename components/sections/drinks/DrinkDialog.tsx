"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { drinks, type Drink } from "@/data/drinks";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fill, pick } from "@/lib/i18n/localize";
import { scrollToSection } from "@/lib/hooks";
import { DrinkVisual } from "@/components/ui/DrinkVisual";
import { PourButton } from "@/components/ui/PourButton";

/** Evento usado para levar um drink escolhido até o formulário de orçamento. */
export const QUOTE_ADD_DRINK_EVENT = "mb:quote-add-drink";

type Ctx = { openDrink: (id: string) => void };
const DrinkDialogContext = createContext<Ctx>({ openDrink: () => {} });

export function useDrinkDialog() {
  return useContext(DrinkDialogContext);
}

export function DrinkDialogProvider({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [drink, setDrink] = useState<Drink | null>(null);
  const [openCount, setOpenCount] = useState(0);

  const openDrink = useCallback((id: string) => {
    const found = drinks.find((d) => d.id === id);
    if (!found) return;
    setDrink(found);
    setOpenCount((c) => c + 1);
    requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) dialog.showModal();
    });
  }, []);

  const close = () => dialogRef.current?.close();

  const name = drink ? pick(drink.name, locale) : "";

  return (
    <DrinkDialogContext.Provider value={{ openDrink }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="drink-dialog-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="drink-dialog m-auto w-[min(60rem,calc(100vw-1.5rem))] max-h-[calc(100svh-1.5rem)] overflow-hidden rounded-[10px] bg-smoke p-0 text-foam shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)]"
      >
        {drink && (
          <div className="grid max-h-[calc(100svh-1.5rem)] overflow-y-auto md:grid-cols-[1fr_1.1fr]">
            <div
              className="relative flex min-h-[40svh] items-end justify-center overflow-hidden pt-12 md:min-h-[34rem]"
              style={{
                background: `radial-gradient(70% 60% at 50% 55%, ${drink.accent}33 0%, transparent 70%), var(--color-smoke-2)`,
              }}
            >
              <DrinkVisual
                drink={drink}
                pour
                pourKey={`${drink.id}-${openCount}`}
                pourDelay={0.2}
                className="h-[34svh] w-auto text-champagne/85 md:h-[28rem]"
              />
            </div>

            <div className="flex flex-col gap-6 p-7 sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm text-brass">
                    {t.drinks.categories[drink.category]}
                    {drink.placeholder && (
                      <span className="ml-3 rounded-full border border-foam/20 px-2 py-0.5 text-xs text-foam/60">
                        {t.common.placeholderBadge}
                      </span>
                    )}
                  </p>
                  <h2 id="drink-dialog-title" className="mt-2 font-display text-[clamp(2rem,4vw,2.8rem)] leading-[1.1]">
                    {name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.common.close}
                  className="grid size-11 shrink-0 place-items-center rounded-full border border-foam/20 transition-colors hover:border-brass"
                >
                  <X size={18} strokeWidth={1.5} aria-hidden />
                </button>
              </div>

              <p className="max-w-[46ch] text-foam/75">{pick(drink.description, locale)}</p>

              {drink.ingredients && (
                <div>
                  <h3 className="mb-3 text-sm text-brass">{t.drinks.ingredients}</h3>
                  <ul className="divide-y divide-foam/10 border-y border-foam/10">
                    {pick(drink.ingredients, locale).map((item) => (
                      <li key={item} className="py-2.5 text-foam/85">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {drink.notes && (
                <div>
                  <h3 className="mb-1.5 text-sm text-brass">{t.drinks.notes}</h3>
                  <p className="text-foam/70">{pick(drink.notes, locale)}</p>
                </div>
              )}

              <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
                <PourButton
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent(QUOTE_ADD_DRINK_EVENT, {
                        detail: fill(t.drinks.interestedIn, { name }),
                      }),
                    );
                    close();
                    scrollToSection("quote");
                  }}
                >
                  {t.drinks.addToQuote}
                </PourButton>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </DrinkDialogContext.Provider>
  );
}
