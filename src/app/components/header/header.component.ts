import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule], 
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

  currentLang = { code: 'TR', name: 'Turkish', flag: 'assets/flags/turkey.png' };
  languages = [
    { code: 'TR', name: 'Turkish', flag: 'assets/flags/turkey.png' },
    { code: 'EN', name: 'English', flag: 'assets/flags/england.png' }
  ];

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
  if (this.isMobileUrunlerOpen) this.isMobileKurumsalOpen = false;
}

  changeLang(lang: any) { 
    this.currentLang = lang; 
    this.isLangDropdownOpen = false;
  }
}