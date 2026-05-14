import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent {
  certificates = [
    {
      id: 1,
      name: 'ISO 9001:2015',
      description: 'Kalite Yönetim Sistemi Sertifikası',
      icon: 'shield-check'
    },
    {
      id: 2,
      name: 'ISO 14001:2015',
      description: 'Çevre Yönetim Sistemi Sertifikası',
      icon: 'leaf'
    },
    {
      id: 3,
      name: 'CE Belgesi',
      description: 'Avrupa Standartlarına Uygunluk Beyanı',
      icon: 'award'
    },
    {
      id: 4,
      name: 'Yerli Üretim Belgesi',
      description: 'Türkiye Cumhuriyeti Sanayi ve Teknoloji Bakanlığı Onaylı',
      icon: 'flag'
    },
    {
      id: 5,
      name: 'TSE Standart Uygunluk',
      description: 'Türk Standartları Enstitüsü Onaylı Üretim Kalitesi',
      icon: 'check-circle'
    },
    {
      id: 6,
      name: 'Hizmet Yeterlilik Belgesi',
      description: 'Satış Sonrası Destek ve Teknik Servis Standartları',
      icon: 'settings'
    }
  ];
}
