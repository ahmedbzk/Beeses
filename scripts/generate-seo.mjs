// Build öncesi çalışır:
//  - prerender-routes.txt : EN sayfalar + ürün/haber detay sayfaları (TR statik sayfalar Angular tarafından otomatik bulunur)
//  - src/sitemap.xml      : TR/EN tüm sayfalar, hreflang alternatifleriyle
// Ürün ve haber listesi canlı API'den sadece okunur (GET). API'ye ulaşılamazsa detay sayfaları atlanır, build durmaz.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SITE_URL = 'https://beesesaudio.com';
const API_URL = 'https://beesesaudio.com/backend/api';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const staticRoutes = [
  '/',
  '/corporate',
  '/corporate/components/about',
  '/corporate/components/certificates',
  '/corporate/components/news',
  '/corporate/components/sss',
  '/products',
  '/products/innovation',
  '/products/manuals',
  '/distributors',
  '/contact',
  '/contact/warranty',
  '/contact/warranty-query',
  '/privacy-policy',
  '/cookie-policy',
];

async function fetchList(path) {
  try {
    const res = await fetch(`${API_URL}/${path}`, { signal: AbortSignal.timeout(15000) });
    const json = await res.json();
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.warn(`⚠️  ${path} okunamadı (${err.message}); bu sayfalar sitemap/prerender dışında kalacak.`);
    return [];
  }
}

const toDate = (value) => {
  const d = value ? new Date(String(value).replace(' ', 'T')) : null;
  return d && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : undefined;
};

const products = await fetchList('products/get-products.php');
const news = await fetchList('news/get-news.php');

const pages = [
  ...staticRoutes.map(path => ({ path })),
  ...products.filter(p => p.slug).map(p => ({ path: `/products/${encodeURIComponent(p.slug)}`, lastmod: toDate(p.updated_at || p.created_at) })),
  ...news.filter(n => n.id).map(n => ({ path: `/corporate/components/news/${n.id}`, lastmod: toDate(n.news_date || n.created_at) })),
];

// Prerender listesi
const prerender = [
  ...pages.filter(p => p.path !== '/' && !staticRoutes.includes(p.path)).map(p => p.path),
  ...pages.map(p => (p.path === '/' ? '/en' : '/en' + p.path)),
];
writeFileSync(join(root, 'prerender-routes.txt'), prerender.join('\n') + '\n');

// Sitemap (URL'ler canlıdaki gibi sonda / ile)
const loc = (lang, path) => SITE_URL + (lang === 'en' ? '/en' : '') + (path === '/' ? '/' : path + '/');
const entry = (lang, page) => [
  '  <url>',
  `    <loc>${loc(lang, page.path)}</loc>`,
  page.lastmod ? `    <lastmod>${page.lastmod}</lastmod>` : null,
  `    <xhtml:link rel="alternate" hreflang="tr" href="${loc('tr', page.path)}"/>`,
  `    <xhtml:link rel="alternate" hreflang="en" href="${loc('en', page.path)}"/>`,
  `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc('tr', page.path)}"/>`,
  '  </url>',
].filter(Boolean).join('\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...pages.flatMap(page => [entry('tr', page), entry('en', page)]),
  '</urlset>',
  '',
].join('\n');
writeFileSync(join(root, 'src/sitemap.xml'), sitemap);

console.log(`✅ SEO: ${products.length} ürün, ${news.length} haber -> ${pages.length * 2} sitemap URL, ${prerender.length} ek prerender rotası`);
