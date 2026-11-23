import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 gera um site 100% estático em /out (npm run build:static),
 * útil para hospedagens simples (Hostinger, Netlify, GitHub Pages...).
 * Sem a variável, o build é o padrão do Next.js (Vercel/Node).
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Cache Components não se aplica à exportação estática.
  cacheComponents: !isStaticExport,
  partialPrefetching: !isStaticExport,
  images: {
    formats: ["image/avif", "image/webp"],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
  ...(isStaticExport ? { output: "export" as const, trailingSlash: true } : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
