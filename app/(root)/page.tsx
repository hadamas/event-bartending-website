import { LOCALE_STORAGE_KEY, defaultLocale, locales } from "@/lib/i18n/config";

/**
 * "/" → /pt-BR ou /en.
 * Usa o idioma escolhido antes (localStorage) ou o idioma do navegador.
 * Funciona tanto em servidor (Vercel/Node) quanto em hospedagem estática.
 */
const script = `(function(){var l=${JSON.stringify(defaultLocale)},all=${JSON.stringify(locales)};try{var s=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)});if(s&&all.indexOf(s)>-1){l=s}else{var n=(navigator.language||'').toLowerCase();if(n&&n.indexOf('pt')!==0){l='en'}}}catch(e){}location.replace('/'+l+location.hash)})();`;

export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}`} />
      </noscript>
      <p style={{ padding: 24 }}>
        <a href={`/${defaultLocale}`} style={{ color: "#c2a063" }}>
          Mário Barman
        </a>
      </p>
    </>
  );
}
