"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-champagne px-5 py-3 text-sm font-medium text-ink transition-transform focus:translate-y-0"
    >
      {t.common.skipToContent}
    </a>
  );
}
