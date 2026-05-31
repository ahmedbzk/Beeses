import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CertificateService, Certificate } from '../../../../services/certificate.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit {
  private certificateService = inject(CertificateService);
  certificates: Certificate[] = [];
  apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.certificateService.getCertificates().subscribe({
      next: (response) => {
        if (response.success) {
          this.certificates = response.data;
        }
      },
      error: (err) => console.error('Sertifikalar yüklenirken hata:', err)
    });
  }

  openCertificate(filePath: string): void {
    if (filePath) {
      window.open(`${this.apiUrl}/${filePath}`, '_blank');
    }
  }
}

