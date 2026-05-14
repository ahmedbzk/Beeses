import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header-v1',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header-v1.component.html',
  styleUrl: './header-v1.component.scss'
})
export class HeaderV1Component {
  isSideMenuOpen = false;
  isScrolled = false;
  isLangDropdownOpen = false;

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
    if(!this.isSideMenuOpen) {
      this.isMobileKurumsalOpen = false;
      this.isMobileUrunlerOpen = false;
    }
  }

  toggleLangDropdown() { this.isLangDropdownOpen = !this.isLangDropdownOpen; }
  
  toggleMobileKurumsal(event: Event) {
    event.stopPropagation();
    this.isMobileKurumsalOpen = !this.isMobileKurumsalOpen;
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
