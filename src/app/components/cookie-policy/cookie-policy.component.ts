import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  template: `
    <section class="relative w-full h-auto md:h-[40vh] min-h-[350px] md:min-h-[400px] flex items-start justify-center overflow-hidden bg-beeses-silver border-none">
      <div class="absolute inset-0 w-full h-full">
        <img src="assets/backgrounds/bg1.jpg" class="w-full h-full object-cover opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-b from-beeses-dark/95 via-beeses-dark/70 to-beeses-silver"></div>
      </div>
      
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto pt-32 md:pt-40 pb-6 md:pb-12">
        <span class="text-beeses-gold text-[10px] md:text-sm tracking-[0.5em] font-bold uppercase mb-4 md:mb-6 block drop-shadow-md">
          {{ 'FOOTER_COOKIES' | translate }}
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl break-words">
          {{ translate.currentLang === 'tr' ? 'Çerez Ayarları' : 'Cookie Settings' }}
        </h1>
        <div class="w-20 md:w-24 h-1 bg-beeses-gold mx-auto rounded-full mb-8 shadow-[0_0_15px_rgba(181,129,49,0.5)]"></div>
      </div>
    </section>

    <section class="w-full bg-beeses-silver py-20 relative min-h-screen -mt-px">
      <div class="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
        
        <div class="text-gray-800 leading-loose text-base md:text-lg space-y-12">
          
          <div *ngIf="translate.currentLang === 'tr'" class="space-y-8">
            <div class="border-b border-gray-300 pb-6">
              <h2 class="text-3xl font-black text-beeses-dark">Çerez (Cookie) Kullanımı ve Aydınlatma Metni</h2>
              <p class="text-xs text-gray-500 mt-2 font-semibold tracking-wider uppercase">Son Güncelleme: 16 Haziran 2026</p>
            </div>
            
            <p class="text-justify text-lg font-light text-gray-700">
              <strong>Beeses Audio Technology</strong> olarak web sitemizde, ziyaretçilerimizin kullanıcı deneyimini en üst seviyeye çıkarmak, kişiselleştirilmiş içerikler sunmak ve site trafiğini analiz etmek amacıyla çerezlerden faydalanıyoruz.
            </p>
            
            <div class="space-y-10 pt-6">
              <div class="space-y-4">
                <h3 class="text-2xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  1. Çerez Nedir?
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza (bilgisayar, telefon, tablet vb.) kaydedilen küçük metin dosyalarıdır. Bu dosyalar, siteyi tekrar ziyaret ettiğinizde tercihlerinizi hatırlamamıza yardımcı olur.
                </p>
              </div>
              
              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-2xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  2. Kullandığımız Çerez Türleri
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Sitemizde; temel navigasyon işlevleri ve güvenlik için **Zorunlu Çerezler**, trafik analizleri ve kullanım istatistikleri için **Performans Çerezleri** ve kişisel dil/bölge seçimlerinizi hatırlamak için **İşlevsel Çerezler** kullanılmaktadır.
                </p>
              </div>

              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-2xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  3. Çerez Ayarlarını Nasıl Yönetirsiniz?
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Kullanıcılarımız tarayıcı ayarlarını değiştirerek çerez tercihleri üzerinde tam kontrole sahiptir. Tarayıcınızın ayarlar menüsünden çerezleri engelleme, silme veya onay isteme seçeneklerini aktif hale getirebilirsiniz. Zorunlu çerezleri engellemenin web sitesinin bazı işlevlerini bozabileceğini hatırlatmak isteriz.
                </p>
              </div>
            </div>
          </div>

          <div *ngIf="translate.currentLang !== 'tr'" class="space-y-8">
            <div class="border-b border-gray-300 pb-6">
              <h2 class="text-3xl font-black text-beeses-dark">Cookie Usage & Disclosure Text</h2>
              <p class="text-xs text-gray-500 mt-2 font-semibold tracking-wider uppercase">Last Updated: June 16, 2026</p>
            </div>
            
            <p class="text-justify text-lg font-light text-gray-700">
              As <strong>Beeses Audio Technology</strong>, we utilize cookies on our website to maximize user experience, offer personalized content, and analyze site traffic.
            </p>
            
            <div class="space-y-10 pt-6">
              <div class="space-y-4">
                <h3 class="text-xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  1. What is a Cookie?
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Cookies are small text files saved to your device (computer, phone, tablet, etc.) through your browser when you visit a website. These files help us remember your preferences when you visit the site again.
                </p>
              </div>
              
              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  2. Types of Cookies We Use
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  We use **Strictly Necessary Cookies** for navigation and security, **Performance Cookies** for website traffic analysis and analytics, and **Functional Cookies** to remember your personal settings and language choices.
                </p>
              </div>

              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  3. How to Manage Cookie Settings?
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Our users have full control over cookie preferences by changing browser settings. You can block, delete, or request consent for cookies from your browser's settings menu. Please note that blocking necessary cookies may impair some website functionalities.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class CookiePolicyComponent {
  translate = inject(TranslateService);
}
