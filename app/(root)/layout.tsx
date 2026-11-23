import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Mário Barman",
  robots: { index: false, follow: true },
};

/** Layout mínimo da raiz "/", que apenas encaminha para o idioma certo. */
export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: "#0b0907", color: "#f5eee1", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
