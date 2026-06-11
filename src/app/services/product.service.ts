import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProductSpec {
  name: string;
  value: string;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface Product {
  id?: number;
  slug: string;
  name: string;
  name_en?: string;
  category: string;
  shortDescription: string;
  description?: string;
  shortDescription_en?: string;
  description_en?: string;
  image: string;
  images?: string[];
  pdfUrl?: string;
  pdfUrl_en?: string;
  specs: ProductSpec[];
  features: ProductFeature[];
  specs_en?: ProductSpec[];
  features_en?: ProductFeature[];
  created_at?: string;
  selected?: boolean; // UI multi-select helper
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-products.php`);
  }

  getProductBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-product.php?slug=${slug}`);
  }

  addProduct(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-product.php`, data);
  }

  updateProduct(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-product.php`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/delete-product.php?id=${id}`);
  }
}
