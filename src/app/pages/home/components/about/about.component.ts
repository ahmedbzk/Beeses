import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  products = [
    { name: 'Petek Stereo.png', titleKey: 'HOME_FEATURED_P4_TITLE', type: 'PRODUCT_TYPE_ACOUSTIC_PRECISION', slug: 'petek-stereo' },
    { name: 'Petek Mono Block.png', titleKey: 'HOME_FEATURED_P3_TITLE', type: 'PRODUCT_TYPE_PURE_ANALOG', slug: 'petek-mono-block' },
  ];

  currentIndex = 0;

  rotateProducts() {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
  }
}