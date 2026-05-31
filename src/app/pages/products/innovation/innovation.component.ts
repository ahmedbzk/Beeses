import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../../services/newsletter.service';

@Component({
  selector: 'app-innovation',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './innovation.component.html',
  styleUrl: './innovation.component.scss'
})
export class InnovationComponent {
  private newsletterService = inject(NewsletterService);

  // Newsletter state
  newsletterEmail: string = '';
  newsletterLoading: boolean = false;
  newsletterSuccess: boolean = false;
  newsletterError: string = '';

  subscribeNewsletter(): void {
    if (!this.newsletterEmail || this.newsletterLoading) return;
    this.newsletterLoading = true;
    this.newsletterError = '';

    this.newsletterService.subscribe(this.newsletterEmail).subscribe({
      next: (res) => {
        this.newsletterLoading = false;
        if (res.success) {
          this.newsletterSuccess = true;
        } else {
          this.newsletterError = res.message || 'Bir hata oluştu.';
        }
      },
      error: () => {
        this.newsletterLoading = false;
        this.newsletterError = 'Sunucu bağlantısı kurulamadı.';
      }
    });
  }

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
