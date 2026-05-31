import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { NewsService, News } from '../../../services/news.service';
import { AlertService } from '../../../services/alert.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-news-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden font-sans">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
          <lucide-icon name="file-text" class="w-5 h-5 text-beeses-gold"></lucide-icon>
          Haber & Duyuru Yönetimi
        </h2>
        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          <button (click)="loadNews()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap cursor-pointer">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      <!-- Toolbar: Search & Filters -->
      <div class="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white" *ngIf="!isLoading">
        
        <!-- Search -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <select [(ngModel)]="searchField" (change)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none cursor-pointer h-10 min-w-[140px]">
            <option value="title">Başlık</option>
            <option value="category">Kategori</option>
            <option value="news_date">Tarih</option>
          </select>
          <div class="relative w-full lg:w-64" *ngIf="searchField !== 'news_date'">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <lucide-icon name="search" class="w-4 h-4 text-gray-400"></lucide-icon>
            </div>
            <input type="text" [(ngModel)]="searchQuery" (input)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block w-full pl-10 p-2.5 outline-none h-10 transition-colors" placeholder="Arama yapın...">
          </div>
          <div class="flex items-center gap-2" *ngIf="searchField === 'news_date'">
            <input type="date" [(ngModel)]="searchDateStart" (change)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none h-10 w-full lg:w-36 transition-colors">
            <span class="text-gray-400 font-bold">-</span>
            <input type="date" [(ngModel)]="searchDateEnd" (change)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none h-10 w-full lg:w-36 transition-colors">
          </div>
        </div>

        <!-- Right statistics & Bulk Actions -->
        <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div *ngIf="getSelectedCount() > 0" class="flex items-center gap-2 animate-fade-in pl-0 lg:pl-3 lg:border-l border-gray-200 h-10">
            <span class="text-sm font-bold text-beeses-gold whitespace-nowrap">{{ getSelectedCount() }} Seçili</span>
            <button (click)="executeBulkDelete()" class="h-10 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-bold shadow-sm cursor-pointer">
              <lucide-icon name="trash" class="w-4 h-4"></lucide-icon> <span class="hidden sm:inline">Toplu Sil</span>
            </button>
          </div>
          
          <button (click)="openAddModal()" class="flex items-center gap-2 px-4 py-2 bg-beeses-gold hover:bg-beeses-dark text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer h-10">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon> Yeni Haber Ekle
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="p-6 text-center text-gray-500" *ngIf="isLoading">
        <lucide-icon name="refresh-cw" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
        <p>Haberler Yükleniyor...</p>
      </div>

      <!-- Table View -->
      <div class="overflow-x-auto" *ngIf="!isLoading">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
            <tr>
              <th class="px-6 py-5 w-10 text-center rounded-tl-xl">
                <input type="checkbox" (change)="toggleAll($event)" [checked]="isAllSelected()" class="w-4 h-4 rounded border-gray-300 text-beeses-gold focus:ring-beeses-gold cursor-pointer bg-white/10">
              </th>
              <th class="px-6 py-4">Tarih</th>
              <th class="px-6 py-4 w-24">Görsel</th>
              <th class="px-6 py-4">Haber Bilgisi</th>
              <th class="px-6 py-4">Kategori</th>
              <th class="px-6 py-5 text-center rounded-tr-xl">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr *ngFor="let item of paginatedNews; let i = index" 
                class="transition-colors hover:bg-beeses-gold/5" 
                [ngClass]="item.selected ? 'bg-beeses-gold/10 border-l-2 border-l-beeses-gold' : (i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40 border-l-2 border-l-transparent')">
              
              <!-- Checkbox -->
              <td class="px-6 py-4 text-center">
                <input type="checkbox" [(ngModel)]="item.selected" class="w-4 h-4 rounded border-gray-300 text-beeses-gold focus:ring-beeses-gold cursor-pointer">
              </td>

              <!-- Date (First Column) -->
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                <div class="flex items-center gap-2">
                  <lucide-icon name="calendar" class="w-4 h-4 text-gray-400"></lucide-icon>
                  <span class="text-sm font-medium text-gray-700">{{ item.formatted_date || item.news_date }}</span>
                </div>
              </td>

              <!-- Image Preview -->
              <td class="px-6 py-4">
                <div class="w-16 h-10 rounded overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                  <img [src]="getImageUrl(item.image)" 
                       class="w-full h-full object-cover">
                </div>
              </td>

              <!-- Title & Summary -->
              <td class="px-6 py-4 max-w-sm">
                <div class="font-bold text-beeses-dark line-clamp-1" [title]="item.title">{{ item.title }}</div>
                <div class="text-xs text-gray-400 mt-1 line-clamp-2" [title]="item.summary">{{ item.summary }}</div>
              </td>

              <!-- Category -->
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 bg-beeses-gold/10 text-beeses-gold text-xs font-bold uppercase rounded">
                  {{ item.category }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button *ngIf="getSelectedCount() <= 1" (click)="openEditModal(item)" class="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg transition-colors cursor-pointer" title="Düzenle">
                    <lucide-icon name="sliders" class="w-4 h-4"></lucide-icon>
                  </button>
                  <button (click)="confirmDelete(item)" class="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors cursor-pointer" title="Sil">
                    <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="paginatedNews.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <lucide-icon name="search" class="w-8 h-8 mx-auto mb-3 text-gray-300"></lucide-icon>
                <p>Eşleşen kayıt bulunamadı.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50" *ngIf="!isLoading && filteredNews.length > 0">
        <span class="text-sm text-gray-600">
          Toplam <strong>{{ filteredNews.length }}</strong> kayıttan <strong>{{ getStartRange() }}</strong> - <strong>{{ getEndRange() }}</strong> arası gösteriliyor
        </span>
        <div class="flex items-center gap-1">
          <button (click)="currentPage = currentPage - 1" [disabled]="currentPage === 1" class="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-beeses-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center cursor-pointer">
            <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
          </button>
          <button *ngFor="let page of getPages()" (click)="currentPage = page" [ngClass]="currentPage === page ? 'bg-beeses-gold text-white border-beeses-gold' : 'border-gray-200 text-gray-600 hover:bg-white'" class="px-3 py-1.5 rounded-lg border text-sm font-bold transition-colors cursor-pointer">
            {{ page }}
          </button>
          <button (click)="currentPage = currentPage + 1" [disabled]="currentPage === totalPages()" class="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-beeses-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center cursor-pointer">
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 font-bold">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="file-text" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            {{ editingItem ? 'Haber Düzenle' : 'Yeni Haber Ekle' }}
          </h2>
          <button (click)="closeModal()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white cursor-pointer">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-grow space-y-5">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Title -->
            <div class="md:col-span-2">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Haber Başlığı *</label>
              <input type="text" [(ngModel)]="formData.title" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Haber başlığı yazın...">
            </div>
            
            <!-- Category -->
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kategori *</label>
              <select [(ngModel)]="formData.category" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all cursor-pointer">
                <option value="Haber">Haber</option>
                <option value="Duyuru">Duyuru</option>
                <option value="Etkinlik">Etkinlik</option>
              </select>
            </div>
          </div>

          <div>
            <!-- Image File Upload (Cover) -->
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ana Kapak Görseli *</label>
            <div class="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3">
              <input type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden" #fileInput>
              <button type="button" (click)="fileInput.click()" class="px-4 py-2 bg-beeses-gold/10 text-beeses-gold hover:bg-beeses-gold hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer">
                Kapak Seç
              </button>
              <span class="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-xs">
                {{ selectedFile ? selectedFile.name : (editingItem ? 'Mevcut görseli koru' : 'Dosya seçilmedi') }}
              </span>
              <div *ngIf="imagePreviewUrl || formData.image" class="w-12 h-12 rounded overflow-hidden border border-gray-200 shrink-0 ml-auto bg-white">
                <img [src]="imagePreviewUrl ? imagePreviewUrl : getImageUrl(formData.image)" class="w-full h-full object-cover">
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kısa Özet *</label>
            <textarea [(ngModel)]="formData.summary" rows="2" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Haber kartı listesinde görünecek kısa giriş metni..."></textarea>
          </div>

          <!-- Editorial Stages/Sections (4 Tabs) -->
          <div class="border-t border-gray-100 pt-5">
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Haber Aşamaları / Bölümleri (İç İçe Metin & Görsel)</label>
            
            <!-- Stage Tabs -->
            <div class="flex border-b border-gray-200 mb-4 bg-gray-50/50 rounded-t-xl overflow-hidden">
              <button *ngFor="let tabIdx of [0, 1, 2, 3]" type="button"
                      (click)="activeSectionTab = tabIdx"
                      [class]="activeSectionTab === tabIdx ? 'border-beeses-gold text-beeses-gold bg-white' : 'border-transparent text-gray-500 hover:text-beeses-dark hover:bg-gray-50/30'"
                      class="flex-1 px-4 py-3 border-b-2 font-bold text-xs uppercase tracking-wider outline-none cursor-pointer transition-all">
                Aşama {{ tabIdx + 1 }}
              </button>
            </div>

            <!-- Tab Content -->
            <div *ngFor="let tabIdx of [0, 1, 2, 3]">
              <div *ngIf="activeSectionTab === tabIdx" class="space-y-4 animate-fade-in p-2">
                <!-- Section Title -->
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Aşama {{ tabIdx + 1 }} Başlığı</label>
                  <input type="text" [(ngModel)]="sectionTitles[tabIdx]" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Aşama {{ tabIdx + 1 }} başlığını buraya yazın...">
                </div>

                <!-- Section Text -->
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Aşama {{ tabIdx + 1 }} Metin İçeriği</label>
                  <textarea [(ngModel)]="sectionTexts[tabIdx]" rows="4" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Aşama {{ tabIdx + 1 }} metnini buraya yazın..."></textarea>
                </div>
                
                <!-- Section Image File Upload -->
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Aşama {{ tabIdx + 1 }} Görseli (İsteğe Bağlı)</label>
                  <div class="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <input type="file" (change)="onSectionFileSelected($event, tabIdx)" accept="image/*" class="hidden" #secFileInput>
                    <button type="button" (click)="secFileInput.click()" class="px-4 py-2 bg-beeses-gold/10 text-beeses-gold hover:bg-beeses-gold hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer">
                      Görsel Seç
                    </button>
                    <button *ngIf="getSectionSlotImage(tabIdx)" type="button" (click)="removeSectionImage(tabIdx)" class="px-3 py-2 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
                      <lucide-icon name="trash" class="w-3.5 h-3.5"></lucide-icon>
                      Görseli Sil
                    </button>
                    <span class="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-xs" *ngIf="!getSectionSlotImage(tabIdx)">
                      Görsel yüklenmedi
                    </span>
                    <div *ngIf="getSectionSlotImage(tabIdx) as imgUrl" class="w-12 h-12 rounded overflow-hidden border border-gray-200 shrink-0 ml-auto bg-white">
                      <img [src]="imgUrl" class="w-full h-full object-cover">
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="closeModal()" class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold text-sm transition-colors cursor-pointer">
            İptal
          </button>
          
          <button (click)="saveNews()" 
                  [disabled]="!formData.title || !formData.category || (!selectedFile && !formData.image) || !formData.summary" 
                  class="px-5 py-2.5 rounded-xl bg-beeses-gold hover:bg-beeses-dark text-white font-bold text-sm transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            Kaydet
          </button>
        </div>
      </div>
    </div>

    <!-- Onay Modalı (Confirmation Modal) -->
    <div *ngIf="showConfirmModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform scale-100 transition-all duration-300">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 font-bold">
          <h2 class="text-md font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon [name]="confirmModalType === 'danger' ? 'trash' : 'check'" 
                         [class]="confirmModalType === 'danger' ? 'w-5 h-5 text-red-500' : 'w-5 h-5 text-beeses-gold'"></lucide-icon>
            {{ confirmModalTitle }}
          </h2>
          <button (click)="showConfirmModal = false" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white cursor-pointer">
            <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 text-sm text-gray-600 font-medium">
          {{ confirmModalMessage }}
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="showConfirmModal = false" class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold text-xs transition-colors cursor-pointer">
            İptal
          </button>
          
          <button (click)="executeConfirm()" 
                  [ngClass]="confirmModalType === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-beeses-gold hover:bg-beeses-dark'"
                  class="px-4 py-2 rounded-xl text-white font-bold text-xs transition-colors shadow-md cursor-pointer">
            Evet, Onayla
          </button>
        </div>
      </div>
    </div>
  `
})
export class NewsAdminComponent implements OnInit {
  private newsService = inject(NewsService);
  private alertService = inject(AlertService);
  apiUrl = environment.apiUrl;

  news: (News & { selected?: boolean })[] = [];
  isLoading = true;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;

  // Tabbed editorial section stage selection
  activeSectionTab = 0;
  sectionTitles: string[] = ['', '', '', ''];
  sectionTexts: string[] = ['', '', '', ''];
  sectionFiles: (File | null)[] = [null, null, null, null];
  sectionPreviews: (string | null)[] = [null, null, null, null];
  existingSectionImages: (string | null)[] = [null, null, null, null];

  // Filter & Search states
  searchQuery = '';
  searchDateStart = '';
  searchDateEnd = '';
  searchField = 'title';

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Modal & Form data
  showModal = false;
  editingItem: News | null = null;
  formData: Partial<News> = {};

  // Confirmation Modal states
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalAction: () => void = () => {};
  confirmModalType: 'danger' | 'save' = 'save';

  triggerConfirm(title: string, message: string, action: () => void, type: 'danger' | 'save' = 'save') {
    this.confirmModalTitle = title;
    this.confirmModalMessage = message;
    this.confirmModalAction = action;
    this.confirmModalType = type;
    this.showConfirmModal = true;
  }

  executeConfirm() {
    this.confirmModalAction();
    this.showConfirmModal = false;
  }

  get paginatedNews() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredNews.slice(start, start + this.pageSize);
  }

  getStartRange(): number {
    if (this.filteredNews.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndRange(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredNews.length);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredNews.length / this.pageSize));
  }

  get filteredNews() {
    return this.news.filter(item => {
      if (this.searchField === 'news_date') {
        if (this.searchDateStart || this.searchDateEnd) {
          if (!item.news_date) return false;
          const itemDate = new Date(item.news_date);
          if (this.searchDateStart) {
            const startDate = new Date(this.searchDateStart);
            startDate.setHours(0, 0, 0, 0);
            if (itemDate < startDate) return false;
          }
          if (this.searchDateEnd) {
            const endDate = new Date(this.searchDateEnd);
            endDate.setHours(23, 59, 59, 999);
            if (itemDate > endDate) return false;
          }
        }
      } else if (this.searchQuery.trim() !== '') {
        const query = this.searchQuery.toLowerCase();
        const value = String((item as any)[this.searchField] || '').toLowerCase();
        if (!value.includes(query)) return false;
      }
      return true;
    });
  }

  toggleAll(event: any) {
    const isChecked = event.target.checked;
    this.filteredNews.forEach(item => item.selected = isChecked);
  }

  isAllSelected() {
    if (this.filteredNews.length === 0) return false;
    return this.filteredNews.every(item => item.selected);
  }

  getSelectedCount() {
    return this.news.filter(item => item.selected).length;
  }

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.isLoading = true;
    this.newsService.getNews().subscribe({
      next: (res) => {
        if (res.success) {
          this.news = res.data.map((item: any) => ({ ...item, selected: false }));
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alertService.showError('Haberler yüklenirken hata oluştu.');
      }
    });
  }

  openAddModal() {
    this.editingItem = null;
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.activeSectionTab = 0;

    // Reset sekmeli haber yapılandırması
    this.sectionTitles = ['', '', '', ''];
    this.sectionTexts = ['', '', '', ''];
    this.sectionFiles = [null, null, null, null];
    this.sectionPreviews = [null, null, null, null];
    this.existingSectionImages = [null, null, null, null];

    this.formData = {
      title: '',
      category: 'Haber',
      image: '',
      summary: ''
    };
    this.showModal = true;
  }

  openEditModal(item: News) {
    this.editingItem = item;
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.activeSectionTab = 0;

    // Reset files and previews
    this.sectionFiles = [null, null, null, null];
    this.sectionPreviews = [null, null, null, null];

    // Populate from section data
    const currentSections = item.sections && Array.isArray(item.sections) ? item.sections : [];
    this.sectionTitles = Array.from({ length: 4 }, (_, idx) => currentSections[idx]?.title || '');
    this.sectionTexts = Array.from({ length: 4 }, (_, idx) => currentSections[idx]?.text || '');
    this.existingSectionImages = Array.from({ length: 4 }, (_, idx) => currentSections[idx]?.image || null);

    this.formData = { ...item };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingItem = null;
    this.formData = {};
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.sectionTitles = ['', '', '', ''];
    this.sectionTexts = ['', '', '', ''];
    this.sectionFiles = [null, null, null, null];
    this.sectionPreviews = [null, null, null, null];
    this.existingSectionImages = [null, null, null, null];
    this.activeSectionTab = 0;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSectionFileSelected(event: any, idx: number) {
    const file = event.target.files[0];
    if (file) {
      this.sectionFiles[idx] = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.sectionPreviews[idx] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  getSectionSlotImage(idx: number): string | null {
    if (this.sectionPreviews[idx]) return this.sectionPreviews[idx];
    if (this.existingSectionImages[idx]) return this.getImageUrl(this.existingSectionImages[idx]!);
    return null;
  }

  removeSectionImage(idx: number) {
    this.sectionFiles[idx] = null;
    this.sectionPreviews[idx] = null;
    this.existingSectionImages[idx] = null;
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('assets/')) {
      return imagePath;
    }
    return `${this.apiUrl}/${imagePath}`;
  }

  saveNews() {
    if (!this.formData.title || !this.formData.category || (!this.selectedFile && !this.formData.image) || !this.formData.summary) return;

    const isEdit = !!(this.editingItem && this.editingItem.id);
    const title = isEdit ? 'Güncellemeyi Onayla' : 'Yeni Haber Ekle';
    const message = isEdit 
      ? `"${this.formData.title}" haberinin bilgilerini güncellemek istediğinize emin misiniz?` 
      : 'Yeni haber kaydını onaylıyor musunuz?';

    this.triggerConfirm(title, message, () => {
      this.executeSave();
    }, 'save');
  }

  executeSave() {
    const formDataPayload = new FormData();
    if (this.formData.id) {
      formDataPayload.append('id', String(this.formData.id));
    }
    formDataPayload.append('title', this.formData.title || '');
    formDataPayload.append('category', this.formData.category || '');
    formDataPayload.append('summary', this.formData.summary || '');
    
    if (this.formData.image) {
      formDataPayload.append('image', this.formData.image);
    }
    if (this.selectedFile) {
      formDataPayload.append('image_file', this.selectedFile);
    }

    // Append sections payload
    for (let i = 0; i < 4; i++) {
      formDataPayload.append('section_title_' + i, this.sectionTitles[i] || '');
      formDataPayload.append('section_text_' + i, this.sectionTexts[i] || '');
      formDataPayload.append('section_existing_image_' + i, this.existingSectionImages[i] || '');
      if (this.sectionFiles[i]) {
        formDataPayload.append('section_image_file_' + i, this.sectionFiles[i]!);
      }
    }

    if (this.editingItem && this.editingItem.id) {
      this.newsService.updateNews(formDataPayload).subscribe({
        next: (res) => {
          if (res.success) {
            this.alertService.showSuccess('Haber başarıyla güncellendi.');
            this.loadNews();
            this.closeModal();
          } else {
            this.alertService.showError(res.message || 'Güncelleme hatası.');
          }
        },
        error: () => this.alertService.showError('Güncellenirken bir hata oluştu.')
      });
    } else {
      this.newsService.addNews(formDataPayload).subscribe({
        next: (res) => {
          if (res.success) {
            this.alertService.showSuccess('Haber başarıyla eklendi.');
            this.loadNews();
            this.closeModal();
          } else {
            this.alertService.showError(res.message || 'Ekleme hatası.');
          }
        },
        error: () => this.alertService.showError('Eklenirken bir hata oluştu.')
      });
    }
  }

  confirmDelete(item: News) {
    if (!item.id) return;
    this.triggerConfirm(
      'Silme İşlemini Onayla',
      `"${item.title}" haberini silmek istediğinize emin misiniz?`,
      () => {
        this.newsService.deleteNews(item.id!).subscribe({
          next: (res) => {
            if (res.success) {
              this.alertService.showSuccess('Haber silindi.');
              this.loadNews();
            } else {
              this.alertService.showError(res.message || 'Silme hatası.');
            }
          },
          error: () => this.alertService.showError('Silinirken bir hata oluştu.')
        });
      },
      'danger'
    );
  }

  executeBulkDelete() {
    const selectedItems = this.news.filter(n => n.selected);
    const selectedIds = selectedItems.map(n => n.id).filter(id => id !== undefined) as number[];
    if (selectedIds.length === 0) return;

    this.triggerConfirm(
      'Toplu Silme İşlemini Onayla',
      `Seçtiğiniz ${selectedIds.length} haberi silmek istediğinize emin misiniz?`,
      () => {
        let completed = 0;
        let successCount = 0;
        selectedIds.forEach(id => {
          this.newsService.deleteNews(id).subscribe({
            next: (res) => {
              if (res.success) {
                successCount++;
              }
              completed++;
              if (completed === selectedIds.length) {
                if (successCount === selectedIds.length) {
                  this.alertService.showSuccess('Seçili tüm haberler başarıyla silindi.');
                } else {
                  this.alertService.showError(`${successCount} haber silindi, bazıları silinemedi.`);
                }
                this.loadNews();
              }
            },
            error: () => {
              completed++;
              if (completed === selectedIds.length) {
                this.alertService.showError('Toplu silme işlemi sırasında bazı hatalar oluştu.');
                this.loadNews();
              }
            }
          });
        });
      },
      'danger'
    );
  }
}
