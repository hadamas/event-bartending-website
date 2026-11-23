import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Botão com efeito "servir": ao passar o mouse, um líquido sobe e preenche o botão.
 * Renderiza <a> quando recebe `href`, senão <button>.
 */
type Variant = "solid" | "outline" | "solid-dark" | "outline-dark";

const variants: Record<Variant, { base: string; liquid: string }> = {
  solid: {
    base: "bg-champagne text-ink",
    liquid: "bg-brass",
  },
  outline: {
    base: "border border-foam/35 text-foam hover:text-ink focus-visible:text-ink",
    liquid: "bg-foam",
  },
  "solid-dark": {
    base: "bg-ink text-champagne",
    liquid: "bg-brass-deep",
  },
  "outline-dark": {
    base: "border border-ink/40 text-ink hover:text-champagne focus-visible:text-champagne",
    liquid: "bg-ink",
  },
};

type Common = {
  variant?: Variant;
  size?: "md" | "lg";
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & Omit<ComponentProps<"a">, keyof Common> & { href: string };
type AsButton = Common & Omit<ComponentProps<"button">, keyof Common> & { href?: undefined };

export function PourButton(props: AsLink | AsButton) {
  const { variant = "solid", size = "md", icon, className, children, ...rest } = props;
  const v = variants[variant];
  const classes = cn(
    "group relative isolate inline-flex select-none items-center justify-center overflow-hidden rounded-full font-medium tracking-[0.01em] transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-60",
    size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-[0.95rem]",
    v.base,
    className,
  );
  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-[-15%] top-0 -z-10 h-[190%] translate-y-[105%] rounded-[46%] transition-transform duration-700 ease-pour group-hover:-translate-y-[22%] group-focus-visible:-translate-y-[22%] motion-reduce:transition-none",
          v.liquid,
        )}
      />
      <span className="relative flex items-center gap-2.5">
        {children}
        {icon}
      </span>
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as ComponentProps<"a">)}>
        {inner}
      </a>
    );
  }
  return (
    <button className={classes} {...(rest as ComponentProps<"button">)}>
      {inner}
    </button>
  );
}
