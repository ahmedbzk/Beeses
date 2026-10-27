import { Component, afterNextRender, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CookieConsentService } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div *ngIf="consent.bannerOpen()" role="dialog" aria-live="polite" [attr.aria-label]="'COOKIE_BANNER_TITLE' | translate"
      class="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-[10000] bg-white text-beeses-dark rounded-2xl shadow-2xl border border-gray-200 p-6">
      <h2 class="text-sm font-black uppercase tracking-widest mb-3">{{ 'COOKIE_BANNER_TITLE' | translate }}</h2>
      <p class="text-sm text-gray-600 leading-relaxed mb-5">
        {{ 'COOKIE_BANNER_TEXT' | translate }}
        <a routerLink="/cookie-policy" class="text-beeses-gold font-bold underline">{{ 'COOKIE_BANNER_POLICY' | translate }}</a>
      </p>
      <div class="flex gap-3">
        <button type="button" (click)="consent.choose('denied')"
          class="flex-1 border border-gray-300 text-gray-700 text-xs font-black uppercase tracking-wider px-4 py-3 rounded-full hover:bg-gray-100 transition-colors">
          {{ 'COOKIE_BANNER_REJECT' | translate }}
        </button>
        <button type="button" (click)="consent.choose('granted')"
          class="flex-1 bg-beeses-gold text-white text-xs font-black uppercase tracking-wider px-4 py-3 rounded-full hover:bg-beeses-dark transition-colors">
          {{ 'COOKIE_BANNER_ACCEPT' | translate }}
        </button>
      </div>
    </div>
  `
})
export class CookieBannerComponent {
  consent = inject(CookieConsentService);

  constructor() {
    // Hydration tamamlandıktan sonra açılır; sunucuda (prerender) hiç render edilmez
    afterNextRender(() => this.consent.init());
  }
}
