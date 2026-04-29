import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-social-fab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './social-fab.component.html',
  styleUrl: './social-fab.component.scss'
})
export class SocialFabComponent {
  isOpen = false;

  // Masaüstünde hover kontrolü için
  onMouseEnter(): void {
    if (window.innerWidth >= 1024) {
      this.isOpen = true;
    }
  }

  onMouseLeave(): void {
    if (window.innerWidth >= 1024) {
      this.isOpen = false;
    }
  }

  // Tıklama kontrolü
  toggleMenu(event: Event): void {
    this.isOpen = !this.isOpen;
    if (event) {
      event.stopPropagation();
    }
  }

  closeMenu(): void {
    this.isOpen = false;
  }
}
