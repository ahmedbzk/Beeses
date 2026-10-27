// Build sonrası çalışır: prerender edilmiş ana sayfadan boş bir "uygulama kabuğu" (index.csr.html) üretir.
// .htaccess bunu henüz prerender edilmemiş sayfalar (yeni ürün/haber) ve 404 için kullanır;
// içinde sunucu çıktısı olmadığından Angular sayfayı tarayıcıda sıfırdan çizer (hydration uyuşmazlığı olmaz).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const browserDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist/beeses-audio/browser');
const source = join(browserDir, 'index.html');

if (!existsSync(source)) {
  console.error(`❌ ${source} bulunamadı. Önce build alın.`);
  process.exit(1);
}

let html = readFileSync(source, 'utf8');
const start = html.indexOf('<app-root');
const end = html.lastIndexOf('</app-root>');
if (start === -1 || end === -1) {
  console.error('❌ index.html içinde <app-root> bulunamadı.');
  process.exit(1);
}

html = html.slice(0, start) + '<app-root></app-root>' + html.slice(end + '</app-root>'.length);
html = html.replace(/<script id="ng-state"[\s\S]*?<\/script>/, '');
html = html.replace(/\s*ng-server-context="[^"]*"/g, '');
// Ana sayfaya ait SEO etiketleri kabukta yanlış olur; uygulama açılınca doğruları eklenir
html = html.replace(/<link rel="(canonical|alternate)"[^>]*>/g, '');
html = html.replace(/<meta property="og:url"[^>]*>/g, '');
html = html.replace(/<script id="jsonld-[^"]*"[\s\S]*?<\/script>/g, '');

writeFileSync(join(browserDir, 'index.csr.html'), html);
console.log('✅ index.csr.html oluşturuldu');
