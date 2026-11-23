/** Junta classes condicionalmente (sem dependências extras). */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
