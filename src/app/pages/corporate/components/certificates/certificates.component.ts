import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CertificateService, Certificate } from '../../../../services/certificate.service';
import { environment } from '../../../../../environments/environment';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslateModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit {
  private certificateService = inject(CertificateService);
  public translate = inject(TranslateService);
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
      error: () => {}
    });
  }

  openCertificate(filePath: string): void {
    if (filePath) {
      window.open(`${this.apiUrl}/${filePath}`, '_blank');
    }
  }
}

