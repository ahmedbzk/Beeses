import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <section class="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-beeses-dark">
      <div class="relative z-10 text-center px-6 max-w-2xl mx-auto pt-40 pb-24">
        <span class="text-beeses-gold text-sm tracking-[0.5em] font-bold uppercase mb-6 block">404</span>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          {{ 'NOT_FOUND_TITLE' | translate }}
        </h1>
        <div class="w-20 h-1 bg-beeses-gold mx-auto rounded-full mb-8"></div>
        <p class="text-gray-300 text-base md:text-lg mb-10">{{ 'NOT_FOUND_TEXT' | translate }}</p>
        <a routerLink="/"
          class="inline-block bg-beeses-gold text-white text-xs font-black uppercase tracking-[0.2em] px-8 py-4 rounded-full hover:bg-white hover:text-beeses-dark transition-colors">
          {{ 'NOT_FOUND_BUTTON' | translate }}
        </a>
      </div>
    </section>
  `
})
export class NotFoundComponent {}
