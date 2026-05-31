import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService, Product } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

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
                // Map all local/uploaded image URLs
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
              }
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Urun detaylari yuklenirken hata:', err);
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
    if (imagePath.startsWith('assets/')) {
      return imagePath;
    }
    return `${this.apiUrl}/${imagePath}`;
  }
}

