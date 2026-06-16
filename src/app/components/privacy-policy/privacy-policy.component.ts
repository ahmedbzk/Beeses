import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-privacy-policy',
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
          {{ 'FOOTER_PRIVACY' | translate }}
        </span>
        <h1 class="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl break-words">
          {{ translate.currentLang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy' }}
        </h1>
        <div class="w-20 md:w-24 h-1 bg-beeses-gold mx-auto rounded-full mb-8 shadow-[0_0_15px_rgba(181,129,49,0.5)]"></div>
      </div>
    </section>

    <section class="w-full bg-beeses-silver py-20 relative min-h-screen -mt-px">
      <div class="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
        
        <div class="text-gray-800 leading-loose text-base md:text-lg space-y-12">
          
          <div *ngIf="translate.currentLang === 'tr'" class="space-y-8">
            <div class="border-b border-gray-300 pb-6">
              <h2 class="text-3xl font-black text-beeses-dark">Kişisel Verilerin Korunması Politikası</h2>
              <p class="text-xs text-gray-500 mt-2 font-semibold tracking-wider uppercase">Son Güncelleme: 16 Haziran 2026</p>
            </div>
            
            <p class="text-justify text-lg font-light text-gray-700">
              <strong>Beeses Audio Technology</strong> olarak, kullanıcılarımızın gizliliğine ve kişisel verilerinin korunmasına büyük önem veriyoruz. Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde veya sunduğumuz servisleri kullandığınızda verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu açıklar.
            </p>
            
            <div class="space-y-10 pt-6">
              <div class="space-y-4">
                <h3 class="text-2xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  1. Toplanan Veriler
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Web sitemiz üzerinden bülten aboneliği, iletişim formları, distribütör başvuruları veya garanti kayıt formları gibi alanları doldurduğunuzda; adınız, soyadınız, e-posta adresiniz, telefon numaranız, fatura görseliniz ve cihaz bilgileriniz gibi kişisel verileriniz güvenli veritabanlarımızda depolanmaktadır.
                </p>
              </div>
              
              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-2xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  2. Verilerin Kullanım Amacı
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Toplanan verileriniz, ürün garanti süreçlerinin doğrulanması, taleplerinize ve teknik servis ihtiyaçlarınıza geri dönüş yapılması, bülten ve yeni ürün lansmanı bilgilendirmeleri ile kullanıcı deneyimi iyileştirme analizleri gibi amaçlarla işlenmektedir.
                </p>
              </div>

              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-2xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  3. Üçüncü Şahıslarla Paylaşım
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Kişisel verileriniz, yasal zorunluluklar haricinde hiçbir üçüncü şahıs, kurum veya kuruluşla paylaşılmamaktadır. Verileriniz, sunucularımızda en yüksek güvenlik protokolleriyle korunur.
                </p>
              </div>

              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-2xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  4. Kullanıcı Hakları
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Veri sahibi olarak, tarafımıza başvurarak verilerinizin silinmesini, güncellenmesini veya düzeltilmesini talep etme hakkınız bulunmaktadır. İletişim sayfamız üzerinden bizimle her zaman irtibata geçebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          <div *ngIf="translate.currentLang !== 'tr'" class="space-y-8">
            <div class="border-b border-gray-300 pb-6">
              <h2 class="text-3xl font-black text-beeses-dark">Personal Data Protection Policy</h2>
              <p class="text-xs text-gray-500 mt-2 font-semibold tracking-wider uppercase">Last Updated: June 16, 2026</p>
            </div>
            
            <p class="text-justify text-lg font-light text-gray-700">
              As <strong>Beeses Audio Technology</strong>, we attach great importance to the privacy of our users and the protection of their personal data. This privacy policy explains how your data is collected, processed, and protected when you visit our website or use the services we provide.
            </p>
            
            <div class="space-y-10 pt-6">
              <div class="space-y-4">
                <h3 class="text-xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  1. Collected Data
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  When you fill out forms on our website (such as newsletter subscription, contact forms, distributor applications, or warranty registration forms); your personal data, including your name, surname, email address, phone number, invoice image, and device details, is securely stored in our databases.
                </p>
              </div>
              
              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  2. Purpose of Data Processing
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Your collected data is processed for verifying and registering your product warranty, responding to your requests or technical service needs, sending newsletter/campaign updates, and performing statistical analyses to improve our website experience.
                </p>
              </div>

              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  3. Sharing with Third Parties
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  Your personal data is not shared with any third party, institution, or organization, except under legal obligations. Your data is protected on our servers with the highest level of security protocols.
                </p>
              </div>

              <div class="space-y-4 border-t border-gray-200/50 pt-8">
                <h3 class="text-xl font-bold text-beeses-gold flex items-center gap-3">
                  <span class="w-2.5 h-2.5 rounded-full bg-beeses-gold"></span>
                  4. User Rights
                </h3>
                <p class="text-gray-600 text-justify text-base leading-relaxed">
                  As a data subject, you have the right to request the deletion, update, or correction of your data by contacting us. You can reach out to us via our contact page at any time.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `
})
export class PrivacyPolicyComponent {
  translate = inject(TranslateService);
}
