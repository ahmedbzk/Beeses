import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-warranties-admin',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
          <lucide-icon name="shield-check" class="w-5 h-5 text-beeses-gold"></lucide-icon>
          Garanti Başvuruları
        </h2>
        <div class="flex items-center gap-4 w-full md:w-auto justify-end">
          <button (click)="loadWarranties()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      <!-- Toolbar: Search & Filters -->
      <div class="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white" *ngIf="!isLoading">
        
        <!-- Search -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <select [(ngModel)]="searchField" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none cursor-pointer h-10 min-w-[120px]">
            <option value="serial_number">Seri No</option>
            <option value="full_name">İsim</option>
            <option value="product_name">Ürün Adı</option>
            <option value="country">Ülke</option>
            <option value="created_at">Tarih</option>
          </select>
          <div class="relative w-full lg:w-64" *ngIf="searchField !== 'created_at'">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <lucide-icon name="search" class="w-4 h-4 text-gray-400"></lucide-icon>
            </div>
            <input type="text" [(ngModel)]="searchQuery" (input)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block w-full pl-10 p-2.5 outline-none h-10 transition-colors" placeholder="Arama yapın...">
          </div>
          <div class="flex items-center gap-2" *ngIf="searchField === 'created_at'">
            <input type="date" [(ngModel)]="searchDateStart" (change)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none h-10 w-full lg:w-32 transition-colors">
            <span class="text-gray-400 font-bold">-</span>
            <input type="date" [(ngModel)]="searchDateEnd" (change)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none h-10 w-full lg:w-32 transition-colors">
          </div>
        </div>

        <!-- Filter Status & Bulk Actions -->
        <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <select [(ngModel)]="filterStatus" (change)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none cursor-pointer h-10 min-w-[140px] ml-auto">
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Bekleyenler</option>
            <option value="approved">Onaylananlar</option>
            <option value="rejected">Reddedilenler</option>
          </select>
          
          <div *ngIf="getSelectedCount() > 0" class="flex items-center gap-2 animate-fade-in pl-0 lg:pl-3 lg:border-l border-gray-200 h-10">
            <span class="text-sm font-bold text-beeses-gold whitespace-nowrap">{{ getSelectedCount() }} Seçili</span>
            <button (click)="openBulkConfirmModal('approved')" class="h-10 px-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-bold shadow-sm">
              <lucide-icon name="check" class="w-4 h-4"></lucide-icon> <span class="hidden sm:inline">Onayla</span>
            </button>
            <button (click)="openBulkConfirmModal('rejected')" class="h-10 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-bold shadow-sm">
              <lucide-icon name="x" class="w-4 h-4"></lucide-icon> <span class="hidden sm:inline">Reddet</span>
            </button>
          </div>
        </div>
      </div>

      <div class="p-6 text-center text-gray-500" *ngIf="isLoading">
        <lucide-icon name="loader" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
        <p>Kayıtlar Yükleniyor...</p>
      </div>

      <div class="overflow-x-auto" *ngIf="!isLoading">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
            <tr>
              <th class="px-6 py-5 w-10 text-center rounded-tl-xl">
                <input type="checkbox" (change)="toggleAll($event)" [checked]="isAllSelected()" class="w-4 h-4 rounded border-gray-300 text-beeses-gold focus:ring-beeses-gold cursor-pointer bg-white/10">
              </th>
              <th class="px-6 py-4">Tarih</th>
              <th class="px-6 py-4">Müşteri Bilgisi</th>
              <th class="px-6 py-4">Ülke / Telefon</th>
              <th class="px-6 py-4">Ürün Adı</th>
              <th class="px-6 py-4">Seri No</th>
              <th class="px-6 py-4 text-center">Fatura</th>
              <th class="px-6 py-5 text-center">Durum</th>
              <th class="px-6 py-5 text-center rounded-tr-xl">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr *ngFor="let item of paginatedWarranties; let i = index" 
                class="transition-colors hover:bg-beeses-gold/5" 
                [ngClass]="item.selected ? 'bg-beeses-gold/10 border-l-2 border-l-beeses-gold' : (i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40 border-l-2 border-l-transparent')">
              <td class="px-6 py-4 text-center">
                <input type="checkbox" [(ngModel)]="item.selected" class="w-4 h-4 rounded border-gray-300 text-beeses-gold focus:ring-beeses-gold cursor-pointer">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <lucide-icon name="calendar" class="w-4 h-4 text-gray-400"></lucide-icon>
                  <span class="text-sm font-medium text-gray-700">{{ item.created_at | date:'dd.MM.yyyy HH:mm' }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="font-bold text-beeses-dark">{{ item.full_name }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ item.email }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="font-medium text-gray-700">{{ item.country }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ item.phone }}</div>
              </td>
              <td class="px-6 py-4 font-bold text-beeses-dark">{{ item.product_name }}</td>
              <td class="px-6 py-4 text-gray-500 font-mono text-xs">{{ item.serial_number }}</td>
              <td class="px-6 py-4 text-center">
                <a [href]="apiUrl + '/' + item.invoice_path" target="_blank" class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors" title="Faturayı Görüntüle">
                  <lucide-icon name="file-text" class="w-4 h-4"></lucide-icon>
                </a>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      [ngClass]="{
                        'bg-yellow-50 text-yellow-600 border border-yellow-200': item.status === 'pending',
                        'bg-green-50 text-green-600 border border-green-200': item.status === 'approved',
                        'bg-red-50 text-red-600 border border-red-200': item.status === 'rejected'
                      }">
                  <lucide-icon [name]="item.status === 'pending' ? 'clock' : (item.status === 'approved' ? 'check' : 'x')" class="w-3 h-3"></lucide-icon>
                  {{ item.status === 'pending' ? 'Bekliyor' : (item.status === 'approved' ? 'Onaylandı' : 'Reddedildi') }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button (click)="openDetail(item)" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-beeses-gold hover:border-beeses-gold rounded-lg text-sm font-bold transition-all shadow-sm">
                  <lucide-icon name="search" class="w-4 h-4"></lucide-icon>
                  İncele
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredWarranties.length === 0">
              <td colspan="9" class="px-6 py-12 text-center text-gray-500">
                <lucide-icon name="search" class="w-8 h-8 mx-auto mb-3 text-gray-300"></lucide-icon>
                <p>Eşleşen kayıt bulunamadı.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50" *ngIf="!isLoading && filteredWarranties.length > 0">
        <span class="text-sm text-gray-600">
          Toplam <strong>{{ filteredWarranties.length }}</strong> kayıttan <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong> - <strong>{{ Math.min(currentPage * pageSize, filteredWarranties.length) }}</strong> arası gösteriliyor
        </span>
        <div class="flex items-center gap-1">
          <button (click)="currentPage = currentPage - 1" [disabled]="currentPage === 1" class="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-beeses-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
            <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
          </button>
          <button *ngFor="let page of getPages()" (click)="currentPage = page" [ngClass]="currentPage === page ? 'bg-beeses-gold text-white border-beeses-gold' : 'border-gray-200 text-gray-600 hover:bg-white'" class="px-3 py-1.5 rounded-lg border text-sm font-bold transition-colors">
            {{ page }}
          </button>
          <button (click)="currentPage = currentPage + 1" [disabled]="currentPage === totalPages()" class="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-beeses-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center">
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Özel Onay Modalı (Toplu işlemler için korundu) -->
    <div *ngIf="showConfirmModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-beeses-dark/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all border border-gray-100">
        <div class="p-8 text-center">
          <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner" 
               [ngClass]="confirmAction === 'approved' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'">
            <lucide-icon [name]="confirmAction === 'approved' ? 'check' : 'x'" class="w-10 h-10"></lucide-icon>
          </div>
          <h3 class="text-2xl font-black text-beeses-dark mb-3 tracking-tight">Emin misiniz?</h3>
          <p class="text-gray-500 text-sm mb-8 leading-relaxed">
            <span *ngIf="!isBulkAction">Bu garanti başvurusunu <strong [ngClass]="confirmAction === 'approved' ? 'text-green-600' : 'text-red-600'">{{ confirmAction === 'approved' ? 'ONAYLAMAK' : 'REDDETMEK' }}</strong> istediğinize emin misiniz?</span>
            <span *ngIf="isBulkAction">Seçilen <strong>{{ getSelectedCount() }}</strong> başvuruyu <strong [ngClass]="confirmAction === 'approved' ? 'text-green-600' : 'text-red-600'">{{ confirmAction === 'approved' ? 'ONAYLAMAK' : 'REDDETMEK' }}</strong> istediğinize emin misiniz?</span>
            <br>Bu işlem durumu değiştirecektir.
          </p>
          
          <div class="flex gap-3">
            <button (click)="closeConfirmModal()" class="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm uppercase tracking-wider">İptal</button>
            <button (click)="executeStatusUpdate()" class="flex-1 py-3.5 px-4 text-white font-bold rounded-xl transition-colors text-sm uppercase tracking-wider shadow-lg" 
                    [ngClass]="confirmAction === 'approved' ? 'bg-green-500 hover:bg-green-600 hover:shadow-green-500/30' : 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/30'">
              Evet, {{ confirmAction === 'approved' ? 'Onayla' : 'Reddet' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detay Modal -->
    <div *ngIf="selectedWarranty" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="shield-check" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            Garanti Detayı
          </h2>
          <button (click)="closeDetail()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-grow space-y-6">
          <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Müşteri Bilgisi</p>
              <p class="text-sm font-bold text-beeses-dark">{{ selectedWarranty.full_name }}</p>
              <p class="text-xs text-gray-500">{{ selectedWarranty.email }}</p>
              <p class="text-xs text-gray-500">{{ selectedWarranty.phone }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tarih</p>
              <p class="text-sm font-medium text-gray-700">{{ selectedWarranty.created_at | date:'dd.MM.yyyy HH:mm' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
               <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ürün Adı</p>
               <p class="text-sm font-bold text-beeses-dark">{{ selectedWarranty.product_name }}</p>
            </div>
            <div>
               <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Seri Numarası</p>
               <p class="text-sm font-mono font-bold text-beeses-gold">{{ selectedWarranty.serial_number }}</p>
            </div>
          </div>

          <div>
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ülke</p>
             <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 leading-relaxed font-bold">
               {{ selectedWarranty.country }}
             </div>
          </div>

          <div>
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fatura</p>
             <a [href]="apiUrl + '/' + selectedWarranty.invoice_path" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-bold transition-colors">
               <lucide-icon name="file-text" class="w-4 h-4"></lucide-icon>
               Faturayı Görüntüle
             </a>
          </div>

          <div *ngIf="selectedWarranty.status !== 'pending'" class="border-t border-gray-100 pt-6">
             <div class="p-4 rounded-xl flex items-start gap-3"
                  [ngClass]="selectedWarranty.status === 'approved' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
               <lucide-icon [name]="selectedWarranty.status === 'approved' ? 'check-circle' : 'x'" 
                            class="w-5 h-5 flex-shrink-0 mt-0.5"
                            [ngClass]="selectedWarranty.status === 'approved' ? 'text-green-500' : 'text-red-500'"></lucide-icon>
               <div>
                 <p class="text-sm font-bold" [ngClass]="selectedWarranty.status === 'approved' ? 'text-green-800' : 'text-red-800'">
                   Bu garanti başvurusu {{ selectedWarranty.status === 'approved' ? 'onaylandı' : 'reddedildi' }}.
                 </p>
               </div>
             </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="closeDetail()" class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold text-sm transition-colors">
            Kapat
          </button>
          
          <ng-container *ngIf="selectedWarranty.status === 'pending'">
            <button (click)="openConfirmModal(selectedWarranty.id, 'rejected')" class="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white font-bold text-sm transition-colors shadow-sm flex items-center gap-2">
              <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
              Reddet
            </button>
            <button (click)="openConfirmModal(selectedWarranty.id, 'approved')" class="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-colors shadow-lg flex items-center gap-2">
              <lucide-icon name="check" class="w-4 h-4"></lucide-icon>
              Onayla
            </button>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class WarrantiesAdminComponent implements OnInit {
  private http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  
  warranties: any[] = [];
  isLoading = true;

  // Filter & Search states
  searchQuery = '';
  searchDateStart = '';
  searchDateEnd = '';
  searchField = 'serial_number';
  filterStatus = 'all';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  Math = Math;

  get paginatedWarranties() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredWarranties.slice(start, start + this.pageSize);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredWarranties.length / this.pageSize));
  }

  get filteredWarranties() {
    return this.warranties.filter(w => {
      if (this.filterStatus !== 'all' && w.status !== this.filterStatus) return false;
      
      if (this.searchField === 'created_at') {
        if (this.searchDateStart || this.searchDateEnd) {
          if (!w.created_at) return false;
          const itemDate = new Date(w.created_at);
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
        let value = '';
        if (this.searchField === 'full_name') {
           value = String(w.full_name || '').toLowerCase();
        } else {
           value = String((w as any)[this.searchField] || '').toLowerCase();
        }
        if (!value.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  }

  toggleAll(event: any) {
    const isChecked = event.target.checked;
    this.filteredWarranties.forEach(w => w.selected = isChecked);
  }

  isAllSelected() {
    if (this.filteredWarranties.length === 0) return false;
    return this.filteredWarranties.every(w => w.selected);
  }

  getSelectedCount() {
    return this.warranties.filter(w => w.selected).length;
  }

  ngOnInit() {
    this.loadWarranties();
  }

  loadWarranties() {
    this.isLoading = true;
    this.http.get(`${this.apiUrl}/warranty/get-warranties.php`).subscribe({
      next: (res: any) => {
        if (res.success) {
          // Add selected property for checkboxes
          this.warranties = res.data.map((w: any) => ({ ...w, selected: false }));
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Veriler çekilirken hata oluştu. XAMPP açık mı?');
      }
    });
  }

  formatDate(dateStr: string) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  showConfirmModal = false;
  confirmAction: 'approved' | 'rejected' | null = null;
  confirmWarrantyId: number | null = null;
  isBulkAction = false;
  selectedWarranty: any = null;

  openDetail(warranty: any) {
    this.selectedWarranty = warranty;
  }

  closeDetail() {
    this.selectedWarranty = null;
  }

  openConfirmModal(id: number, action: 'approved' | 'rejected') {
    this.isBulkAction = false;
    this.confirmWarrantyId = id;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  openBulkConfirmModal(action: 'approved' | 'rejected') {
    this.isBulkAction = true;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.confirmAction = null;
    this.confirmWarrantyId = null;
    this.isBulkAction = false;
  }

  executeStatusUpdate() {
    if (!this.confirmAction) return;

    const status = this.confirmAction;
    let payload: any = { status };

    if (this.isBulkAction) {
      payload.ids = this.warranties.filter(w => w.selected).map(w => w.id);
    } else {
      payload.id = this.confirmWarrantyId;
    }

    this.http.post(`${this.apiUrl}/warranty/update-warranty.php`, payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          if (this.isBulkAction) {
            payload.ids.forEach((id: number) => {
              const item = this.warranties.find(w => w.id === id);
              if (item) { item.status = status; item.selected = false; }
            });
          } else {
            const item = this.warranties.find(w => w.id === this.confirmWarrantyId);
            if (item) item.status = status;
            if (this.selectedWarranty && this.selectedWarranty.id === this.confirmWarrantyId) {
              this.selectedWarranty.status = status;
            }
          }
          this.closeConfirmModal();
        } else {
          alert('Güncelleme hatası: ' + res.message);
          this.closeConfirmModal();
        }
      },
      error: () => {
        alert('Sunucu bağlantı hatası.');
        this.closeConfirmModal();
      }
    });
  }
}
