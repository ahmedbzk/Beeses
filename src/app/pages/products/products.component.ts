import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService, Product } from '../../services/product.service';
import { NewsletterService } from '../../services/newsletter.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule, TranslateModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private newsletterService = inject(NewsletterService);
  private route = inject(ActivatedRoute);
  public translate = inject(TranslateService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  
  selectedCategory: string | null = null;
  searchQuery: string = '';
  isLoading: boolean = true;
  isFilterOpen: boolean = false;
  apiUrl = environment.apiUrl;

  newsletterEmail: string = '';
  newsletterLoading: boolean = false;
  newsletterSuccess: boolean = false;
  newsletterError: string = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
          const catSet = new Set(this.products.map(p => p.category));
          this.categories = Array.from(catSet);

          this.route.queryParams.subscribe(params => {
            if (params['category']) {
              this.selectedCategory = params['category'];
            }
            this.applyFilters();
            this.isLoading = false;
          });
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    this.applyFilters();
    if (window.innerWidth < 1024) {
      this.isFilterOpen = false;
    }
  }

  getCategoryTranslationKey(cat: string): string {
    switch (cat) {
      case 'SQL SERİSİ': return 'HEADER_SQL_SERIES';
      case 'OF SERİSİ': return 'HEADER_OF_SERIES';
      case 'PETEK SERİSİ': return 'HEADER_PETEK_SERIES';
      default: return cat;
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.products;

    if (this.selectedCategory) {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q));
    }

    this.filteredProducts = result;
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
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
          this.newsletterError = res.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
        }
      },
      error: () => {
        this.newsletterLoading = false;
        this.newsletterError = 'Sunucu bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.';
      }
    });
  }
}

