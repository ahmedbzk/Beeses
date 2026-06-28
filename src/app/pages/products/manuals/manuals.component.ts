import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProductService, Product } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manuals',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule, TranslateModule],
  templateUrl: './manuals.component.html',
  styleUrl: './manuals.component.scss'
})
export class ManualsComponent implements OnInit {
  private productService = inject(ProductService);
  public translate = inject(TranslateService);

  products: Product[] = [];
  isLoading = true;
  searchQuery = '';
  apiUrl = environment.apiUrl;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.data || [];
          const categoryOrder = ['PETEK SERİSİ', 'OF SERİSİ', 'SQL SERİSİ'];
          this.products.sort((a, b) => {
            const idxA = categoryOrder.indexOf(a.category);
            const idxB = categoryOrder.indexOf(b.category);
            if (idxA !== idxB) {
              return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
            }
            return a.slug.localeCompare(b.slug);
          });
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get filteredProducts(): Product[] {
    if (!this.searchQuery.trim()) return this.products;
    const q = this.searchQuery.toLowerCase().trim();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.name_en && p.name_en.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('assets/')) return path;
    return `${this.apiUrl}/${path}`;
  }

  getManualUrl(item: Product): string | undefined {
    let rawPdf: string | undefined;
    if (this.translate.currentLang === 'en') {
      rawPdf = item.manualUrl_en || item.manualUrl;
    } else {
      rawPdf = item.manualUrl || item.manualUrl_en;
    }
    
    if (!rawPdf || rawPdf.trim() === '' || rawPdf === 'null' || rawPdf === 'undefined') {
      return undefined;
    }
    
    let relativePath = rawPdf;
    if (rawPdf.includes('backend/api/')) {
      relativePath = rawPdf.split('backend/api/')[1];
    } else if (rawPdf.includes('localhost/beeses_api/')) {
      relativePath = rawPdf.split('localhost/beeses_api/')[1];
    } else if (rawPdf.startsWith('http')) {
      return rawPdf;
    }
    
    if (!relativePath || relativePath.trim() === '' || relativePath === 'null' || relativePath === 'undefined') {
      return undefined;
    }
    
    return `${this.apiUrl}/serve-pdf.php?path=${encodeURIComponent(relativePath)}`;
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
