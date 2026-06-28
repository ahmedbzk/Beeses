import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ProductService, Product, ProductSpec, ProductFeature } from '../../../services/product.service';
import { AlertService } from '../../../services/alert.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-products-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
          <lucide-icon name="speaker" class="w-5 h-5 text-beeses-gold"></lucide-icon>
          Ürün Kataloğu Yönetimi
        </h2>
        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          <button (click)="loadProducts()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap cursor-pointer">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      
      <div class="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white" *ngIf="!isLoading">
        
        
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          
          <select [(ngModel)]="filterCategory" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none cursor-pointer h-10 min-w-[150px]">
            <option value="">Tüm Kategoriler</option>
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>

          
          <div class="relative w-full lg:w-64">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <lucide-icon name="search" class="w-4 h-4 text-gray-400"></lucide-icon>
            </div>
            <input type="text" [(ngModel)]="searchQuery" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block w-full pl-10 p-2.5 outline-none h-10 transition-colors" placeholder="Ürünlerde arama yapın...">
          </div>
        </div>

        <button *ngIf="hasEditPermission" (click)="openAddModal()" class="flex items-center gap-2 px-4 py-2 bg-beeses-gold hover:bg-beeses-dark text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer h-10 w-full lg:w-auto justify-center">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon> Yeni Ürün Ekle
        </button>
      </div>

      
      <div class="p-6 text-center text-gray-500" *ngIf="isLoading">
        <lucide-icon name="refresh-cw" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
        <p>Ürünler Yükleniyor...</p>
      </div>

      
      <div class="overflow-x-auto" *ngIf="!isLoading">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
            <tr>
              <th class="px-6 py-4 w-16 text-center">ID</th>
              <th class="px-6 py-4 w-24">Görsel</th>
              <th class="px-6 py-4">Ürün Bilgisi (Adı / Slug)</th>
              <th class="px-6 py-4">Kategori</th>
              <th class="px-6 py-4 w-28" [class.rounded-tr-xl]="!hasEditPermission">Döküman</th>
              <th *ngIf="hasEditPermission" class="px-6 py-5 text-center w-28 rounded-tr-xl">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr *ngFor="let item of filteredProducts; let i = index" 
                class="transition-colors hover:bg-beeses-gold/5" 
                [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'">
              
              <td class="px-6 py-4 text-center font-semibold text-beeses-dark">{{ i + 1 }}</td>
              
              
              <td class="px-6 py-4">
                <div class="w-16 h-12 rounded overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-1">
                  <img [src]="getImageUrl(item.image)" class="max-w-full max-h-full object-contain">
                </div>
              </td>
              
              <td class="px-6 py-4">
                <div class="font-bold text-beeses-dark">{{ item.name }}</div>
                <div class="text-xs text-gray-400 font-mono mt-0.5">{{ item.slug }}</div>
              </td>
              
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 bg-beeses-gold/10 text-beeses-gold text-xs font-bold uppercase rounded-full">
                  {{ item.category }}
                </span>
              </td>

              
              <td class="px-6 py-4">
                <div *ngIf="item.pdfUrl; else noPdf">
                  <a [href]="getAdminPdfUrl(item.pdfUrl)" target="_blank" class="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-full text-[10px] font-bold transition-all">
                    <lucide-icon name="file-text" class="w-3 h-3"></lucide-icon> PDF
                  </a>
                </div>
                <ng-template #noPdf>
                  <span class="text-xs text-gray-400 italic">Broşür yok</span>
                </ng-template>
              </td>

              <td *ngIf="hasEditPermission" class="px-6 py-4 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button (click)="openEditModal(item)" class="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg transition-colors cursor-pointer" title="Düzenle">
                    <lucide-icon name="sliders" class="w-4 h-4"></lucide-icon>
                  </button>
                  <button (click)="confirmDelete(item)" class="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors cursor-pointer" title="Sil">
                    <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
             <tr *ngIf="filteredProducts.length === 0">
              <td [attr.colspan]="hasEditPermission ? 6 : 5" class="px-6 py-12 text-center text-gray-500">
                <lucide-icon name="search" class="w-8 h-8 mx-auto mb-3 text-gray-300"></lucide-icon>
                <p>Eşleşen kayıt bulunamadı.</p>
              </td>
            </tr>
        </table>
      </div>
    </div>

    
    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beeses-dark/75 backdrop-blur-md animate-fade-in">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-[1000px] overflow-hidden flex flex-col max-h-[90vh] border border-white/10">
        
        
        <div class="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-beeses-gold/10 flex items-center justify-center text-beeses-gold">
              <lucide-icon name="speaker" class="w-5 h-5"></lucide-icon>
            </div>
            <div>
              <h2 class="text-lg font-bold text-beeses-dark leading-tight">
                {{ editingItem ? 'Ürün Bilgilerini Düzenle' : 'Kataloğa Yeni Ürün Ekle' }}
              </h2>
              <p class="text-xs text-gray-400 mt-0.5" *ngIf="editingItem">Düzenlenen Ürün: {{ editingItem.name }}</p>
              <p class="text-xs text-gray-400 mt-0.5" *ngIf="!editingItem">Kataloğa yeni bir ürün ve özellikleri ekleyin</p>
            </div>
          </div>
          <button (click)="closeModal()" class="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-xl cursor-pointer">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        
        <div class="px-8 pt-4 flex border-b border-gray-100 bg-gray-50/30 gap-2">
          <button type="button" (click)="activeLang = 'tr'" [class]="'flex items-center gap-1.5 px-4 py-2.5 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ' + (activeLang === 'tr' ? 'border-beeses-gold text-beeses-gold bg-white' : 'border-transparent text-gray-400 hover:text-gray-600')">
            Türkçe (TR)
          </button>
          <button type="button" (click)="activeLang = 'en'" [class]="'flex items-center gap-1.5 px-4 py-2.5 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ' + (activeLang === 'en' ? 'border-beeses-gold text-beeses-gold bg-white' : 'border-transparent text-gray-400 hover:text-gray-600')">
            English (EN)
          </button>
        </div>

        
        <div class="flex border-b border-gray-100 bg-gray-50/20 px-8 gap-2 overflow-x-auto scrollbar-none">
          <button type="button" (click)="activeTab = 'basic'" [class]="'flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ' + (activeTab === 'basic' ? 'border-beeses-gold text-beeses-gold' : 'border-transparent text-gray-400 hover:text-gray-600')">
            <lucide-icon name="info" class="w-4 h-4"></lucide-icon> Temel Bilgiler
          </button>
          <button type="button" (click)="activeTab = 'media'" [class]="'flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ' + (activeTab === 'media' ? 'border-beeses-gold text-beeses-gold' : 'border-transparent text-gray-400 hover:text-gray-600')">
            <lucide-icon name="image" class="w-4 h-4"></lucide-icon> Görseller & Broşür
          </button>
          <button type="button" (click)="activeTab = 'specs'" [class]="'flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ' + (activeTab === 'specs' ? 'border-beeses-gold text-beeses-gold' : 'border-transparent text-gray-400 hover:text-gray-600')">
            <lucide-icon name="sliders" class="w-4 h-4"></lucide-icon> Teknik Özellikler ({{ activeLang === 'tr' ? specsList.length : specsList_en.length }})
          </button>
          <button type="button" (click)="activeTab = 'features'" [class]="'flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ' + (activeTab === 'features' ? 'border-beeses-gold text-beeses-gold' : 'border-transparent text-gray-400 hover:text-gray-600')">
            <lucide-icon name="check-circle" class="w-4 h-4"></lucide-icon> Öne Çıkanlar ({{ activeLang === 'tr' ? featuresList.length : featuresList_en.length }})
          </button>
        </div>

        
        <div class="p-8 overflow-y-auto flex-grow bg-white">
          
          
          <div *ngIf="activeTab === 'basic'" class="animate-fade-in space-y-6 max-w-4xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              
              <div class="space-y-4">
                
                <div *ngIf="activeLang === 'tr'" class="animate-fade-in">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Ürün Adı (Türkçe) *</label>
                  <input type="text" [(ngModel)]="formData.name" (input)="generateSlug()" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all font-semibold" placeholder="Örn: SQL-4400">
                </div>

                
                <div *ngIf="activeLang === 'en'" class="animate-fade-in">
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Ürün Adı (İngilizce) *</label>
                  <input type="text" [(ngModel)]="formData.name_en" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all font-semibold" placeholder="Örn: SQL-4400 Premium">
                </div>
                
                
                <div>
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Slug / Rota Linki *</label>
                  <div class="relative flex items-center">
                    <input type="text" [(ngModel)]="formData.slug" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-10 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all font-mono" placeholder="Örn: sql-4400">
                    <lucide-icon name="link" class="w-4 h-4 text-gray-400 absolute right-3.5 pointer-events-none"></lucide-icon>
                  </div>
                </div>
                
                
                <div>
                  <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Kategori *</label>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <select [(ngModel)]="formData.category" class="w-full sm:w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all cursor-pointer font-semibold">
                      <option value="SQL SERİSİ">SQL SERİSİ</option>
                      <option value="OF SERİSİ">OF SERİSİ</option>
                      <option value="PETEK SERİSİ">PETEK SERİSİ</option>
                      <option value="custom">-- Yeni Kategori --</option>
                    </select>
                    <input *ngIf="formData.category === 'custom'" type="text" [(ngModel)]="customCategory" class="w-full sm:w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all animate-fade-in font-semibold" placeholder="Yeni kategori adı...">
                  </div>
                </div>
              </div>
              
              
              <div class="space-y-4">
                
                <ng-container *ngIf="activeLang === 'tr'">
                  <div class="animate-fade-in">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Kısa Açıklama (Türkçe) *</label>
                    <input type="text" [(ngModel)]="formData.shortDescription" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all font-semibold" placeholder="Örn: Odyofil Amplifikatör">
                  </div>
                  
                  <div class="animate-fade-in">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Detaylı Açıklama (Türkçe) *</label>
                    <textarea [(ngModel)]="formData.description" rows="5" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all resize-none" placeholder="Türkçe detaylı ürün tanıtımı..."></textarea>
                  </div>
                </ng-container>

                
                <ng-container *ngIf="activeLang === 'en'">
                  <div class="animate-fade-in">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Kısa Açıklama (İngilizce) *</label>
                    <input type="text" [(ngModel)]="formData.shortDescription_en" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all font-semibold" placeholder="Örn: Audiophile Amplifier">
                  </div>
                  
                  <div class="animate-fade-in">
                    <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Detaylı Açıklama (İngilizce) *</label>
                    <textarea [(ngModel)]="formData.description_en" rows="5" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all resize-none" placeholder="English detailed product description..."></textarea>
                  </div>
                </ng-container>
              </div>

            </div>
          </div>

          
          <div *ngIf="activeTab === 'media'" class="animate-fade-in space-y-8 max-w-4xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              
              <div class="space-y-3">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest">Ana Ürün Görseli *</label>
                
                <div class="relative group border-2 border-dashed border-gray-200 hover:border-beeses-gold/60 rounded-2xl overflow-hidden transition-all bg-gray-50 flex flex-col items-center justify-center cursor-pointer min-h-[220px]">
                  <input type="file" id="primaryImageInput" (change)="onPrimaryImageSelected($event)" accept="image/*" [class]="'absolute inset-0 opacity-0 cursor-pointer z-10 ' + (primaryImagePreview ? 'pointer-events-none' : '')">
                  
                  <ng-container *ngIf="primaryImagePreview; else emptyPrimary">
                    <img [src]="primaryImagePreview" class="w-full h-full object-contain p-2">
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity z-20">
                      <label for="primaryImageInput" class="p-2 bg-white text-gray-800 hover:bg-beeses-gold hover:text-white rounded-full transition-all shadow-md z-30 cursor-pointer">
                        <lucide-icon name="edit" class="w-4 h-4"></lucide-icon>
                      </label>
                      <button type="button" (click)="clearPrimaryImage($event)" class="p-2 bg-white text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-all shadow-md z-30 cursor-pointer">
                        <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                      </button>
                    </div>
                  </ng-container>
                  
                  <ng-template #emptyPrimary>
                    <div class="flex flex-col items-center justify-center p-4 text-center">
                      <div class="w-10 h-10 rounded-full bg-beeses-gold/10 flex items-center justify-center text-beeses-gold mb-2.5">
                        <lucide-icon name="image-plus" class="w-5 h-5"></lucide-icon>
                      </div>
                      <span class="text-xs font-bold text-gray-600 group-hover:text-beeses-gold transition-colors">Görsel Seçin</span>
                      <span class="text-[10px] text-gray-400 mt-1">Sürükleyin veya tıklayın (800x800)</span>
                    </div>
                  </ng-template>
                </div>
              </div>

              
              <div class="md:col-span-2 space-y-3">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest">Galeri Görselleri (Maksimum 4 Adet)</label>
                
                <div class="grid grid-cols-2 gap-4">
                  <div *ngFor="let slot of [0, 1, 2, 3]; let idx = index" class="relative group border-2 border-dashed border-gray-200 hover:border-beeses-gold/60 rounded-xl overflow-hidden transition-all bg-gray-50 flex flex-col items-center justify-center cursor-pointer min-h-[102px]">
                    <input type="file" [id]="'galleryInput_' + idx" (change)="onGalleryFileSelected($event, idx)" accept="image/*" [class]="'absolute inset-0 opacity-0 cursor-pointer z-10 ' + (galleryPreviews[idx] || (editingItem && existingGallery[idx + 1]) ? 'pointer-events-none' : '')">
                    
                    <ng-container *ngIf="galleryPreviews[idx] || (editingItem && existingGallery[idx + 1]); else emptyGallery">
                      <img [src]="galleryPreviews[idx] || getImageUrl(existingGallery[idx + 1])" class="w-full h-full object-contain p-2">
                      
                      
                      <div *ngIf="activeGalleryMenu !== idx" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity z-20">
                        <button type="button" (click)="activeGalleryMenu = idx; $event.stopPropagation();" class="p-1.5 bg-white text-gray-800 hover:bg-beeses-gold hover:text-white rounded-full transition-all shadow-sm z-30 cursor-pointer" title="Düzenle">
                          <lucide-icon name="edit" class="w-3.5 h-3.5"></lucide-icon>
                        </button>
                        <button type="button" (click)="clearGallerySlotBtn($event, idx)" class="p-1.5 bg-white text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-all shadow-sm z-30 cursor-pointer" title="Sil">
                          <lucide-icon name="trash" class="w-3.5 h-3.5"></lucide-icon>
                        </button>
                      </div>

                      
                      <div *ngIf="activeGalleryMenu === idx" class="absolute inset-0 bg-black/75 flex flex-col items-center justify-center p-2 gap-1.5 z-20 animate-fade-in">
                        
                        <button type="button" (click)="swapPrimaryWithGallery(idx); activeGalleryMenu = null; $event.stopPropagation();" class="w-full py-1 bg-beeses-gold hover:bg-beeses-dark text-white rounded-lg text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer">
                          <lucide-icon name="star" class="w-3 h-3"></lucide-icon> Ana Görsel Yap
                        </button>
                        
                        <button type="button" (click)="triggerGalleryInput(idx); $event.stopPropagation();" class="w-full py-1 bg-white hover:bg-gray-100 text-gray-800 rounded-lg text-[10px] font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer">
                          <lucide-icon name="edit" class="w-3 h-3"></lucide-icon> Fotoğrafı Değiştir
                        </button>
                        
                        <button type="button" (click)="activeGalleryMenu = null; $event.stopPropagation();" class="w-full py-0.5 bg-gray-500/30 hover:bg-gray-500/50 text-white rounded-lg text-[9px] font-medium transition-all text-center cursor-pointer">
                          İptal
                        </button>
                      </div>
                    </ng-container>
                    
                    <ng-template #emptyGallery>
                      <div class="flex flex-col items-center justify-center p-2 text-center">
                        <lucide-icon name="plus" class="w-5 h-5 text-gray-400 mb-1 group-hover:text-beeses-gold transition-colors"></lucide-icon>
                        <span class="text-[10px] font-bold text-gray-500 group-hover:text-beeses-gold transition-colors">Görsel {{ idx + 1 }}</span>
                      </div>
                    </ng-template>
                  </div>
                </div>
              </div>

            </div>

            
            <div class="space-y-4 pt-2">
              
              <div *ngIf="activeLang === 'tr'" class="animate-fade-in">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Ürün Broşürü (Türkçe PDF)</label>
                <div class="relative group border border-gray-200 rounded-xl p-4 bg-white hover:border-beeses-gold/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-red-50 text-red-600 rounded-lg">
                      <lucide-icon name="file-text" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-gray-700">Türkçe Kılavuz PDF</span>
                      <span class="text-[10px] text-gray-400" *ngIf="!pdfFileName && !(editingItem && editingItem.pdfUrl)">Mevcut PDF dosyası bulunmamaktadır (Opsiyonel)</span>
                      <span class="text-[10px] text-beeses-gold font-bold truncate max-w-[280px]" *ngIf="pdfFileName || (editingItem && editingItem.pdfUrl)" [title]="pdfFileName || getFileNameFromPath(editingItem?.pdfUrl)">
                        {{ pdfFileName || getFileNameFromPath(editingItem?.pdfUrl) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <div class="relative overflow-hidden">
                      <button type="button" class="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all cursor-pointer">
                        {{ (pdfFileName || (editingItem && editingItem.pdfUrl)) ? 'Dosyayı Değiştir' : 'PDF Seç' }}
                      </button>
                      <input type="file" (change)="onPdfSelected($event)" accept=".pdf" class="absolute inset-0 opacity-0 cursor-pointer">
                    </div>
                    <button *ngIf="pdfFileName || (editingItem && editingItem.pdfUrl)" type="button" (click)="deletePdfBrochure()" class="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-xl border border-transparent transition-all cursor-pointer" title="PDF Kaldır">
                      <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Kullanım Kılavuzu (TR) -->
              <div *ngIf="activeLang === 'tr'" class="animate-fade-in mt-4">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Kullanım Kılavuzu (Türkçe PDF)</label>
                <div class="relative group border border-gray-200 rounded-xl p-4 bg-white hover:border-beeses-gold/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-red-50 text-red-600 rounded-lg">
                      <lucide-icon name="file-text" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-gray-700">Türkçe Kullanım Kılavuzu PDF</span>
                      <span class="text-[10px] text-gray-400" *ngIf="!manualFileName && !(editingItem && editingItem.manualUrl)">Mevcut PDF dosyası bulunmamaktadır (Opsiyonel)</span>
                      <span class="text-[10px] text-beeses-gold font-bold truncate max-w-[280px]" *ngIf="manualFileName || (editingItem && editingItem.manualUrl)" [title]="manualFileName || getFileNameFromPath(editingItem?.manualUrl)">
                        {{ manualFileName || getFileNameFromPath(editingItem?.manualUrl) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <div class="relative overflow-hidden">
                      <button type="button" class="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all cursor-pointer">
                        {{ (manualFileName || (editingItem && editingItem.manualUrl)) ? 'Dosyayı Değiştir' : 'PDF Seç' }}
                      </button>
                      <input type="file" (change)="onManualSelected($event)" accept=".pdf" class="absolute inset-0 opacity-0 cursor-pointer">
                    </div>
                    <button *ngIf="manualFileName || (editingItem && editingItem.manualUrl)" type="button" (click)="deleteManualPdf()" class="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-xl border border-transparent transition-all cursor-pointer" title="PDF Kaldır">
                      <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>

              
              <div *ngIf="activeLang === 'en'" class="animate-fade-in">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Ürün Broşürü (İngilizce PDF)</label>
                <div class="relative group border border-gray-200 rounded-xl p-4 bg-white hover:border-beeses-gold/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-red-50 text-red-600 rounded-lg">
                      <lucide-icon name="file-text" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-gray-700">English Guide PDF</span>
                      <span class="text-[10px] text-gray-400" *ngIf="!pdfFileName_en && !(editingItem && editingItem.pdfUrl_en)">No current PDF file (Optional)</span>
                      <span class="text-[10px] text-beeses-gold font-bold truncate max-w-[280px]" *ngIf="pdfFileName_en || (editingItem && editingItem.pdfUrl_en)" [title]="pdfFileName_en || getFileNameFromPath(editingItem?.pdfUrl_en)">
                        {{ pdfFileName_en || getFileNameFromPath(editingItem?.pdfUrl_en) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <div class="relative overflow-hidden">
                      <button type="button" class="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all cursor-pointer">
                        {{ (pdfFileName_en || (editingItem && editingItem.pdfUrl_en)) ? 'Change File' : 'Select PDF' }}
                      </button>
                      <input type="file" (change)="onPdfSelected_en($event)" accept=".pdf" class="absolute inset-0 opacity-0 cursor-pointer">
                    </div>
                    <button *ngIf="pdfFileName_en || (editingItem && editingItem.pdfUrl_en)" type="button" (click)="deletePdfBrochure_en()" class="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-xl border border-transparent transition-all cursor-pointer" title="PDF Remove">
                      <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Kullanım Kılavuzu (EN) -->
              <div *ngIf="activeLang === 'en'" class="animate-fade-in mt-4">
                <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Kullanım Kılavuzu (İngilizce PDF)</label>
                <div class="relative group border border-gray-200 rounded-xl p-4 bg-white hover:border-beeses-gold/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div class="flex items-center gap-3">
                    <div class="p-2.5 bg-red-50 text-red-600 rounded-lg">
                      <lucide-icon name="file-text" class="w-5 h-5"></lucide-icon>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-gray-700">English User Manual PDF</span>
                      <span class="text-[10px] text-gray-400" *ngIf="!manualFileName_en && !(editingItem && editingItem.manualUrl_en)">No current PDF file (Optional)</span>
                      <span class="text-[10px] text-beeses-gold font-bold truncate max-w-[280px]" *ngIf="manualFileName_en || (editingItem && editingItem.manualUrl_en)" [title]="manualFileName_en || getFileNameFromPath(editingItem?.manualUrl_en)">
                        {{ manualFileName_en || getFileNameFromPath(editingItem?.manualUrl_en) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <div class="relative overflow-hidden">
                      <button type="button" class="px-3.5 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all cursor-pointer">
                        {{ (manualFileName_en || (editingItem && editingItem.manualUrl_en)) ? 'Change File' : 'Select PDF' }}
                      </button>
                      <input type="file" (change)="onManualSelected_en($event)" accept=".pdf" class="absolute inset-0 opacity-0 cursor-pointer">
                    </div>
                    <button *ngIf="manualFileName_en || (editingItem && editingItem.manualUrl_en)" type="button" (click)="deleteManualPdf_en()" class="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-xl border border-transparent transition-all cursor-pointer" title="PDF Remove">
                      <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div *ngIf="activeTab === 'specs'" class="animate-fade-in space-y-6 max-w-3xl mx-auto">
            <div class="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 class="text-sm font-bold text-beeses-dark">
                  {{ activeLang === 'tr' ? 'Teknik Özellik Listesi (Türkçe)' : 'Technical Specification List (English)' }}
                </h3>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ activeLang === 'tr' ? 'Ürünün Türkçe teknik niteliklerini ve değerlerini girin.' : 'Enter the English technical details and values of the product.' }}
                </p>
              </div>
              <button type="button" (click)="addSpecRow()" class="text-xs font-bold tracking-wider uppercase text-beeses-gold hover:text-white hover:bg-beeses-gold flex items-center gap-1.5 cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-beeses-gold/30 hover:border-transparent shadow-sm transition-all">
                <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                {{ activeLang === 'tr' ? 'Yeni Satır Ekle' : 'Add New Row' }}
              </button>
            </div>

            <div class="max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin space-y-3.5">
              
              <div *ngIf="activeLang === 'tr'" class="space-y-3 animate-fade-in">
                <div *ngIf="specsList.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-400 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p class="text-xs font-semibold">Özellik bulunmamaktadır.</p>
                </div>
                <div *ngFor="let spec of specsList; let idx = index" class="flex gap-3 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm animate-fade-in">
                  <div class="grid grid-cols-2 gap-3 flex-grow">
                    <div>
                      <label class="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Özellik Adı (TR)</label>
                      <input type="text" [(ngModel)]="spec.name" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-beeses-gold focus:bg-white transition-all font-semibold" placeholder="Örn: Güç Çıkışı">
                    </div>
                    <div>
                      <label class="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Değer (TR)</label>
                      <input type="text" [(ngModel)]="spec.value" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-beeses-gold focus:bg-white transition-all" placeholder="Örn: 4x200W">
                    </div>
                  </div>
                  <div class="pt-4">
                    <button type="button" (click)="removeSpecRow(idx)" class="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg border border-transparent transition-all cursor-pointer" title="Satırı Sil">
                      <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>

              
              <div *ngIf="activeLang === 'en'" class="space-y-3 animate-fade-in">
                <div *ngIf="specsList_en.length === 0" class="flex flex-col items-center justify-center py-8 text-gray-400 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p class="text-xs font-semibold">No specifications found.</p>
                </div>
                <div *ngFor="let spec of specsList_en; let idx = index" class="flex gap-3 items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm animate-fade-in">
                  <div class="grid grid-cols-2 gap-3 flex-grow">
                    <div>
                      <label class="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Specification Name (EN)</label>
                      <input type="text" [(ngModel)]="spec.name" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-beeses-gold focus:bg-white transition-all font-semibold" placeholder="e.g. Power Output">
                    </div>
                    <div>
                      <label class="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Value (EN)</label>
                      <input type="text" [(ngModel)]="spec.value" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-beeses-gold focus:bg-white transition-all" placeholder="e.g. 4x200W">
                    </div>
                  </div>
                  <div class="pt-4">
                    <button type="button" (click)="removeSpecRow(idx)" class="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg border border-transparent transition-all cursor-pointer" title="Delete Row">
                      <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div *ngIf="activeTab === 'features'" class="animate-fade-in space-y-6 max-w-4xl mx-auto">
            <div class="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 class="text-sm font-bold text-beeses-dark">
                  {{ activeLang === 'tr' ? 'Öne Çıkan Ürün Detayları (Türkçe)' : 'Featured Product Details (English)' }}
                </h3>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ activeLang === 'tr' ? 'Ürünün Türkçe öne çıkan detaylarını girin.' : 'Enter the featured English details of the product.' }}
                </p>
              </div>
              <button type="button" (click)="addFeatureRow()" class="text-xs font-bold tracking-wider uppercase text-beeses-gold hover:text-white hover:bg-beeses-gold flex items-center gap-1.5 cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-beeses-gold/30 hover:border-transparent shadow-sm transition-all">
                <lucide-icon name="plus" class="w-3.5 h-3.5"></lucide-icon>
                {{ activeLang === 'tr' ? 'Detay Ekle' : 'Add Detail' }}
              </button>
            </div>

            <div class="max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
              
              <div *ngIf="activeLang === 'tr'" class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <div *ngIf="featuresList.length === 0" class="col-span-2 flex flex-col items-center justify-center py-8 text-gray-400 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p class="text-xs font-semibold">Henüz öne çıkan detay eklenmemiş.</p>
                </div>
                <div *ngFor="let feat of featuresList; let idx = index" class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative animate-fade-in">
                  <button type="button" (click)="removeFeatureRow(idx)" class="absolute right-3 top-3 p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all cursor-pointer border border-red-50 hover:border-transparent">
                    <lucide-icon name="trash" class="w-3.5 h-3.5"></lucide-icon>
                  </button>
                  <div class="space-y-3 pr-6">
                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Öne Çıkan Başlık (TR)</label>
                      <input type="text" [(ngModel)]="feat.title" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-beeses-gold focus:bg-white transition-all" placeholder="Örn: Koruma Devresi">
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Açıklama Detayı (TR)</label>
                      <textarea [(ngModel)]="feat.description" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-beeses-gold focus:bg-white transition-all resize-none" placeholder="Açıklama..."></textarea>
                    </div>
                  </div>
                </div>
              </div>

              
              <div *ngIf="activeLang === 'en'" class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <div *ngIf="featuresList_en.length === 0" class="col-span-2 flex flex-col items-center justify-center py-8 text-gray-400 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <p class="text-xs font-semibold">No details added yet.</p>
                </div>
                <div *ngFor="let feat of featuresList_en; let idx = index" class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative animate-fade-in">
                  <button type="button" (click)="removeFeatureRow(idx)" class="absolute right-3 top-3 p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all cursor-pointer border border-red-50 hover:border-transparent">
                    <lucide-icon name="trash" class="w-3.5 h-3.5"></lucide-icon>
                  </button>
                  <div class="space-y-3 pr-6">
                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Feature Title (EN)</label>
                      <input type="text" [(ngModel)]="feat.title" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs font-bold focus:outline-none focus:border-beeses-gold focus:bg-white transition-all" placeholder="e.g. Protection Circuit">
                    </div>
                    <div>
                      <label class="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Description (EN)</label>
                      <textarea [(ngModel)]="feat.description" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:border-beeses-gold focus:bg-white transition-all resize-none" placeholder="Description..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        
        <div class="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
          
          <div class="text-xs text-red-500 font-bold flex items-center gap-1.5" *ngIf="validationErrorMsg">
            <lucide-icon name="alert-triangle" class="w-4 h-4 shrink-0"></lucide-icon>
            {{ validationErrorMsg }}
          </div>
          <div *ngIf="!validationErrorMsg"></div>
          
          <div class="flex items-center gap-3.5">
            <button (click)="closeModal()" class="px-5 py-2.5 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-all cursor-pointer">
              Vazgeç
            </button>
            <button (click)="saveProduct()" [disabled]="isSaving" class="px-7 py-2.5 bg-beeses-gold hover:bg-beeses-dark disabled:bg-gray-300 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2">
              <span *ngIf="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>

    
    <div *ngIf="showConfirmModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform scale-100 transition-all duration-300">
        
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-md font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon [name]="confirmType === 'danger' ? 'trash' : 'check'" 
                         [class]="confirmType === 'danger' ? 'w-5 h-5 text-red-500' : 'w-5 h-5 text-beeses-gold'"></lucide-icon>
            {{ confirmTitle }}
          </h2>
          <button (click)="showConfirmModal = false" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white cursor-pointer">
            <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
          </button>
        </div>

        
        <div class="p-6 text-sm text-gray-600 font-medium leading-relaxed">
          {{ confirmMessage }}
        </div>

        
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="showConfirmModal = false" class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold text-xs transition-colors cursor-pointer">
            İptal
          </button>
          
          <button (click)="executeConfirmedAction()" 
                  [ngClass]="confirmType === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-beeses-gold hover:bg-beeses-dark'"
                  class="px-4 py-2 rounded-xl text-white font-bold text-xs transition-colors shadow-md cursor-pointer">
            Evet, Onayla
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductsAdminComponent implements OnInit {
  private productService = inject(ProductService);
  private alertService = inject(AlertService);

  products: Product[] = [];
  categories: string[] = [];
  isLoading = true;
  isSaving = false;
  apiUrl = environment.apiUrl;

  activeTab = 'basic';
  activeLang: 'tr' | 'en' = 'tr';
  activeGalleryMenu: number | null = null;
  primaryImagePreview = '';
  galleryPreviews: string[] = ['', '', '', ''];

  showConfirmModal = false;
  confirmTitle = '';
  confirmMessage = '';
  confirmType: 'danger' | 'success' | 'info' = 'info';
  pendingAction: 'add' | 'edit' | 'delete' | null = null;
  pendingItem: Product | null = null;

  searchQuery = '';
  filterCategory = '';

  showModal = false;
  editingItem: Product | null = null;
  validationErrorMsg = '';
  
  formData = {
    name: '',
    name_en: '',
    slug: '',
    category: 'SQL SERİSİ',
    shortDescription: '',
    shortDescription_en: '',
    description: '',
    description_en: ''
  };
  customCategory = '';

  primaryImageFile: File | null = null;
  primaryImageName = '';

  galleryFiles: (File | null)[] = [null, null, null, null];
  galleryFileNames: string[] = ['', '', '', ''];
  existingGallery: string[] = []; // Preserved gallery items in edit mode
  
  pdfFile: File | null = null;
  pdfFileName = '';
  deletePdfFlag = false;

  pdfFile_en: File | null = null;
  pdfFileName_en = '';
  deletePdfFlag_en = false;

  manualFile: File | null = null;
  manualFileName = '';
  deleteManualFlag = false;

  manualFile_en: File | null = null;
  manualFileName_en = '';
  deleteManualFlag_en = false;

  specsList: ProductSpec[] = [];
  specsList_en: ProductSpec[] = [];
  featuresList: ProductFeature[] = [];
  featuresList_en: ProductFeature[] = [];

  hasEditPermission = false;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('admin_role') || 'admin';
      const permsRaw = localStorage.getItem('admin_permissions') || '{}';
      if (role === 'superadmin') {
        this.hasEditPermission = true;
      } else {
        try {
          const perms = JSON.parse(permsRaw);
          this.hasEditPermission = !!(perms['products'] && perms['products'].edit === true);
        } catch (e) {
          this.hasEditPermission = false;
        }
      }
    }
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
          const catSet = new Set(this.products.map(p => p.category));
          this.categories = Array.from(catSet);
        } else {
          this.alertService.showError('Ürünler yüklenirken hata oluştu.');
        }
        this.isLoading = false;
      },
      error: () => {
        this.alertService.showError('Sunucu bağlantı hatası.');
        this.isLoading = false;
      }
    });
  }

  get filteredProducts(): Product[] {
    let result = this.products;

    if (this.filterCategory) {
      result = result.filter(p => p.category === this.filterCategory);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    return result;
  }

  onPrimaryImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.primaryImageFile = file;
      this.primaryImageName = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.primaryImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  clearPrimaryImage(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.primaryImageFile = null;
    this.primaryImageName = '';
    this.primaryImagePreview = this.editingItem?.image ? this.getImageUrl(this.editingItem.image) : '';
  }

  onGalleryFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.galleryFiles[index] = file;
      this.galleryFileNames[index] = file.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.galleryPreviews[index] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  clearGallerySlot(index: number) {
    this.galleryFiles[index] = null;
    this.galleryFileNames[index] = '';
    this.galleryPreviews[index] = '';
    if (this.editingItem && this.existingGallery[index + 1]) {
      this.existingGallery[index + 1] = '';
    }
  }

  clearGallerySlotBtn(event: Event, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.clearGallerySlot(index);
  }

  onPdfSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.pdfFile = file;
      this.pdfFileName = file.name;
      this.deletePdfFlag = false;
    }
  }

  deletePdfBrochure() {
    this.pdfFile = null;
    this.pdfFileName = '';
    this.deletePdfFlag = true;
    if (this.editingItem) {
      this.editingItem.pdfUrl = '';
    }
  }

  onPdfSelected_en(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.pdfFile_en = file;
      this.pdfFileName_en = file.name;
      this.deletePdfFlag_en = false;
    }
  }

  deletePdfBrochure_en() {
    this.pdfFile_en = null;
    this.pdfFileName_en = '';
    this.deletePdfFlag_en = true;
    if (this.editingItem) {
      this.editingItem.pdfUrl_en = '';
    }
  }

  onManualSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.manualFile = file;
      this.manualFileName = file.name;
      this.deleteManualFlag = false;
    }
  }

  deleteManualPdf() {
    this.manualFile = null;
    this.manualFileName = '';
    this.deleteManualFlag = true;
    if (this.editingItem) {
      this.editingItem.manualUrl = '';
    }
  }

  onManualSelected_en(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.manualFile_en = file;
      this.manualFileName_en = file.name;
      this.deleteManualFlag_en = false;
    }
  }

  deleteManualPdf_en() {
    this.manualFile_en = null;
    this.manualFileName_en = '';
    this.deleteManualFlag_en = true;
    if (this.editingItem) {
      this.editingItem.manualUrl_en = '';
    }
  }

  getFileNameFromPath(path: string | undefined): string {
    if (!path) return '';
    return path.split('/').pop() || '';
  }

  getImageUrl(path: string | undefined): string {
    if (!path) return '';
    if (path.startsWith('assets/')) {
      return path;
    }
    return `${this.apiUrl}/${path}`;
  }

  getAdminPdfUrl(path: string | undefined): string {
    if (!path) return '';
    return `${this.apiUrl}/serve-pdf.php?path=${encodeURIComponent(path)}`;
  }

  swapPrimaryWithGallery(idx: number) {
    const tempFile = this.primaryImageFile;
    this.primaryImageFile = this.galleryFiles[idx];
    this.galleryFiles[idx] = tempFile;

    const tempName = this.primaryImageName;
    this.primaryImageName = this.galleryFileNames[idx];
    this.galleryFileNames[idx] = tempName;

    const tempPreview = this.primaryImagePreview;
    this.primaryImagePreview = this.galleryPreviews[idx];
    this.galleryPreviews[idx] = tempPreview;

    if (this.editingItem) {
      if (!this.existingGallery || this.existingGallery.length === 0) {
        this.existingGallery = [this.editingItem.image || ''];
      }
      
      while (this.existingGallery.length <= idx + 1) {
        this.existingGallery.push('');
      }

      const tempPath = this.existingGallery[0];
      this.existingGallery[0] = this.existingGallery[idx + 1];
      this.existingGallery[idx + 1] = tempPath;
      
      this.editingItem.image = this.existingGallery[0];
    }
  }

  triggerGalleryInput(idx: number) {
    const inputEl = document.getElementById('galleryInput_' + idx) as HTMLInputElement;
    if (inputEl) {
      inputEl.click();
    }
  }

  generateSlug() {
    if (!this.editingItem) {
      this.formData.slug = this.formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
    }
  }

  addSpecRow() {
    this.specsList.push({ name: '', value: '' });
    this.specsList_en.push({ name: '', value: '' });
  }

  removeSpecRow(index: number) {
    this.specsList.splice(index, 1);
    if (this.specsList_en[index] !== undefined) {
      this.specsList_en.splice(index, 1);
    }
  }

  addFeatureRow() {
    this.featuresList.push({ title: '', description: '' });
    this.featuresList_en.push({ title: '', description: '' });
  }

  removeFeatureRow(index: number) {
    this.featuresList.splice(index, 1);
    if (this.featuresList_en[index] !== undefined) {
      this.featuresList_en.splice(index, 1);
    }
  }

  openAddModal() {
    this.validationErrorMsg = '';
    this.editingItem = null;
    this.primaryImageFile = null;
    this.primaryImageName = '';
    this.galleryFiles = [null, null, null, null];
    this.galleryFileNames = ['', '', '', ''];
    this.existingGallery = [];
    this.pdfFile = null;
    this.pdfFileName = '';
    this.deletePdfFlag = false;
    this.pdfFile_en = null;
    this.pdfFileName_en = '';
    this.deletePdfFlag_en = false;
    this.manualFile = null;
    this.manualFileName = '';
    this.deleteManualFlag = false;
    this.manualFile_en = null;
    this.manualFileName_en = '';
    this.deleteManualFlag_en = false;
    this.customCategory = '';
    
    this.formData = {
      name: '',
      name_en: '',
      slug: '',
      category: 'SQL SERİSİ',
      shortDescription: '',
      shortDescription_en: '',
      description: '',
      description_en: ''
    };
    this.specsList = [
      { name: 'Producing Country', value: 'Türkiye' }
    ];
    this.specsList_en = [
      { name: 'Producing Country', value: 'Turkey' }
    ];
    this.featuresList = [];
    this.featuresList_en = [];

    this.activeTab = 'basic';
    this.activeLang = 'tr';
    this.primaryImagePreview = '';
    this.galleryPreviews = ['', '', '', ''];

    this.showModal = true;
  }

  openEditModal(item: Product) {
    this.validationErrorMsg = '';
    this.editingItem = item;
    this.primaryImageFile = null;
    this.primaryImageName = '';
    this.galleryFiles = [null, null, null, null];
    this.galleryFileNames = ['', '', '', ''];
    this.existingGallery = item.images ? [...item.images] : [item.image];
    this.pdfFile = null;
    this.pdfFileName = '';
    this.deletePdfFlag = false;
    this.pdfFile_en = null;
    this.pdfFileName_en = '';
    this.deletePdfFlag_en = false;
    this.manualFile = null;
    this.manualFileName = '';
    this.deleteManualFlag = false;
    this.manualFile_en = null;
    this.manualFileName_en = '';
    this.deleteManualFlag_en = false;
    this.customCategory = '';

    const isPredefined = ['SQL SERİSİ', 'OF SERİSİ', 'PETEK SERİSİ'].includes(item.category);
    this.formData = {
      name: item.name,
      name_en: item.name_en || '',
      slug: item.slug,
      category: isPredefined ? item.category : 'custom',
      shortDescription: item.shortDescription,
      shortDescription_en: item.shortDescription_en || '',
      description: item.description || '',
      description_en: item.description_en || ''
    };

    if (!isPredefined) {
      this.customCategory = item.category;
    }

    this.specsList = item.specs ? JSON.parse(JSON.stringify(item.specs)) : [];
    this.specsList_en = item.specs_en ? JSON.parse(JSON.stringify(item.specs_en)) : [];
    this.featuresList = item.features ? JSON.parse(JSON.stringify(item.features)) : [];
    this.featuresList_en = item.features_en ? JSON.parse(JSON.stringify(item.features_en)) : [];

    this.activeTab = 'basic';
    this.activeLang = 'tr';
    this.primaryImagePreview = item.image ? this.getImageUrl(item.image) : '';
    this.galleryPreviews = ['', '', '', ''];
    if (item.images) {
      for (let i = 0; i < 4; i++) {
        if (item.images[i + 1]) {
          this.galleryPreviews[i] = this.getImageUrl(item.images[i + 1]);
        }
      }
    }

    this.showModal = true;
  }

  closeModal() {
    this.validationErrorMsg = '';
    this.showModal = false;
    this.editingItem = null;
    this.activeTab = 'basic';
    this.activeLang = 'tr';
    this.activeGalleryMenu = null;
    this.primaryImagePreview = '';
    this.galleryPreviews = ['', '', '', ''];
    this.pdfFile_en = null;
    this.pdfFileName_en = '';
    this.deletePdfFlag_en = false;
    this.pdfFile = null;
    this.pdfFileName = '';
    this.deletePdfFlag = false;
    this.manualFile = null;
    this.manualFileName = '';
    this.deleteManualFlag = false;
    this.manualFile_en = null;
    this.manualFileName_en = '';
    this.deleteManualFlag_en = false;
  }

  saveProduct() {
    this.validationErrorMsg = '';
    
    const finalCategory = this.formData.category === 'custom' ? (this.customCategory || '').trim() : this.formData.category;
    const name = (this.formData.name || '').trim();
    const nameEn = (this.formData.name_en || '').trim();
    const slug = (this.formData.slug || '').trim();

    if (!name || !nameEn || !slug || !finalCategory) {
      const missingFields = [];
      if (!name) missingFields.push('Ürün Adı (Türkçe)');
      if (!nameEn) missingFields.push('Ürün Adı (İngilizce)');
      if (!slug) missingFields.push('Slug / Rota Linki');
      if (!finalCategory) missingFields.push('Kategori');
      const errMsg = 'Lütfen zorunlu alanları doldurun: ' + missingFields.join(', ');
      this.validationErrorMsg = errMsg;
      this.alertService.showError(errMsg);
      return;
    }

    if (!this.editingItem && !this.primaryImageFile) {
      const errMsg = 'Yeni ürün için ana görsel yüklemek zorunludur.';
      this.validationErrorMsg = errMsg;
      this.alertService.showError(errMsg);
      return;
    }

    if (this.editingItem) {
      this.confirmTitle = 'Ürün Güncelleme';
      this.confirmMessage = `"${this.formData.name}" isimli ürünü güncellemek istediğinize emin misiniz?`;
      this.confirmType = 'info';
      this.pendingAction = 'edit';
    } else {
      this.confirmTitle = 'Yeni Ürün Ekleme';
      this.confirmMessage = `"${this.formData.name}" isimli ürünü kataloğa eklemek istediğinize emin misiniz?`;
      this.confirmType = 'success';
      this.pendingAction = 'add';
    }
    this.showConfirmModal = true;
  }

  confirmDelete(item: Product) {
    this.confirmTitle = 'Ürün Silme';
    this.confirmMessage = `"${item.name}" isimli ürünü kataloğundan silmek istediğinize emin misiniz? Bütün ilişkili görsel ve döküman dosyaları da fiziksel olarak silinecektir.`;
    this.confirmType = 'danger';
    this.pendingAction = 'delete';
    this.pendingItem = item;
    this.showConfirmModal = true;
  }

  executeConfirmedAction() {
    this.showConfirmModal = false;
    
    if (this.pendingAction === 'add') {
      this.executeSaveProduct(false);
    } else if (this.pendingAction === 'edit') {
      this.executeSaveProduct(true);
    } else if (this.pendingAction === 'delete' && this.pendingItem) {
      this.executeDeleteProduct(this.pendingItem);
    }
    
    this.pendingAction = null;
    this.pendingItem = null;
  }

  executeSaveProduct(isEdit: boolean) {
    const finalCategory = this.formData.category === 'custom' ? (this.customCategory || '').trim() : this.formData.category;
    const validSpecs = this.specsList.filter(s => s.name && s.value && s.name.trim() !== '' && s.value.trim() !== '');
    const validSpecs_en = this.specsList_en.filter(s => s.name && s.value && s.name.trim() !== '' && s.value.trim() !== '');
    const validFeatures = this.featuresList.filter(f => f.title && f.description && f.title.trim() !== '' && f.description.trim() !== '');
    const validFeatures_en = this.featuresList_en.filter(f => f.title && f.description && f.title.trim() !== '' && f.description.trim() !== '');

    this.isSaving = true;

    const payload = new FormData();
    payload.append('name', this.formData.name);
    payload.append('name_en', this.formData.name_en);
    payload.append('slug', this.formData.slug);
    payload.append('category', finalCategory);
    payload.append('shortDescription', this.formData.shortDescription);
    payload.append('shortDescription_en', this.formData.shortDescription_en);
    payload.append('description', this.formData.description);
    payload.append('description_en', this.formData.description_en);
    payload.append('specs', JSON.stringify(validSpecs));
    payload.append('specs_en', JSON.stringify(validSpecs_en));
    payload.append('features', JSON.stringify(validFeatures));
    payload.append('features_en', JSON.stringify(validFeatures_en));

    if (this.primaryImageFile) {
      payload.append('image_file', this.primaryImageFile);
    }

    let galCount = 0;
    for (let i = 0; i < 4; i++) {
      if (this.galleryFiles[i]) {
        payload.append('gallery_file_' + galCount, this.galleryFiles[i]!);
        galCount++;
      }
    }

    if (this.pdfFile) {
      payload.append('pdf_file', this.pdfFile);
    }
    if (this.pdfFile_en) {
      payload.append('pdf_file_en', this.pdfFile_en);
    }
    if (this.manualFile) {
      payload.append('manual_file', this.manualFile);
    }
    if (this.manualFile_en) {
      payload.append('manual_file_en', this.manualFile_en);
    }

    if (isEdit && this.editingItem) {
      payload.append('id', String(this.editingItem.id));
      
      const filteredExisting = this.existingGallery.filter(path => path && path.trim() !== '');
      payload.append('existing_images', JSON.stringify(filteredExisting));

      if (this.deletePdfFlag) {
        payload.append('delete_pdf', 'true');
      }
      if (this.deletePdfFlag_en) {
        payload.append('delete_pdf_en', 'true');
      }
      if (this.deleteManualFlag) {
        payload.append('delete_manual', 'true');
      }
      if (this.deleteManualFlag_en) {
        payload.append('delete_manual_en', 'true');
      }

      this.productService.updateProduct(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.alertService.showSuccess('Ürün başarıyla güncellendi.');
            this.loadProducts();
            this.closeModal();
          } else {
            this.alertService.showError(response.message || 'Ürün güncellenemedi.');
          }
          this.isSaving = false;
        },
        error: () => {
          this.alertService.showError('Ürün güncellenirken hata oluştu.');
          this.isSaving = false;
        }
      });

    } else {
      this.productService.addProduct(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.alertService.showSuccess('Ürün başarıyla eklendi.');
            this.loadProducts();
            this.closeModal();
          } else {
            this.alertService.showError(response.message || 'Ürün eklenemedi.');
          }
          this.isSaving = false;
        },
        error: () => {
          this.alertService.showError('Ürün eklenirken hata oluştu.');
          this.isSaving = false;
        }
      });
    }
  }

  executeDeleteProduct(item: Product) {
    this.productService.deleteProduct(item.id!).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertService.showSuccess('Ürün başarıyla silindi.');
          this.loadProducts();
        } else {
          this.alertService.showError(response.message || 'Ürün silinemedi.');
        }
      },
      error: () => {
        this.alertService.showError('Ürün silinirken hata oluştu.');
      }
    });
  }
}

