"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, CircleAlert, LoaderCircle, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { fill, pick } from "@/lib/i18n/localize";
import { services } from "@/data/services";
import { contacts } from "@/data/contacts";
import { whatsappLink } from "@/lib/whatsapp";
import { emptyQuote, eventTypes, quoteConfig, type QuoteData } from "@/lib/quote/config";
import {
  buildWhatsAppMessage,
  sendQuoteToApi,
  todayISO,
  validateQuote,
  type QuoteErrors,
} from "@/lib/quote/quote";
import { easeOutExpo } from "@/lib/motion";
import { useClientValue } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { PourButton } from "@/components/ui/PourButton";
import { WhatsAppIcon } from "@/components/ui/BrandIcons";
import { QUOTE_ADD_DRINK_EVENT } from "../drinks/DrinkDialog";

type Status = "idle" | "submitting" | "success" | "error";
type FieldName = keyof QuoteData;

const ERROR_COLOR = "text-[#ee9a84]";

export function QuoteForm() {
  const { t, locale } = useI18n();
  const f = t.quote.form;
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<QuoteData>(emptyQuote);
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [waUrl, setWaUrl] = useState("");
  const minDate = useClientValue<string | undefined>(todayISO, undefined);
  const isWhatsApp = quoteConfig.provider === "whatsapp";

  // Recebe drinks escolhidos no diálogo "Incluir no orçamento".
  useEffect(() => {
    const onAdd = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      setStatus((s) => (s === "success" || s === "error" ? "idle" : s));
      setData((d) =>
        d.message.includes(text) ? d : { ...d, message: d.message ? `${d.message}\n${text}` : text },
      );
    };
    window.addEventListener(QUOTE_ADD_DRINK_EVENT, onAdd);
    return () => window.removeEventListener(QUOTE_ADD_DRINK_EVENT, onAdd);
  }, []);

  useEffect(() => {
    if (status === "success" || status === "error") panelRef.current?.focus();
  }, [status]);

  const set = <K extends FieldName>(name: K, value: QuoteData[K]) => {
    const next = { ...data, [name]: value };
    setData(next);
    if (submitted || errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateQuote(next, t)[name] }));
    }
  };

  const blur = (name: FieldName) => () => {
    if (!data[name] || (Array.isArray(data[name]) && !data[name].length)) return;
    setErrors((prev) => ({ ...prev, [name]: validateQuote(data, t)[name] }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const found = validateQuote(data, t);
    setErrors(found);
    const first = (Object.keys(emptyQuote) as FieldName[]).find((k) => found[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    if (isWhatsApp) {
      const url = whatsappLink(buildWhatsAppMessage(data, t, locale));
      setWaUrl(url);
      // Abre na mesma ação do clique para não ser bloqueado como pop-up.
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => setStatus("success"), 450);
      return;
    }
    try {
      await sendQuoteToApi(data, locale);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setData(emptyQuote);
    setErrors({});
    setSubmitted(false);
    setStatus("idle");
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const describedBy = (name: string, hint = false) =>
    cn(errors[name as FieldName] && `${id(name)}-error`, hint && `${id(name)}-hint`) || undefined;

  const inputClass = (name: FieldName) =>
    cn(
      "w-full rounded-none border-0 border-b bg-transparent px-0 py-2.5 text-[1.02rem] text-foam placeholder:text-foam/30 transition-[border-color,box-shadow] duration-300 focus:outline-none focus-visible:outline-none",
      errors[name]
        ? "border-[#ee9a84] focus:shadow-[0_1.5px_0_0_#ee9a84]"
        : "border-foam/20 hover:border-foam/40 focus:border-brass focus:shadow-[0_1.5px_0_0_var(--color-brass)]",
    );

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-foam/10 bg-smoke-2/70 p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" || status === "error" ? (
          <motion.div
            key={status}
            ref={panelRef}
            tabIndex={-1}
            role="status"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="flex min-h-[26rem] flex-col items-start justify-center gap-6 focus:outline-none"
          >
            <span
              className={cn(
                "grid size-14 place-items-center rounded-full",
                status === "success" ? "bg-brass text-ink" : "bg-[#ee9a84]/15 text-[#ee9a84]",
              )}
            >
              {status === "success" ? <Check size={26} strokeWidth={1.6} /> : <CircleAlert size={26} strokeWidth={1.6} />}
            </span>
            <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-foam">
              {status === "success" ? t.quote.success.title : t.quote.error.title}
            </h3>
            <p className="max-w-[44ch] text-foam/70">
              {status === "success"
                ? isWhatsApp
                  ? t.quote.success.text
                  : t.quote.success.textApi
                : fill(t.quote.error.text, { phone: contacts.whatsapp.display })}
            </p>
            <div className="flex flex-wrap gap-3">
              {status === "success" && isWhatsApp && waUrl && (
                <PourButton href={waUrl} target="_blank" rel="noopener noreferrer" icon={<WhatsAppIcon size={18} />}>
                  {t.quote.success.reopen}
                </PourButton>
              )}
              {status === "error" && (
                <PourButton onClick={() => setStatus("idle")} icon={<RotateCcw size={16} strokeWidth={1.6} aria-hidden />}>
                  {t.quote.error.retry}
                </PourButton>
              )}
              <PourButton variant="outline" onClick={status === "success" ? reset : () => setStatus("idle")}>
                {status === "success" ? t.quote.success.again : t.common.close}
              </PourButton>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            aria-labelledby={id("title")}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: easeOutExpo }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 id={id("title")} className="font-display text-2xl text-foam">
                {f.title}
              </h3>
              <p className="text-sm text-foam/50">{f.requiredNote}</p>
            </div>

            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
              <Field id={id("name")} label={f.name.label} required error={errors.name}>
                <input
                  id={id("name")}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder={f.name.placeholder}
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={blur("name")}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={describedBy("name")}
                  className={inputClass("name")}
                />
              </Field>

              <Field id={id("email")} label={f.email.label} required error={errors.email}>
                <input
                  id={id("email")}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={f.email.placeholder}
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={blur("email")}
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy("email")}
                  className={inputClass("email")}
                />
              </Field>

              <Field id={id("phone")} label={f.phone.label} required error={errors.phone}>
                <input
                  id={id("phone")}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={f.phone.placeholder}
                  value={data.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onBlur={blur("phone")}
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={describedBy("phone")}
                  className={inputClass("phone")}
                />
              </Field>

              <Field id={id("eventType")} label={f.eventType.label} required error={errors.eventType}>
                <div className="relative">
                  <select
                    id={id("eventType")}
                    name="eventType"
                    value={data.eventType}
                    onChange={(e) => set("eventType", e.target.value as QuoteData["eventType"])}
                    aria-required="true"
                    aria-invalid={!!errors.eventType}
                    aria-describedby={describedBy("eventType")}
                    className={cn(inputClass("eventType"), "appearance-none pr-8", !data.eventType && "text-foam/40")}
                  >
                    <option value="" disabled className="bg-smoke text-foam/60">
                      {f.eventType.placeholder}
                    </option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type} className="bg-smoke text-foam">
                        {f.eventType.options[type]}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    strokeWidth={1.5}
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-foam/50"
                  />
                </div>
              </Field>

              <Field id={id("date")} label={f.date.label} required error={errors.date}>
                <input
                  id={id("date")}
                  name="date"
                  type="date"
                  min={minDate}
                  value={data.date}
                  onChange={(e) => set("date", e.target.value)}
                  onBlur={blur("date")}
                  aria-required="true"
                  aria-invalid={!!errors.date}
                  aria-describedby={describedBy("date")}
                  className={cn(inputClass("date"), !data.date && "text-foam/40")}
                />
              </Field>

              <Field id={id("location")} label={f.location.label} required error={errors.location}>
                <input
                  id={id("location")}
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  placeholder={f.location.placeholder}
                  value={data.location}
                  onChange={(e) => set("location", e.target.value)}
                  onBlur={blur("location")}
                  aria-required="true"
                  aria-invalid={!!errors.location}
                  aria-describedby={describedBy("location")}
                  className={inputClass("location")}
                />
              </Field>

              <Field id={id("guests")} label={f.guests.label} required error={errors.guests}>
                <input
                  id={id("guests")}
                  name="guests"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={5000}
                  step={1}
                  placeholder={f.guests.placeholder}
                  value={data.guests}
                  onChange={(e) => set("guests", e.target.value)}
                  onBlur={blur("guests")}
                  aria-required="true"
                  aria-invalid={!!errors.guests}
                  aria-describedby={describedBy("guests")}
                  className={cn(inputClass("guests"), "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none")}
                />
              </Field>
            </div>

            <fieldset aria-describedby={`${id("services")}-hint`}>
              <legend className="text-sm text-foam/70">{f.services.label}</legend>
              <p id={`${id("services")}-hint`} className="mt-1 text-xs text-foam/45">
                {f.services.hint}
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {services.map((service) => {
                  const checked = data.services.includes(service.id);
                  return (
                    <label key={service.id} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="services"
                        value={service.id}
                        checked={checked}
                        onChange={() =>
                          set(
                            "services",
                            checked
                              ? data.services.filter((s) => s !== service.id)
                              : [...data.services, service.id],
                          )
                        }
                        className="peer sr-only"
                      />
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brass",
                          checked
                            ? "border-champagne bg-champagne text-ink"
                            : "border-foam/20 text-foam/80 hover:border-foam/45",
                        )}
                      >
                        {checked && <Check size={14} strokeWidth={2} aria-hidden />}
                        {pick(service.title, locale)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Field
              id={id("message")}
              label={
                <>
                  {f.message.label} <span className="text-foam/40">({f.message.optional})</span>
                </>
              }
            >
              <textarea
                id={id("message")}
                name="message"
                rows={4}
                placeholder={f.message.placeholder}
                value={data.message}
                onChange={(e) => set("message", e.target.value)}
                className={cn(inputClass("message"), "resize-y leading-relaxed")}
              />
            </Field>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p aria-live="polite" className={cn("text-sm", ERROR_COLOR)}>
                {submitted && errorCount > 0 ? t.quote.errors.summary : ""}
              </p>
              <PourButton
                type="submit"
                size="lg"
                disabled={status === "submitting"}
                aria-busy={status === "submitting"}
                icon={
                  status === "submitting" ? (
                    <LoaderCircle size={18} className="animate-spin" aria-hidden />
                  ) : isWhatsApp ? (
                    <WhatsAppIcon size={18} />
                  ) : undefined
                }
                className="sm:ml-auto"
              >
                {status === "submitting" ? f.submitting : isWhatsApp ? f.submit : f.submitApi}
              </PourButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: ReactNode;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-foam/70">
        {label}
        {required && (
          <span aria-hidden className="text-brass">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={cn("flex items-center gap-1.5 text-sm", ERROR_COLOR)}
          >
            <CircleAlert size={14} strokeWidth={1.8} aria-hidden />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
