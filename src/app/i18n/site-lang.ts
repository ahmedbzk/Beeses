import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { inject } from '@angular/core';

// Canlı alan adı (canonical, hreflang, og:url ve sitemap bu adrese göre üretilir)
export const SITE_URL = 'https://beesesaudio.com';

export type SiteLang = 'tr' | 'en';

// TR sayfalar kökte (/products), EN sayfalar /en altında (/en/products) yayınlanır.
export function langFromPath(pathname: string): SiteLang {
  return /^\/en(\/|$)/.test(pathname) ? 'en' : 'tr';
}

// Router'ın /en önekini base href olarak görmesini sağlar; böylece tüm routerLink'ler
// EN sayfalarda otomatik olarak /en/... üretir.
export function baseHrefFactory(): string {
  return langFromPath(inject(PlatformLocation).pathname) === 'en' ? '/en/' : '/';
}

export function currentSiteLang(): SiteLang {
  return inject(APP_BASE_HREF, { optional: true }) === '/en/' ? 'en' : 'tr';
}

// Router yolunu (ör. "/products?x=1") dile göre tam URL yoluna çevirir: "/en/products/"
export function localizedPath(lang: SiteLang, routerPath: string): string {
  let p = (routerPath || '/').split(/[?#]/)[0] || '/';
  if (!p.startsWith('/')) p = '/' + p;
  if (p !== '/' && !p.endsWith('/')) p += '/';
  return lang === 'en' ? '/en' + p : p;
}
