import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular'; 
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, TranslateModule], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isSideMenuOpen = false;
  isScrolled = false;
  isLangDropdownOpen = false;

  // Mobil Accordion Durumları
  isMobileKurumsalOpen = false;
  isMobileUrunlerOpen = false;
  isMobileIletisimOpen = false;

  currentLang = { code: 'TR', name: 'Turkish', flag: 'assets/flags/turkey.png' };
  languages = [
    { code: 'TR', name: 'Turkish', flag: 'assets/flags/turkey.png' },
    { code: 'EN', name: 'English', flag: 'assets/flags/england.png' }
  ];

  constructor(private translate: TranslateService) {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('lang');
      if (savedLang) {
        const found = this.languages.find(l => l.code.toLowerCase() === savedLang.toLowerCase());
        if (found) {
          this.currentLang = found;
          this.translate.use(savedLang.toLowerCase());
        } else {
          this.translate.use('tr');
        }
      } else {
        this.translate.use('tr');
      }
    } else {
      this.translate.use('tr');
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleSideMenu() { 
    this.isSideMenuOpen = !this.isSideMenuOpen; 
    // Menü kapandığında alt sekmeleri de sıfırlayalım
    if(!this.isSideMenuOpen) {
      this.isMobileKurumsalOpen = false;
      this.isMobileUrunlerOpen = false;
      this.isMobileIletisimOpen = false;
    }
  }

  toggleLangDropdown() { this.isLangDropdownOpen = !this.isLangDropdownOpen; }
  
  // Accordion Tetikleyicileri
  toggleMobileKurumsal(event: Event) {
  event.stopPropagation(); // Tıklamanın dışarı sızmasını engeller
  this.isMobileKurumsalOpen = !this.isMobileKurumsalOpen;
  // Biri açılınca diğerinin kapanması stabiliteyi artırır
  if (this.isMobileKurumsalOpen) this.isMobileUrunlerOpen = false;
}

toggleMobileUrunler(event: Event) {
  event.stopPropagation();
  this.isMobileUrunlerOpen = !this.isMobileUrunlerOpen;
  if (this.isMobileUrunlerOpen) {
    this.isMobileKurumsalOpen = false;
    this.isMobileIletisimOpen = false;
  }
}

toggleMobileIletisim(event: Event) {
  event.stopPropagation();
  this.isMobileIletisimOpen = !this.isMobileIletisimOpen;
  if (this.isMobileIletisimOpen) {
    this.isMobileKurumsalOpen = false;
    this.isMobileUrunlerOpen = false;
  }
}

  changeLang(lang: any) { 
    this.currentLang = lang; 
    this.isLangDropdownOpen = false;
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang.code.toLowerCase());
      window.location.reload();
    }
  }

}