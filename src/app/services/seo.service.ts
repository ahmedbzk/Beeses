import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_URL, SiteLang, currentSiteLang, localizedPath } from '../i18n/site-lang';

export interface PageSeo {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private document = inject(DOCUMENT);
  private titleService = inject(Title);
  private meta = inject(Meta);
  readonly lang: SiteLang = currentSiteLang();

  applyLang() {
    this.document.documentElement.setAttribute('lang', this.lang);
  }

  setPage(routerPath: string, seo: PageSeo) {
    const url = SITE_URL + localizedPath(this.lang, routerPath);
    const image = this.absoluteUrl(seo.image || 'assets/logo.png');

    this.titleService.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.removeTag("name='robots'");

    // OpenGraph / Twitter (Facebook, WhatsApp, LinkedIn önizlemeleri)
    this.meta.updateTag({ property: 'og:site_name', content: 'Beeses Audio' });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: seo.type === 'article' ? 'article' : 'website' });
    this.meta.updateTag({ property: 'og:locale', content: this.lang === 'en' ? 'en_US' : 'tr_TR' });
    this.meta.updateTag({ property: 'og:locale:alternate', content: this.lang === 'en' ? 'tr_TR' : 'en_US' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical + TR/EN alternatif sürümler
    this.setLink('canonical', url);
    this.setLink('alternate', SITE_URL + localizedPath('tr', routerPath), 'tr');
    this.setLink('alternate', SITE_URL + localizedPath('en', routerPath), 'en');
    this.setLink('alternate', SITE_URL + localizedPath('tr', routerPath), 'x-default');
  }

  // Admin ve 404 gibi indekslenmemesi gereken sayfalar
  setNoIndex(title: string) {
    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    this.document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(el => el.remove());
    this.setJsonLd('page', null);
  }

  // Yapısal veri (JSON-LD). data null ise ilgili script kaldırılır.
  setJsonLd(id: string, data: object | null) {
    const scriptId = 'jsonld-' + id;
    this.document.getElementById(scriptId)?.remove();
    if (!data) return;
    const script = this.document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  absoluteUrl(path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return SITE_URL + '/' + path.replace(/^\//, '');
  }

  private setLink(rel: string, href: string, hreflang?: string) {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let link = this.document.head.querySelector(selector) as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) link.setAttribute('hreflang', hreflang);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
