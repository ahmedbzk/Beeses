import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderV1Component } from '../../components/header/variants/header-v1/header-v1.component';
import { HeaderV2Component } from '../../components/header/variants/header-v2/header-v2.component';
import { HeaderV3Component } from '../../components/header/variants/header-v3/header-v3.component';
import { HeaderV4Component } from '../../components/header/variants/header-v4/header-v4.component';
import { HeaderV5Component } from '../../components/header/variants/header-v5/header-v5.component';
import { HeaderV6Component } from '../../components/header/variants/header-v6/header-v6.component';

@Component({
  selector: 'app-header-demo',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderV1Component, 
    HeaderV2Component, 
    HeaderV3Component, 
    HeaderV4Component, 
    HeaderV5Component, 
    HeaderV6Component
  ],
  template: `
    <div class="min-h-screen transition-colors duration-500 overflow-x-hidden" [ngClass]="activeHeader === 4 ? 'bg-[#0a0a0a]' : 'bg-gray-100'">
      
      <!-- Variant Selector -->
      <div class="fixed top-1/2 left-6 -translate-y-1/2 z-[10000] flex flex-col gap-3 p-4 bg-white/80 backdrop-blur-xl border border-black/5 shadow-2xl rounded-[32px]">
        <p class="text-[9px] font-black text-gray-400 tracking-[0.2em] mb-2 px-2 uppercase">Tasarımlar</p>
        <button *ngFor="let v of variants" (click)="activeHeader = v.id" 
                class="group relative px-5 py-3 rounded-2xl font-black transition-all text-[11px] text-left flex items-center justify-between gap-4"
                [ngClass]="activeHeader === v.id ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:bg-black/5'">
          <span class="relative z-10">{{ v.name }}</span>
          <div *ngIf="activeHeader === v.id" class="w-1.5 h-1.5 bg-beeses-gold rounded-full"></div>
        </button>
      </div>

      <!-- Header Render -->
      <app-header-v1 *ngIf="activeHeader === 1"></app-header-v1>
      <app-header-v2 *ngIf="activeHeader === 2"></app-header-v2>
      <app-header-v3 *ngIf="activeHeader === 3"></app-header-v3>
      <app-header-v4 *ngIf="activeHeader === 4"></app-header-v4>
      <app-header-v5 *ngIf="activeHeader === 5"></app-header-v5>
      <app-header-v6 *ngIf="activeHeader === 6"></app-header-v6>

      <!-- Main Content (Simplified) -->
      <div class="pt-60 md:pt-80 px-4 md:px-20 pb-20">
        <div class="max-w-6xl mx-auto">
          
          <div class="mb-20 text-center">
            <span class="text-beeses-gold text-xs font-black tracking-[0.5em] uppercase mb-4 block">Beeses Audio Design Lab</span>
            <h1 class="text-6xl md:text-9xl font-black tracking-tighter mb-8"
                [ngClass]="activeHeader === 4 ? 'text-white' : 'text-black'">
                VARIANT 0{{ activeHeader }}
            </h1>
            <p class="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium"
               [ngClass]="activeHeader === 4 ? 'text-white/50' : 'text-gray-500'">
                {{ variants[activeHeader - 1].desc }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="aspect-[4/3] md:aspect-square bg-beeses-gold rounded-[60px] flex flex-col items-center justify-center text-white shadow-3xl group cursor-pointer overflow-hidden">
                <p class="text-6xl md:text-7xl font-black mb-4 group-hover:scale-110 transition-transform tracking-tighter">PREMIUM</p>
                <p class="text-[10px] font-black tracking-[0.5em] opacity-60">AUDIO SOLUTIONS</p>
            </div>
            <div class="aspect-[4/3] md:aspect-square rounded-[60px] flex flex-col items-center justify-center border transition-all duration-700"
                 [ngClass]="activeHeader === 4 ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-black shadow-2xl shadow-black/5'">
                <p class="text-6xl md:text-7xl font-black mb-4 tracking-tighter">FUTURE</p>
                <p class="text-[10px] font-black tracking-[0.5em] opacity-40">TECHNOLOGY</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class HeaderDemoComponent {
  activeHeader = 1;
  variants = [
    { id: 1, name: 'V1: Gold Bold', desc: 'Altın arka plan, siyah logo ve tam genişlikli kurumsal menü yapısı.' },
    { id: 2, name: 'V2: Centered Lacivert', desc: 'Beyaz arka plan, merkezde lacivert logo ve dengeli split menü yerleşimi.' },
    { id: 3, name: 'V3: Centered Off-White', desc: 'Kırık beyaz doku, merkezde siyah logo ve minimalist başlık detayları.' },
    { id: 4, name: 'V4: Floating Glass', desc: 'Buzlu cam efektli, yüzen modern tasarım. Artık kusursuz çalışan dropdown yapısı ile.' },
    { id: 5, name: 'V5: Gold Centered', desc: 'Altın arka plan üzerine merkez siyah logo ve split menü düzeni.' },
    { id: 6, name: 'V6: Creative Soft', desc: 'Orijinal logolu merkez yapı ve modern, animasyonlu dropdown deneyimi.' }
  ];
}
