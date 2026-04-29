import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService, Product } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  
  selectedCategory: string | null = null;
  searchQuery: string = '';
  isLoading: boolean = true;
  isFilterOpen: boolean = false;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Verilerin yüklenmesini simüle etmek için kısa bir gecikme
    setTimeout(() => {
      this.products = this.productService.getProducts();
      this.categories = this.productService.getCategories();
      
      this.route.queryParams.subscribe(params => {
        if (params['category']) {
          this.selectedCategory = params['category'];
        }
        this.applyFilters();
        this.isLoading = false;
      });
    }, 800);
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    this.applyFilters();
    // Mobilde kategori seçilince menüyü kapat
    if (window.innerWidth < 1024) {
      this.isFilterOpen = false;
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
}
