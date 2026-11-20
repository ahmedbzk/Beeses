import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService, Product } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../../services/seo.service';
import { brochureUrl, manualUrl } from '../../../services/product-documents';
import { ProductCompareComponent, sortProductsBySeries } from '../product-compare/product-compare.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, TranslateModule, ProductCompareComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  public translate = inject(TranslateService);
  private router = inject(Router);
  private seo = inject(SeoService);

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

  // Ürün karşılaştırma: tüm ürün listesi yalnızca ilk açılışta yüklenir
  compareProducts: Product[] = [];
  compareSlugs: string[] = [];
  isCompareOpen = false;
  isCompareLoading = false;

  openCompare(slugs?: string[]): void {
    const slug = this.route.snapshot.paramMap.get('id');
    this.compareSlugs = slugs && slugs.length ? slugs : (slug ? [slug] : []);
    if (this.compareProducts.length > 0) {
      this.isCompareOpen = true;
      return;
    }
    if (this.isCompareLoading) return;
    this.isCompareLoading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.isCompareLoading = false;
        if (res.success) {
          this.compareProducts = sortProductsBySeries(res.data || []);
          this.isCompareOpen = true;
        }
      },
      error: () => { this.isCompareLoading = false; }
    });
  }

  closeCompare(): void {
    this.isCompareOpen = false;
  }

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
                if (this.product.images && this.product.images.length > 0) {
                  this.product.images = this.product.images.map(img => this.getImageUrl(img));
                  this.selectedImage = this.product.images[0];
                  this.selectedIndex = 0;
                } else {
                  this.product.image = this.getImageUrl(this.product.image);
                  this.selectedImage = this.product.image;
                  this.selectedIndex = 0;
                }

                const pName = this.translate.currentLang === 'en' && this.product.name_en ? this.product.name_en : this.product.name;
                const pDesc = this.translate.currentLang === 'en' && this.product.shortDescription_en ? this.product.shortDescription_en : this.product.shortDescription;

                this.seo.setPage(this.router.url, {
                  title: `${pName} | Beeses Audio`,
                  description: pDesc || '',
                  image: this.selectedImage,
                  type: 'product'
                });
              }
            }
            if (!this.product) this.markNotFound();
            this.isLoading = false;
          },
          error: () => {
            this.product = undefined;
            this.markNotFound();
            this.isLoading = false;
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  // Olmayan ürün adresleri Google'da boş sayfa olarak indekslenmesin
  private markNotFound(): void {
    this.seo.setNoIndex(this.seo.lang === 'en' ? 'Product Not Found | Beeses Audio' : 'Ürün Bulunamadı | Beeses Audio');
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

  /** Broşür: sayfanın dilindeki dosya, yoksa diğer dildeki dosya. */
  getPdfUrl(): string | undefined {
    return brochureUrl(this.product, this.translate.currentLang);
  }

  /** Kullanım kılavuzu: iki dil için tek PDF. */
  getManualUrl(): string | undefined {
    return manualUrl(this.product);
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

