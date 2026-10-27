import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ConsentChoice = 'granted' | 'denied';

// index.html içindeki Consent Mode varsayılanı ile aynı anahtar kullanılır.
const STORAGE_KEY = 'cookie_consent';

@Injectable({
  providedIn: 'root'
})
export class CookieConsentService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly bannerOpen = signal(false);

  // Sadece tarayıcıda ve hydration sonrasında çağrılmalı
  init() {
    if (!this.isBrowser) return;
    if (!this.storedChoice()) this.bannerOpen.set(true);
  }

  open() {
    if (this.isBrowser) this.bannerOpen.set(true);
  }

  choose(choice: ConsentChoice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch { }
    const gtag = (window as any).gtag;
    if (gtag) gtag('consent', 'update', { analytics_storage: choice });
    this.bannerOpen.set(false);
  }

  private storedChoice(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
