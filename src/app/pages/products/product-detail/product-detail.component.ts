import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  isLoading: boolean = true;
  activeTab: string = 'specs'; // Renamed from activeAccordion for tab functionality
  // Description State
  isDescriptionExpanded: boolean = false;
  
  // Gallery & Zoom State
  selectedImage: string = '';
  selectedIndex: number = 0;
  isModalOpen: boolean = false;
  zoomPosition: { x: number, y: number } = { x: 50, y: 50 };
  isZooming: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoading = true;
      const id = params.get('id');
      
      // Simulating network delay
      setTimeout(() => {
        if (id) {
          this.product = this.productService.getProductById(id);
          if (this.product) {
            if (this.product.images && this.product.images.length > 0) {
              this.selectedImage = this.product.images[0];
              this.selectedIndex = 0;
            } else {
              this.selectedImage = this.product.image;
              this.selectedIndex = 0;
            }
          }
        }
        this.isLoading = false;
      }, 600);
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
}
