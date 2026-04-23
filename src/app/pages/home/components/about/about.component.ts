import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  products = [
    { name: 'Petek Stereo.png', title: 'PETEK STEREO', type: 'ACOUSTIC PRECISION' },
    { name: 'Petek Mono Block.png', title: 'PETEK MONO BLOCK', type: 'PURE ANALOG' },
  ];

  currentIndex = 0;

  rotateProducts() {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
  }
}