import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-innovation',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './innovation.component.html',
  styleUrl: './innovation.component.scss'
})
export class InnovationComponent {
  upcomingProducts = [
    {
      id: 1,
      title: 'B-PRO X SERIES',
      subtitle: 'Sesin Geleceği',
      description: 'Yüksek performanslı dijital sinyal işleme teknolojisi ile donatılmış, konser kalitesinde ses deneyimi sunan yeni nesil hoparlör serimiz.',
      status: 'Geliştirme Aşamasında',
      launchDate: '2024 Q4',
      features: ['Active DSP Control', 'Wireless Hi-Fi Connectivity', 'Sustainable Materials'],
      image: 'assets/products/future-1.jpg' // Placeholder, user will provide actual or I can use generic
    },
    {
      id: 2,
      title: 'AERO-SHELL PETEK',
      subtitle: 'Aerodinamik Akustiğin Zirvesi',
      description: 'Petek serimizin evrimi. Daha hafif, daha dayanıklı ve akustik olarak mükemmelleştirilmiş yeni gövde tasarımı.',
      status: 'Prototip Test Ediliyor',
      launchDate: '2025 Q1',
      features: ['Carbon Fiber Shell', 'Enhanced Cooling System', 'Ultra-Low Distortion'],
      image: 'assets/products/future-2.jpg'
    }
  ];
}
