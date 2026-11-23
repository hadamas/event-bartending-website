/**
 * Contatos e redes sociais.
 * Campos vazios ("") não aparecem no site — basta preencher para ativar.
 */
export type SocialNetwork = "instagram" | "facebook" | "tiktok" | "youtube";

export const contacts = {
  whatsapp: {
    display: "+55 24 99903-9157",
    /** Somente dígitos, com DDI e DDD. */
    number: "5524999039157",
  },
  instagram: {
    handle: "@mario.barman",
    url: "https://www.instagram.com/mario.barman/",
  },
  /** Opcional: telefone fixo/comercial. */
  phone: { display: "", href: "" }, // ex.: { display: "+55 24 3333-0000", href: "tel:+552433330000" }
  /** Opcional: e-mail comercial. */
  email: "", // ex.: "contato@mariobarman.com.br"
  /** Outras redes (aparecem no rodapé e no menu quando preenchidas). */
  socials: [] as Array<{ network: SocialNetwork; url: string; label: string }>,
};
