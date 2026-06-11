import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderVtestComponent } from '../../components/header/variants/header-vtest/header-vtest.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header-demo',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    LucideAngularModule,
    HeaderVtestComponent
  ],
  template: `
    <div class="min-h-screen transition-colors duration-500 overflow-x-hidden bg-gray-100">
      
      <!-- Variant Selector -->
      <div class="fixed top-1/2 left-6 -translate-y-1/2 z-[10000] flex flex-col gap-3 p-4 bg-white/80 backdrop-blur-xl border border-black/5 shadow-2xl rounded-[32px] max-h-[85vh] overflow-y-auto no-scrollbar">
        <p class="text-[9px] font-black text-gray-400 tracking-[0.2em] mb-2 px-2 uppercase">Tasarımlar</p>
        <button *ngFor="let v of variants" (click)="activeHeader = v.id" 
                class="group relative px-5 py-3 rounded-2xl font-black transition-all text-[11px] text-left flex items-center justify-between gap-4"
                [ngClass]="activeHeader === v.id ? 'bg-black text-white' : 'bg-transparent text-gray-500 hover:bg-black/5'">
          <span class="relative z-10">{{ v.name }}</span>
          <div *ngIf="activeHeader === v.id" class="w-1.5 h-1.5 bg-beeses-gold rounded-full"></div>
        </button>
      </div>
 

      
      <!-- Live VTEST Header -->
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

      <!-- Saved Custom VTEST Headers -->
      <app-header-vtest *ngIf="activeCustomConfig" 
                        [logoColor]="activeCustomConfig.logoColor"
                        [logoSize]="activeCustomConfig.logoSize"
                        [hasShadow]="activeCustomConfig.hasShadow"
                        [shadowColor]="activeCustomConfig.shadowColor"
                        [menuFontSize]="activeCustomConfig.menuFontSize"
                        [headerPadding]="activeCustomConfig.headerPadding"
                        [btnBgColor]="activeCustomConfig.btnBgColor"
                        [btnHoverBgColor]="activeCustomConfig.btnHoverBgColor"
                        [btnTextColor]="activeCustomConfig.btnTextColor"
                        [btnIconColor]="activeCustomConfig.btnIconColor"
                        [headerBgColor]="activeCustomConfig.headerBgColor"
                        [headerLinkColor]="activeCustomConfig.headerLinkColor"></app-header-vtest>

 
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

            <!-- Save Configuration Button -->
            <div class="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center justify-center gap-4">
              <button (click)="addCustomHeader()" 
                      class="flex items-center gap-2 px-8 py-4 bg-beeses-gold hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-xl shadow-beeses-gold/20 hover:shadow-black/20 cursor-pointer text-xs uppercase tracking-widest hover:-translate-y-0.5 transform">
                <lucide-icon name="plus" class="w-4 h-4"></lucide-icon>
                <span>Tasarımı Listeye Ekle (v{{ nextCustomIndex }})</span>
              </button>
              
              <button *ngIf="nextCustomIndex > 6" (click)="clearCustomHeaders()" 
                      class="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest cursor-pointer mt-2 bg-transparent border-0 outline-none">
                [ Tüm Özel Tasarımları Temizle ]
              </button>
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
  activeHeader: string | number = 'test';
  selectedColor: string = '#ffb84d';
  selectedSize: number = 80;
  selectedFontSize: number = 11;
  selectedPadding: number = 20;
  hasShadow: boolean = true;
  shadowColor: string = '#ffffff';
  selectedBtnBgColor: string = '#000000';
  selectedBtnHoverBgColor: string = '#1f2937';
  selectedBtnTextColor: string = '#ffffff';
  selectedBtnIconColor: string = '#b48232';
  selectedHeaderBgColor: string = '#b48232';
  selectedHeaderLinkColor: string = '#ffffff';
  presetColors: string[] = ['#ffb84d', '#b48232', '#000000', '#ffffff', '#dc2626', '#2563eb', '#16a34a'];
  shadowPresets: string[] = ['#ffffff', '#000000', '#b48232', '#ffc107', '#ff5722'];
  
  nextCustomIndex = 6;

  get activeVariant() {
    return this.variants.find(v => v.id === this.activeHeader) || this.variants[0];
  }

  get activeCustomConfig() {
    const variant = this.variants.find(v => v.id === this.activeHeader);
    return variant && (variant as any).config ? (variant as any).config : null;
  }
  
  variants = [
    { id: 'test', name: 'VTEST: Dinamik Renk', desc: 'V1 tabanlı başlık, logo.png ile renk seçimi ve dinamik renklendirme denemesi.' }
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('beeses_custom_headers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const testIndex = this.variants.findIndex(v => v.id === 'test');
          if (testIndex !== -1) {
            this.variants.splice(testIndex, 0, ...parsed);
          } else {
            this.variants.push(...parsed);
          }
          let maxIndex = 5;
          parsed.forEach((p: any) => {
            const num = parseInt(p.id.replace('v', ''), 10);
            if (!isNaN(num) && num > maxIndex) {
              maxIndex = num;
            }
          });
          this.nextCustomIndex = maxIndex + 1;
        } catch (e) {
          // Error loading saved headers
        }
      }
    }
  }

  addCustomHeader() {
    const customId = `v${this.nextCustomIndex}`;
    const customName = `V${this.nextCustomIndex}: Özel Tasarım`;
    const customDesc = `VTEST üzerinde ${new Date().toLocaleTimeString()} saatinde oluşturulup kaydedilen özel tasarım.`;
    
    const config = {
      logoColor: this.selectedColor,
      logoSize: this.selectedSize,
      hasShadow: this.hasShadow,
      shadowColor: this.shadowColor,
      menuFontSize: this.selectedFontSize,
      headerPadding: this.selectedPadding,
      btnBgColor: this.selectedBtnBgColor,
      btnHoverBgColor: this.selectedBtnHoverBgColor,
      btnTextColor: this.selectedBtnTextColor,
      btnIconColor: this.selectedBtnIconColor,
      headerBgColor: this.selectedHeaderBgColor,
      headerLinkColor: this.selectedHeaderLinkColor
    };

    // Insert before 'test' (VTEST) in the variants array
    const testIndex = this.variants.findIndex(v => v.id === 'test');
    if (testIndex !== -1) {
      this.variants.splice(testIndex, 0, {
        id: customId,
        name: customName,
        desc: customDesc,
        config: config
      } as any);
    } else {
      this.variants.push({
        id: customId,
        name: customName,
        desc: customDesc,
        config: config
      } as any);
    }

    // Save to localStorage
    if (typeof window !== 'undefined') {
      const customVariants = this.variants.filter((v: any) => typeof v.id === 'string' && v.id.startsWith('v'));
      localStorage.setItem('beeses_custom_headers', JSON.stringify(customVariants));
    }

    // Automatically switch to the newly created variant
    this.activeHeader = customId;
    this.nextCustomIndex++;
  }

  clearCustomHeaders() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('beeses_custom_headers');
      window.location.reload();
    }
  }
}
