import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header-v6',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './header-v6.component.html',
  styleUrl: './header-v6.component.scss'
})
export class HeaderV6Component {
  isScrolled = false;
  isLangDropdownOpen = false;

  currentLang = { code: 'TR', name: 'Turkish', flag: 'assets/flags/turkey.png' };
  languages = [
    { code: 'TR', name: 'Turkish', flag: 'assets/flags/turkey.png' },
    { code: 'EN', name: 'English', flag: 'assets/flags/england.png' }
  ];

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleLangDropdown() { this.isLangDropdownOpen = !this.isLangDropdownOpen; }

  changeLang(lang: any) {
    this.currentLang = lang;
    this.isLangDropdownOpen = false;
  }
}
