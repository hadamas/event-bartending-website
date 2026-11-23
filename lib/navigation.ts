/** Itens do menu: `id` é a âncora da seção, `key` aponta para o texto em locales → nav. */
export const navItems = [
  { id: "home", key: "home" },
  { id: "about", key: "about" },
  { id: "drinks", key: "drinks" },
  { id: "quote", key: "quote" },
  { id: "contact", key: "contact" },
] as const;

export const sectionIds = navItems.map((item) => item.id);
