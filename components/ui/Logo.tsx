import Image from "next/image";
import { site } from "@/data/site";
import { cn } from "@/lib/cn";

/**
 * Logotipo. Enquanto `site.logo.src` estiver vazio, mostra o logotipo
 * tipográfico provisório (baseado na referência enviada). O espaço e as
 * proporções já estão reservados para o arquivo oficial.
 */
const sizes = {
  sm: { box: "h-11", main: "text-[1.3rem]", sub: "text-[0.56rem]", gap: "gap-[0.3rem]" },
  md: { box: "h-14", main: "text-[1.75rem]", sub: "text-[0.72rem]", gap: "gap-[0.35rem]" },
  lg: { box: "h-auto", main: "text-[clamp(3rem,9vw,7rem)]", sub: "text-[clamp(0.95rem,2.6vw,2rem)]", gap: "gap-3" },
};

export function Logo({
  size = "sm",
  className,
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  const s = sizes[size];

  if (site.logo.src) {
    return (
      <span className={cn("relative inline-flex items-center", s.box, className)}>
        <Image
          src={site.logo.src}
          alt={site.name}
          width={site.logo.width}
          height={site.logo.height}
          className="h-full w-auto"
          priority
        />
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex flex-col items-center font-display leading-none", s.gap, className)}
      aria-label={site.name}
      role="img"
    >
      <span aria-hidden className={cn("font-semibold tracking-[0.08em]", s.main)}>
        MÁRIO
      </span>
      <span aria-hidden className="flex w-full items-center gap-[0.5em] text-brass">
        <span className="h-px flex-1 bg-current opacity-70" />
        <span className={cn("font-medium tracking-[0.42em] text-current [margin-right:-0.42em]", s.sub)}>
          BARMAN
        </span>
        <span className="h-px flex-1 bg-current opacity-70" />
      </span>
    </span>
  );
}
