/**
 * Informações gerais da empresa.
 * Textos institucionais (por idioma) ficam em /locales.
 */
export const site = {
  name: "Mário Barman",
  /** Defina NEXT_PUBLIC_SITE_URL no deploy (ex.: https://www.mariobarman.com.br). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mariobarman.com.br",
  foundedYear: 2022,
  /** Regiões atendidas (nomes próprios, iguais em todos os idiomas). */
  regions: ["Angra dos Reis", "Rio de Janeiro", "São Paulo", "Paraty"],
  /**
   * Logo oficial: quando o arquivo chegar, salve em /public/logos e preencha `src`.
   * Enquanto `src` for null, o site usa o logotipo tipográfico provisório.
   */
  logo: {
    src: null as string | null, // ex.: "/logos/mario-barman.svg"
    width: 168,
    height: 56,
  },
} as const;
