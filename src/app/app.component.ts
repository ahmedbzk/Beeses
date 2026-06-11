import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SocialFabComponent } from './components/social-fab/social-fab.component';
import { AlertComponent } from './components/alert/alert.component';
import { LucideAngularModule } from 'lucide-angular';
import { filter } from 'rxjs/operators';

import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SocialFabComponent,
    AlertComponent,
    LucideAngularModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'beeses-audio';
  isDemoPage = false;

  constructor(
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    private titleService: Title,
    private metaService: Meta
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang');
      this.translate.setDefaultLang('tr');
      if (savedLang) {
        this.translate.use(savedLang.toLowerCase());
      } else {
        this.translate.use('tr');
      }
    } else {
      this.translate.setDefaultLang('tr');
      this.translate.use('tr');
    }

    // Sayfa henüz yüklenirken veya yenilenirken ilk andan itibaren URL kontrolünü yap
    this.checkIfDemoPage(this.location.path());
  }

  ngOnInit() {
    this.updateSEO(this.location.path());

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkIfDemoPage(event.url);
      this.updateSEO(event.url);
      
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  private checkIfDemoPage(url: string) {
    this.isDemoPage = url.includes('/admin');
  }

  private updateSEO(url: string) {
    const path = url.split('?')[0]; // Remove query params
    const lang = this.translate.currentLang || 'tr';
    
    // Skip SEO update for admin pages
    if (path.includes('/admin')) {
      this.titleService.setTitle('Yonetici Paneli | Beeses Audio');
      this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' });
      return;
    }

    this.metaService.removeTag("name='robots'");

    // Default values
    let pageTitle = '';
    let pageDesc = '';
    let pageKeywords = '';

    if (lang === 'tr') {
      pageKeywords = 'beeses audio, amplifikatör, ses sistemleri, amfi, high-end ses, odyofil, yerli amfi üretimi, sql serisi, petek serisi, of serisi, ses teknolojisi, premium ses';
      if (path === '/' || path === '') {
        pageTitle = 'Beeses Audio | Premium Ses Teknolojileri ve Amplifikatörler';
        pageDesc = 'Beeses Audio, yüksek performanslı ses amplifikatörleri alanında yerli Ar-Ge ve inovasyon gücüyle sınırları zorlayan premium ses çözümleri sunar.';
      } else if (path.includes('/corporate/components/about')) {
        pageTitle = 'Hakkımızda | Yerli Ses Sistemleri - Beeses Audio';
        pageDesc = 'Beeses Audio\'nun kuruluş hikayesini, ses felsefesini ve profesyonel amfi üretim süreçlerindeki yüksek standartlarımızı keşfedin.';
      } else if (path.includes('/corporate/components/certificates')) {
        pageTitle = 'Sertifikalar ve Kalite Standartlarımız | Beeses Audio';
        pageDesc = 'Beeses Audio olarak tüm üretim ve yönetim süreçlerimizi uluslararası akreditasyona sahip standartlara göre belgelendiriyoruz.';
      } else if (path.includes('/corporate/components/sss')) {
        pageTitle = 'Sıkça Sorulan Sorular | Destek - Beeses Audio';
        pageDesc = 'Beeses Audio ürünleri, garanti süreçleri, teknik destek ve satış noktalarımız hakkında merak ettiğiniz tüm soruların cevapları.';
      } else if (path.includes('/corporate/components/news')) {
        pageTitle = 'Haberler ve Duyurular | Beeses Audio';
        pageDesc = 'Beeses Audio dünyasındaki en son gelişmeleri, lansmanları, etkinlikleri ve kurumsal haberleri buradan takip edebilirsiniz.';
      } else if (path.includes('/corporate')) {
        pageTitle = 'Kurumsal Yapımız | Beeses Audio';
        pageDesc = 'Ses teknolojilerinde geleceği inşa eden Beeses Audio\'nun kurumsal yapısı, misyonu, vizyonu ve yerli üretim felsefesi hakkında bilgi edinin.';
      } else if (path.includes('/products/innovation')) {
        pageTitle = 'İnovasyon ve Sesin Geleceği | Ar-Ge - Beeses Audio';
        pageDesc = 'JFET giriş katı, Cosmo toroidal trafo ve akıllı termal yönetim gibi Beeses Audio\'nun patentli Ar-Ge ses teknolojilerini keşfedin.';
      } else if (path.includes('/products') && !path.includes('/products/')) { // exact list page
        pageTitle = 'Ürünlerimiz | Profesyonel Amplifikatör Çözümleri | Beeses Audio';
        pageDesc = 'Ses deneyimini zirveye taşıyan yüksek mühendislik eseri amfi serilerimizi inceleyin: SQL, OF ve Petek serisi amfiler.';
      } else if (path.includes('/distributors')) {
        pageTitle = 'Yetkili Distribütörler ve Bayiler | Beeses Audio';
        pageDesc = 'Beeses Audio kalitesine güvenli yollarla ulaşabilmeniz için geniş bayi ağımızı ve yetkili distribütörlerimizi inceleyin.';
      } else if (path.includes('/contact/warranty-query')) {
        pageTitle = 'Garanti Durumu Sorgulama | Beeses Audio';
        pageDesc = 'Cihazınızın seri numarasıyla garanti durumunu, başlangıç ve bitiş tarihlerini anında online sorgulayın.';
      } else if (path.includes('/contact/warranty')) {
        pageTitle = 'Garanti Kayıt Başvurusu | Beeses Audio';
        pageDesc = 'Satın aldığınız Beeses Audio ürünlerinin garanti kaydını online oluşturarak satış sonrası destek hizmetlerimizden yararlanın.';
      } else if (path.includes('/contact')) {
        pageTitle = 'İletişim ve Destek | Beeses Audio';
        pageDesc = 'Bizimle doğrudan iletişime geçmek, öneri, istek veya teknik destek talebi göndermek için iletişim formumuzu kullanabilirsiniz.';
      } else {
        pageTitle = 'Beeses Audio | Premium Ses Teknolojileri';
        pageDesc = 'Beeses Audio, yüksek performanslı ses amplifikatörleri ve premium ses çözümleri.';
      }
    } else {
      // English
      pageKeywords = 'beeses audio, amplifiers, audio systems, amp, high-end audio, audiophile, local amp production, sql series, petek series, of series, sound technology, premium sound';
      if (path === '/' || path === '') {
        pageTitle = 'Beeses Audio | Premium Audio Technologies & Amplifiers';
        pageDesc = 'Beeses Audio offers premium audio solutions, pushing boundaries with domestic R&D and innovation in high-performance audio amplifiers.';
      } else if (path.includes('/corporate/components/about')) {
        pageTitle = 'About Us | Local Audio Systems - Beeses Audio';
        pageDesc = 'Discover the founding story, audio philosophy, and high standards of Beeses Audio in professional amplifier production.';
      } else if (path.includes('/corporate/components/certificates')) {
        pageTitle = 'Certificates & Quality Standards | Beeses Audio';
        pageDesc = 'As Beeses Audio, we document all our production and management processes according to internationally accredited standards.';
      } else if (path.includes('/corporate/components/sss')) {
        pageTitle = 'Frequently Asked Questions | Support - Beeses Audio';
        pageDesc = 'Answers to all your questions about Beeses Audio products, warranty processes, tech support and sales points.';
      } else if (path.includes('/corporate/components/news')) {
        pageTitle = 'News & Announcements | Beeses Audio';
        pageDesc = 'Follow the latest developments, product launches, events and corporate news from the world of Beeses Audio.';
      } else if (path.includes('/corporate')) {
        pageTitle = 'Corporate Structure | Beeses Audio';
        pageDesc = 'Learn about the corporate structure, mission, vision and domestic production philosophy of Beeses Audio, building the future of audio technology.';
      } else if (path.includes('/products/innovation')) {
        pageTitle = 'Innovation & Future of Sound | R&D - Beeses Audio';
        pageDesc = 'Discover patented R&D audio technologies of Beeses Audio, including JFET input stage, Cosmo toroidal transformer, and smart thermal management.';
      } else if (path.includes('/products') && !path.includes('/products/')) {
        pageTitle = 'Products | Professional Amplifier Solutions | Beeses Audio';
        pageDesc = 'Review our highly engineered amplifier series that take the audio experience to the peak: SQL, OF and Petek series.';
      } else if (path.includes('/distributors')) {
        pageTitle = 'Authorized Distributors & Dealers | Beeses Audio';
        pageDesc = 'Examine our wide dealer network and authorized distributors to reach Beeses Audio quality safely.';
      } else if (path.includes('/contact/warranty-query')) {
        pageTitle = 'Check Warranty Status | Beeses Audio';
        pageDesc = 'Check the warranty status, start, and end dates of your device instantly online using its serial number.';
      } else if (path.includes('/contact/warranty')) {
        pageTitle = 'Warranty Registration Application | Beeses Audio';
        pageDesc = 'Register your purchased Beeses Audio products online to benefit from our post-sales support services.';
      } else if (path.includes('/contact')) {
        pageTitle = 'Contact & Support | Beeses Audio';
        pageDesc = 'Use our contact form to get in touch directly, send suggestions, requests or technical support requests.';
      } else {
        pageTitle = 'Beeses Audio | Premium Audio Technologies';
        pageDesc = 'Beeses Audio, high-performance audio amplifiers and premium sound solutions.';
      }
    }

    if (pageTitle) {
      this.titleService.setTitle(pageTitle);
      this.metaService.updateTag({ name: 'description', content: pageDesc });
      this.metaService.updateTag({ name: 'keywords', content: pageKeywords });
      
      // OpenGraph SEO Meta Tags (For Facebook/WhatsApp/Social Media previews)
      this.metaService.updateTag({ property: 'og:title', content: pageTitle });
      this.metaService.updateTag({ property: 'og:description', content: pageDesc });
      this.metaService.updateTag({ property: 'og:image', content: 'assets/logo.png' });
      this.metaService.updateTag({ property: 'og:type', content: 'website' });
      this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      this.metaService.updateTag({ name: 'twitter:title', content: pageTitle });
      this.metaService.updateTag({ name: 'twitter:description', content: pageDesc });
    }
  }
}
