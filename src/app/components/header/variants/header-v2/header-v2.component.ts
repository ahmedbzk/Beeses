import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header-v2',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header-v2.component.html',
  styleUrl: './header-v2.component.scss'
})
export class HeaderV2Component {
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
  }

  toggleLangDropdown() { this.isLangDropdownOpen = !this.isLangDropdownOpen; }
  
  toggleMobileKurumsal(event: Event) {
    event.stopPropagation();
    this.isMobileKurumsalOpen = !this.isMobileKurumsalOpen;
  }

  toggleMobileUrunler(event: Event) {
    event.stopPropagation();
    this.isMobileUrunlerOpen = !this.isMobileUrunlerOpen;
  }

  changeLang(lang: any) {
    this.currentLang = lang;
    this.isLangDropdownOpen = false;
  }
}
