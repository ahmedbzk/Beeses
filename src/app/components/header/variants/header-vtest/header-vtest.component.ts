import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header-vtest',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header-vtest.component.html',
  styleUrl: './header-vtest.component.scss'
})
export class HeaderVtestComponent {
  @Input() logoColor: string = '#ffb84d';
  @Input() logoSize: number = 80;
  @Input() hasShadow: boolean = true;
  @Input() shadowColor: string = '#ffffff';
  @Input() menuFontSize: number = 11;
  @Input() headerPadding: number = 20;
  @Input() btnBgColor: string = '#000000';
  @Input() btnHoverBgColor: string = '#1f2937';
  @Input() btnTextColor: string = '#ffffff';
  @Input() btnIconColor: string = '#B58131';
  @Input() headerBgColor: string = '#B58131';
  @Input() headerLinkColor: string = '#ffffff';

  isBtnHovered: boolean = false;
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
