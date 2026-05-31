import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderV1Component } from '../../components/header/variants/header-v1/header-v1.component';
import { HeaderV2Component } from '../../components/header/variants/header-v2/header-v2.component';
import { HeaderV3Component } from '../../components/header/variants/header-v3/header-v3.component';
import { HeaderV4Component } from '../../components/header/variants/header-v4/header-v4.component';
import { HeaderV5Component } from '../../components/header/variants/header-v5/header-v5.component';
import { HeaderV1_1Component } from '../../components/header/variants/header-v1-1/header-v1-1.component';
import { HeaderV1_2Component } from '../../components/header/variants/header-v1-2/header-v1-2.component';
import { HeaderV1_1_1Component } from '../../components/header/variants/header-v1-1-1/header-v1-1-1.component';
import { HeaderVtestComponent } from '../../components/header/variants/header-vtest/header-vtest.component';

@Component({
  selector: 'app-header-demo',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    HeaderV1Component, 
    HeaderV1_1Component,
    HeaderV1_2Component,
    HeaderV1_1_1Component,
    HeaderV2Component, 
    HeaderV3Component, 
    HeaderV4Component, 
    HeaderV5Component,
    HeaderVtestComponent
  ],
  template: `
    <div class="min-h-screen transition-colors duration-500 overflow-x-hidden bg-gray-100">
      
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
      <app-header-v1-1 *ngIf="activeHeader === '1.1'"></app-header-v1-1>
      <app-header-v1-1-1 *ngIf="activeHeader === '1.1.1'"></app-header-v1-1-1>
      <app-header-v1-2 *ngIf="activeHeader === '1.2'"></app-header-v1-2>
      <app-header-v2 *ngIf="activeHeader === 2"></app-header-v2>
      <app-header-v3 *ngIf="activeHeader === 3"></app-header-v3>
      <app-header-v4 *ngIf="activeHeader === 4"></app-header-v4>
      <app-header-v5 *ngIf="activeHeader === 5"></app-header-v5>
      <app-header-vtest *ngIf="activeHeader === 'test'" 
                        [logoColor]="selectedColor"
                        [logoSize]="selectedSize"
                        [hasShadow]="hasShadow"
                        [shadowColor]="shadowColor"
                        [menuFontSize]="selectedFontSize"
                        [headerPadding]="selectedPadding"
                        [btnBgColor]="selectedBtnBgColor"
                        [btnHoverBgColor]="selectedBtnHoverBgColor"
                        [btnTextColor]="selectedBtnTextColor"
                        [btnIconColor]="selectedBtnIconColor"
                        [headerBgColor]="selectedHeaderBgColor"
                        [headerLinkColor]="selectedHeaderLinkColor"></app-header-vtest>

 
      <!-- Main Content (Simplified) -->
      <div class="pt-60 md:pt-80 px-4 md:px-20 pb-20">
        <div class="max-w-6xl mx-auto">
          
          <div class="mb-20 text-center">
            <span class="text-beeses-gold text-xs font-black tracking-[0.5em] uppercase mb-4 block">Beeses Audio Design Lab</span>
            <h1 class="text-6xl md:text-9xl font-black tracking-tighter mb-8 text-black">
                VARIANT {{ activeVariant.id }}
            </h1>
            <p class="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium text-gray-500">
                {{ activeVariant.desc }}
            </p>
          </div>

          <!-- Color Picker & Controls Panel for VTEST -->
          <div *ngIf="activeHeader === 'test'" class="mb-20 p-8 bg-white rounded-[32px] border border-black/5 shadow-2xl max-w-4xl mx-auto text-left transition-all duration-500">
            <h3 class="text-2xl font-black text-black mb-1 text-center">VTEST Kontrol Paneli</h3>
            <p class="text-xs text-gray-400 font-bold tracking-wider mb-8 text-center uppercase">Logonuzu ve Başlığı Gerçek Zamanlı Özelleştirin</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Column 1: Logo Color & Size -->
              <div class="space-y-6">
                <h4 class="text-xs font-black text-black border-b border-gray-100 pb-2 uppercase tracking-wider">Logo Boyut & Renk</h4>
                <!-- Color Control -->
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Logo Rengi</label>
                  <div class="flex items-center gap-3">
                    <div class="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
                      <input type="color" [(ngModel)]="selectedColor" class="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150">
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[9px] font-bold text-gray-400">HEX Kodu</span>
                      <span class="font-mono text-sm font-black text-black">{{ selectedColor }}</span>
                    </div>
                  </div>
                </div>

                <!-- Size Control -->
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Logo Yüksekliği</label>
                  <div class="flex items-center gap-3">
                    <input type="range" min="40" max="150" [(ngModel)]="selectedSize" class="flex-1 accent-black h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer">
                    <span class="font-mono text-xs font-black text-black w-10 text-right">{{ selectedSize }}px</span>
                  </div>
                </div>
              </div>

              <!-- Column 2: Header & Font Settings -->
              <div class="space-y-6 border-t md:border-t-0 md:border-l md:border-r border-gray-100 pt-6 md:pt-0 md:px-8">
                <h4 class="text-xs font-black text-black border-b border-gray-100 pb-2 uppercase tracking-wider">Header & Menü</h4>
                <!-- Menu Font Size -->
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Menü Yazı Boyutu</label>
                  <div class="flex items-center gap-3">
                    <input type="range" min="9" max="18" [(ngModel)]="selectedFontSize" class="flex-1 accent-black h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer">
                    <span class="font-mono text-xs font-black text-black w-10 text-right">{{ selectedFontSize }}px</span>
                  </div>
                </div>

                <!-- Header Height (Padding) -->
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Header Kalınlığı</label>
                  <div class="flex items-center gap-3">
                    <input type="range" min="0" max="50" [(ngModel)]="selectedPadding" class="flex-1 accent-black h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer">
                    <span class="font-mono text-xs font-black text-black w-10 text-right">{{ selectedPadding }}px</span>
                  </div>
                </div>

                <!-- Header Arka Plan Rengi -->
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Header Arka Plan Rengi</label>
                  <div class="flex items-center gap-3">
                    <div class="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
                      <input type="color" [(ngModel)]="selectedHeaderBgColor" class="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150">
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[8px] font-bold text-gray-400">HEX Kodu</span>
                      <span class="font-mono text-xs font-black text-black">{{ selectedHeaderBgColor }}</span>
                    </div>
                  </div>
                </div>

                <!-- Header Menü Link Rengi -->
                <div>
                  <label class="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Menü Yazı Rengi</label>
                  <div class="flex items-center gap-3">
                    <div class="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
                      <input type="color" [(ngModel)]="selectedHeaderLinkColor" class="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150">
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[8px] font-bold text-gray-400">HEX Kodu</span>
                      <span class="font-mono text-xs font-black text-black">{{ selectedHeaderLinkColor }}</span>
                    </div>
                  </div>
                </div>

                <!-- İletişim Butonu Ayarları -->
                <div class="pt-4 border-t border-gray-100 space-y-4">
                  <h5 class="text-[9px] font-black text-black uppercase tracking-widest mb-1">İletişim Butonu</h5>
                  
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Arka Plan</label>
                      <div class="flex items-center gap-1.5">
                        <input type="color" [(ngModel)]="selectedBtnBgColor" class="w-7 h-7 rounded-lg overflow-hidden border border-gray-100 cursor-pointer">
                        <span class="font-mono text-[9px] font-black text-black leading-none">{{ selectedBtnBgColor }}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Hover</label>
                      <div class="flex items-center gap-1.5">
                        <input type="color" [(ngModel)]="selectedBtnHoverBgColor" class="w-7 h-7 rounded-lg overflow-hidden border border-gray-100 cursor-pointer">
                        <span class="font-mono text-[9px] font-black text-black leading-none">{{ selectedBtnHoverBgColor }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Yazı Rengi</label>
                      <div class="flex items-center gap-1.5">
                        <input type="color" [(ngModel)]="selectedBtnTextColor" class="w-7 h-7 rounded-lg overflow-hidden border border-gray-100 cursor-pointer">
                        <span class="font-mono text-[9px] font-black text-black leading-none">{{ selectedBtnTextColor }}</span>
                      </div>
                    </div>

                    <div>
                      <label class="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">İkon Rengi</label>
                      <div class="flex items-center gap-1.5">
                        <input type="color" [(ngModel)]="selectedBtnIconColor" class="w-7 h-7 rounded-lg overflow-hidden border border-gray-100 cursor-pointer">
                        <span class="font-mono text-[9px] font-black text-black leading-none">{{ selectedBtnIconColor }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Column 3: Shadow Settings -->
              <div class="space-y-6 border-t md:border-t-0 pt-6 md:pt-0">
                <h4 class="text-xs font-black text-black border-b border-gray-100 pb-2 uppercase tracking-wider">Logo Gölgeliği</h4>
                <!-- Shadow Toggle -->
                <div class="flex items-center justify-between mb-3">
                  <label class="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gölgelik Aktif</label>
                  <button (click)="hasShadow = !hasShadow" 
                          class="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                          [ngClass]="hasShadow ? 'bg-black' : 'bg-gray-200'">
                    <span class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          [ngClass]="hasShadow ? 'translate-x-5' : 'translate-x-0'"></span>
                  </button>
                </div>

                <!-- Shadow Color Picker (Conditional) -->
                <div *ngIf="hasShadow" class="space-y-4 transition-all duration-300">
                  <div class="flex items-center gap-3">
                    <div class="relative w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
                      <input type="color" [(ngModel)]="shadowColor" class="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150">
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[9px] font-bold text-gray-400">Gölge Rengi HEX</span>
                      <span class="font-mono text-sm font-black text-black">{{ shadowColor }}</span>
                    </div>
                  </div>

                  <!-- Quick Shadow Presets -->
                  <div class="flex items-center gap-1.5">
                    <span class="text-[8px] font-black text-gray-400 uppercase tracking-widest mr-1">Hazır:</span>
                    <button *ngFor="let color of shadowPresets" (click)="shadowColor = color" 
                            class="w-5 h-5 rounded-full border border-black/10 shadow-sm transition-transform hover:scale-125"
                            [style.backgroundColor]="color"></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Color Presets -->
            <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-3">
              <span class="text-[10px] font-black text-gray-400 mr-2 uppercase tracking-widest">Hazır Logo Renkleri:</span>
              <button *ngFor="let color of presetColors" (click)="selectedColor = color" 
                      class="w-6 h-6 rounded-full border border-black/10 shadow-sm transition-transform hover:scale-125"
                      [style.backgroundColor]="color"></button>
            </div>
          </div>
 
          <div *ngIf="activeHeader !== 'test'" class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div class="aspect-[4/3] md:aspect-square bg-beeses-gold rounded-[60px] flex flex-col items-center justify-center text-white shadow-3xl group cursor-pointer overflow-hidden">
                <p class="text-6xl md:text-7xl font-black mb-4 group-hover:scale-110 transition-transform tracking-tighter">PREMIUM</p>
                <p class="text-[10px] font-black tracking-[0.5em] opacity-60">AUDIO SOLUTIONS</p>
            </div>
            <div class="aspect-[4/3] md:aspect-square rounded-[60px] flex flex-col items-center justify-center border transition-all duration-700 bg-white border-gray-200 text-black shadow-2xl shadow-black/5">
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
  activeHeader: string | number = 1;
  selectedColor: string = '#ffb84d';
  selectedSize: number = 80;
  selectedFontSize: number = 11;
  selectedPadding: number = 20;
  hasShadow: boolean = true;
  shadowColor: string = '#ffffff';
  selectedBtnBgColor: string = '#000000';
  selectedBtnHoverBgColor: string = '#1f2937';
  selectedBtnTextColor: string = '#ffffff';
  selectedBtnIconColor: string = '#b58131';
  selectedHeaderBgColor: string = '#b58131';
  selectedHeaderLinkColor: string = '#ffffff';
  presetColors: string[] = ['#ffb84d', '#b58131', '#000000', '#ffffff', '#dc2626', '#2563eb', '#16a34a'];
  shadowPresets: string[] = ['#ffffff', '#000000', '#b58131', '#ffc107', '#ff5722'];
  
  get activeVariant() {
    return this.variants.find(v => v.id === this.activeHeader) || this.variants[0];
  }
  
  variants = [
    { id: 1, name: 'V1: Gold Bold', desc: 'Altın arka plan, siyah logo ve tam genişlikli kurumsal menü yapısı.' },
    { id: '1.1', name: 'V1.1: Gold Bold (Light Logo)', desc: 'Altın arka plan, açık logo (logo_acik.png - parlamasız) ve tam genişlikli kurumsal menü yapısı.' },
    { id: '1.1.1', name: 'V1.1.1: Gold Bold (Light Logo 2)', desc: 'Altın arka plan, logo_acik2.png logosu (parlamalı) ve tam genişlikli kurumsal menü yapısı.' },
    { id: '1.2', name: 'V1.2: Gold Bold (White Logo)', desc: 'Altın arka plan, beyaz logo (logo_beyaz.png) ve tam genişlikli kurumsal menü yapısı.' },
    { id: 2, name: 'V2: Centered Lacivert', desc: 'Beyaz arka plan, merkezde lacivert logo ve dengeli split menü yerleşimi.' },
    { id: 3, name: 'V3: Centered Off-White', desc: 'Kırık beyaz doku, merkezde siyah logo ve minimalist başlık detayları.' },
    { id: 4, name: 'V4: Koyu Ortalanmış (Sade)', desc: 'Koyu premium arka plan, merkezde parıldayan logo ve split menü düzeni (İletişime geç butonsuz).' },
    { id: 5, name: 'V5: Koyu Ortalanmış', desc: 'Koyu premium arka plan, merkezde parıldayan logo ve split menü yerleşimi.' },
    { id: 'test', name: 'VTEST: Dinamik Renk', desc: 'V1 tabanlı başlık, logo.png ile renk seçimi ve dinamik renklendirme denemesi.' }
  ];
}
