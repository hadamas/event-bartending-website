/**
 * Gera public/robots.txt e public/sitemap.xml antes de cada build.
 * Usa NEXT_PUBLIC_SITE_URL (de .env.local ou do ambiente de deploy).
 * Arquivos estáticos funcionam tanto no build padrão quanto no build:static.
 */
import { writeFileSync } from "node:fs";

const url = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.mariobarman.com.br").replace(/\/$/, "");
const locales = ["pt-BR", "en"];
const today = new Date().toISOString().slice(0, 10);

const alternates = locales
  .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url}/${l}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${url}/pt-BR"/>`)
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${locales
  .map(
    (l) => `  <url>
    <loc>${url}/${l}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${l === "pt-BR" ? "1.0" : "0.8"}</priority>
${alternates}
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${url}/sitemap.xml
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), sitemap);
writeFileSync(new URL("../public/robots.txt", import.meta.url), robots);
console.log(`SEO: robots.txt e sitemap.xml gerados para ${url}`);
