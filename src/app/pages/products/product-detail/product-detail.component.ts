import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService, Product } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, TranslateModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  public translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  product: Product | undefined;
  isLoading: boolean = true;
  activeTab: string = 'specs'; 
  isDescriptionExpanded: boolean = false;
  
  selectedImage: string = '';
  selectedIndex: number = 0;
  isModalOpen: boolean = false;
  zoomPosition: { x: number, y: number } = { x: 50, y: 50 };
  isZooming: boolean = false;
  apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoading = true;
      const slug = params.get('id');
      
      if (slug) {
        this.productService.getProductBySlug(slug).subscribe({
          next: (response) => {
            if (response.success) {
              this.product = response.data;
              if (this.product) {
                // Update SEO Meta Tags dynamically
                const pName = this.translate.currentLang === 'en' && this.product.name_en ? this.product.name_en : this.product.name;
                const pDesc = this.translate.currentLang === 'en' && this.product.shortDescription_en ? this.product.shortDescription_en : this.product.shortDescription;
                
                this.titleService.setTitle(`${pName} | Beeses Audio`);
                this.metaService.updateTag({ name: 'description', content: pDesc || '' });
                this.metaService.updateTag({ property: 'og:title', content: `${pName} | Beeses Audio` });
                this.metaService.updateTag({ property: 'og:description', content: pDesc || '' });

                if (this.product.images && this.product.images.length > 0) {
                  this.product.images = this.product.images.map(img => this.getImageUrl(img));
                  this.selectedImage = this.product.images[0];
                  this.selectedIndex = 0;
                } else {
                  this.product.image = this.getImageUrl(this.product.image);
                  this.selectedImage = this.product.image;
                  this.selectedIndex = 0;
                }

                if (this.product.pdfUrl) {
                  this.product.pdfUrl = this.getImageUrl(this.product.pdfUrl);
                }
                
                if (this.product.pdfUrl_en) {
                  this.product.pdfUrl_en = this.getImageUrl(this.product.pdfUrl_en);
                }
              }
            }
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  nextImage(): void {
    if (this.product?.images && this.product.images.length > 0) {
      this.selectedIndex = (this.selectedIndex + 1) % this.product.images.length;
      this.selectedImage = this.product.images[this.selectedIndex];
    }
  }

  prevImage(): void {
    if (this.product?.images && this.product.images.length > 0) {
      this.selectedIndex = (this.selectedIndex - 1 + this.product.images.length) % this.product.images.length;
      this.selectedImage = this.product.images[this.selectedIndex];
    }
  }

  selectImage(img: string, index: number): void {
    this.selectedImage = img;
    this.selectedIndex = index;
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isZooming = false;
  }

  onMouseMove(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;
    this.zoomPosition = { x, y };
  }

  onMouseEnter(): void {
    this.isZooming = true;
  }

  onMouseLeave(): void {
    this.isZooming = false;
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('assets/')) {
      return imagePath;
    }
    return `${this.apiUrl}/${imagePath}`;
  }

  getPdfUrl(): string | undefined {
    if (!this.product) return undefined;
    if (this.translate.currentLang === 'en' && this.product.pdfUrl_en) {
      return this.product.pdfUrl_en;
    }
    return this.product.pdfUrl;
  }

  getCategoryTranslationKey(cat: string | undefined): string {
    if (!cat) return '';
    switch (cat) {
      case 'SQL SERİSİ': return 'HEADER_SQL_SERIES';
      case 'OF SERİSİ': return 'HEADER_OF_SERIES';
      case 'PETEK SERİSİ': return 'HEADER_PETEK_SERIES';
      default: return cat;
    }
  }
}

