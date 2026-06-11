import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../../services/newsletter.service';
import { InnovationService, Innovation } from '../../../services/innovation.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-innovation',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, TranslateModule],
  templateUrl: './innovation.component.html',
  styleUrl: './innovation.component.scss'
})
export class InnovationComponent implements OnInit {
  private newsletterService = inject(NewsletterService);
  private innovationService = inject(InnovationService);
  public translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);

  apiUrl = environment.apiUrl;
  
  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '';
    if (!isPlatformBrowser(this.platformId)) return '';
    // Only allow absolute URLs or uploads/ paths - ignore old/invalid asset paths
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('uploads/')) {
      return `${this.apiUrl}/${imagePath}`;
    }
    // Old/invalid paths (e.g. assets/products/...) - return empty to hide broken images
    return '';
  }

  // Newsletter state
  newsletterEmail: string = '';
  newsletterLoading: boolean = false;
  newsletterSuccess: boolean = false;
  newsletterError: string = '';

  // Innovations data
  upcomingProducts: Innovation[] = [];
  
  // Modal State
  selectedInnovation: Innovation | null = null;
  isModalOpen: boolean = false;

  ngOnInit() {
    this.fetchInnovations();
  }

  fetchInnovations() {
    this.innovationService.getInnovations().subscribe({
      next: (res) => {
        if (res.success) {
          this.upcomingProducts = res.data;
        }
      },
      error: () => {
        // silently handle fetch errors
      }
    });
  }

  openModal(item: Innovation) {
    this.selectedInnovation = item;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    setTimeout(() => {
      this.selectedInnovation = null;
      document.body.style.overflow = '';
    }, 300); // match transition duration
  }

  // Translation helpers
  getLocalizedTitle(item: Innovation): string {
    return this.translate.currentLang === 'en' && item.title_en ? item.title_en : item.title;
  }

  getLocalizedSubtitle(item: Innovation): string {
    return this.translate.currentLang === 'en' && item.subtitle_en ? item.subtitle_en : item.subtitle;
  }

  getLocalizedDesc(item: Innovation): string {
    return this.translate.currentLang === 'en' && item.description_en ? item.description_en : item.description;
  }

  getLocalizedStatus(item: Innovation): string {
    return this.translate.currentLang === 'en' && item.status_en ? item.status_en : item.status;
  }

  getLocalizedFeatures(item: Innovation): string[] {
    return this.translate.currentLang === 'en' && item.features_en ? item.features_en : item.features;
  }

  getLocalizedSpecs(item: Innovation): any[] {
    if (!item.specs) return [];
    return this.translate.currentLang === 'en' && item.specs_en ? item.specs_en : item.specs;
  }

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
          this.newsletterError = this.translate.currentLang === 'en' ? (res.message || 'An error occurred.') : (res.message || 'Bir hata oluştu.');
        }
      },
      error: () => {
        this.newsletterLoading = false;
        this.newsletterError = this.translate.currentLang === 'en' ? 'Server connection failed.' : 'Sunucu bağlantısı kurulamadı.';
      }
    });
  }
}
