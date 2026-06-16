import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DistributorService, Distributor } from '../../../services/distributor.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-distributors-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
          <lucide-icon name="globe" class="w-5 h-5 text-beeses-gold"></lucide-icon>
          Distribütör Yönetimi
        </h2>
        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          <button (click)="loadDistributors()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      <div class="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white" *ngIf="!isLoading">
        
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <select [(ngModel)]="searchField" (change)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none cursor-pointer h-10 min-w-[140px]">
            <option value="company_name">Şirket Adı</option>
            <option value="country">Ülke</option>
            <option value="representative">Temsilci</option>
            <option value="created_at">Kayıt Tarihi</option>
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

        <div class="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <button *ngIf="hasEditPermission" (click)="openAddModal()" class="flex items-center gap-2 px-4 py-2 bg-beeses-gold hover:bg-beeses-dark text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer h-10 w-full lg:w-auto justify-center">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon> Yeni Distribütör Ekle
          </button>
        </div>
      </div>

      <div class="p-6 text-center text-gray-500" *ngIf="isLoading">
        <lucide-icon name="loader" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
        <p>Distribütörler Yükleniyor...</p>
      </div>

      <div class="overflow-x-auto" *ngIf="!isLoading">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
            <tr>
              <th class="px-6 py-4">Kayıt Tarihi</th>
              <th class="px-6 py-4">Ülke</th>
              <th class="px-6 py-4">Şirket Bilgisi</th>
              <th class="px-6 py-4">Temsilci</th>
              <th class="px-6 py-4">İletişim</th>
              <th class="px-6 py-4">Sosyal Medya</th>
              <th *ngIf="hasEditPermission" class="px-6 py-5 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr *ngFor="let item of paginatedDistributors; let i = index" 
                class="transition-colors hover:bg-beeses-gold/5" 
                [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'">
              
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <lucide-icon name="calendar" class="w-4 h-4 text-gray-400"></lucide-icon>
                  <span class="text-sm font-medium text-gray-700">{{ item.created_at | date:'dd.MM.yyyy HH:mm' }}</span>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2.5 py-1 bg-beeses-gold/10 text-beeses-gold text-xs font-bold uppercase rounded">
                  {{ item.country }}
                </span>
              </td>

              <td class="px-6 py-4 max-w-xs">
                <div class="font-bold text-beeses-dark">{{ item.company_name }}</div>
                <div class="text-xs text-gray-400 mt-1 line-clamp-2" [title]="item.address">{{ item.address }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                {{ item.representative || '-' }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col gap-0.5 text-xs text-gray-500">
                  <span class="flex items-center gap-1" *ngIf="item.phone">
                    <lucide-icon name="phone" class="w-3 h-3 text-gray-400"></lucide-icon> {{ item.phone }}
                  </span>
                  <span class="flex items-center gap-1" *ngIf="item.email">
                    <lucide-icon name="mail" class="w-3 h-3 text-gray-400"></lucide-icon> {{ item.email }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span *ngIf="item.website" class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600" title="Web Sitesi">
                    <lucide-icon name="globe" class="w-3.5 h-3.5"></lucide-icon>
                  </span>
                  <span *ngIf="item.instagram" class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600" title="Instagram">
                    <lucide-icon name="instagram" class="w-3.5 h-3.5"></lucide-icon>
                  </span>
                  <span *ngIf="item.facebook" class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600" title="Facebook">
                    <lucide-icon name="facebook" class="w-3.5 h-3.5"></lucide-icon>
                  </span>
                  <span *ngIf="item.youtube" class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600" title="YouTube">
                    <lucide-icon name="youtube" class="w-3.5 h-3.5"></lucide-icon>
                  </span>
                  <span *ngIf="!item.website && !item.instagram && !item.facebook && !item.youtube" class="text-xs text-gray-400">
                    Yok
                  </span>
                </div>
              </td>

              <td *ngIf="hasEditPermission" class="px-6 py-4 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button (click)="openEditModal(item)" class="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-lg transition-colors" title="Düzenle">
                    <lucide-icon name="sliders" class="w-4 h-4"></lucide-icon>
                  </button>
                  <button (click)="confirmDelete(item)" class="p-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Sil">
                    <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="paginatedDistributors.length === 0">
              <td [attr.colspan]="hasEditPermission ? 7 : 6" class="px-6 py-12 text-center text-gray-500">
                <lucide-icon name="search" class="w-8 h-8 mx-auto mb-3 text-gray-300"></lucide-icon>
                <p>Eşleşen kayıt bulunamadı.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50" *ngIf="!isLoading && filteredDistributors.length > 0">
        <span class="text-sm text-gray-600">
          Toplam <strong>{{ filteredDistributors.length }}</strong> kayıttan <strong>{{ getStartRange() }}</strong> - <strong>{{ getEndRange() }}</strong> arası gösteriliyor
        </span>
        <div class="flex items-center gap-1">
          <button (click)="currentPage = currentPage - 1" [disabled]="currentPage === 1" class="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-beeses-gold transition-colors">
            <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
          </button>
          <button *ngFor="let page of getPages()" (click)="currentPage = page" [ngClass]="currentPage === page ? 'bg-beeses-gold text-white border-beeses-gold' : 'border-gray-200 text-gray-600 hover:bg-white'" class="px-3 py-1.5 rounded-lg border text-sm font-bold transition-colors">
            {{ page }}
          </button>
          <button (click)="currentPage = currentPage + 1" [disabled]="currentPage === totalPages()" class="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-beeses-gold transition-colors">
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="globe" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            {{ editingItem ? 'Distribütör Bilgilerini Düzenle' : 'Yeni Distribütör Ekle' }}
          </h2>
          <button (click)="closeModal()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-grow space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ülke *</label>
              <input type="text" [(ngModel)]="formData.country" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Örn: Amerika">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Şirket Adı *</label>
              <input type="text" [(ngModel)]="formData.company_name" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Örn: Premium Sound LLC">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Temsilci (Yetkili Kişi)</label>
              <input type="text" [(ngModel)]="formData.representative" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Örn: Mr. John Doe">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Telefon</label>
              <input type="text" [(ngModel)]="formData.phone" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Örn: +1 213 555 0199">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">E-Posta</label>
              <input type="email" [(ngModel)]="formData.email" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Örn: info@company.com">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Web Sitesi</label>
              <input type="text" [(ngModel)]="formData.website" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Örn: https://www.company.com">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Adres</label>
            <textarea [(ngModel)]="formData.address" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Şirket adresini detaylı yazın..."></textarea>
          </div>

          <div class="border-t border-gray-100 pt-4">
            <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Sosyal Medya Linkleri</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Instagram</label>
                <input type="text" [(ngModel)]="formData.instagram" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="https://instagram.com/...">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Facebook</label>
                <input type="text" [(ngModel)]="formData.facebook" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="https://facebook.com/...">
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">YouTube</label>
                <input type="text" [(ngModel)]="formData.youtube" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="https://youtube.com/...">
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="closeModal()" class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold text-sm transition-colors">
            İptal
          </button>
          
          <button (click)="saveDistributor()" [disabled]="!formData.country || !formData.company_name" class="px-5 py-2.5 rounded-xl bg-beeses-gold hover:bg-beeses-dark text-white font-bold text-sm transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            Kaydet
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="showConfirmModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform scale-100 transition-all duration-300">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-md font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="check" class="w-5 h-5 text-beeses-gold" [class.text-red-500]="confirmModalType === 'danger'"></lucide-icon>
            {{ confirmModalTitle }}
          </h2>
          <button (click)="showConfirmModal = false" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white">
            <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
          </button>
        </div>

        <div class="p-6 text-sm text-gray-600 font-medium">
          {{ confirmModalMessage }}
        </div>

        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="showConfirmModal = false" class="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold text-xs transition-colors">
            İptal
          </button>
          
          <button (click)="executeConfirm()" 
                  [ngClass]="confirmModalType === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-beeses-gold hover:bg-beeses-dark'"
                  class="px-4 py-2 rounded-xl text-white font-bold text-xs transition-colors shadow-md">
            Evet, Onayla
          </button>
        </div>
      </div>
    </div>
  `
})
export class DistributorsAdminComponent implements OnInit {
  private distributorService = inject(DistributorService);
  private alertService = inject(AlertService);

  distributors: Distributor[] = [];
  isLoading = true;

  searchQuery = '';
  searchDateStart = '';
  searchDateEnd = '';
  searchField = 'company_name';

  currentPage = 1;
  pageSize = 10;
  Math = Math;

  showModal = false;
  editingItem: Distributor | null = null;
  formData: Partial<Distributor> = {};

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

  get paginatedDistributors() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredDistributors.slice(start, start + this.pageSize);
  }

  getStartRange(): number {
    if (this.filteredDistributors.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  getEndRange(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredDistributors.length);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredDistributors.length / this.pageSize));
  }

  get filteredDistributors() {
    return this.distributors.filter(d => {
      if (this.searchField === 'created_at') {
        if (this.searchDateStart || this.searchDateEnd) {
          if (!d.created_at) return false;
          const itemDate = new Date(d.created_at);
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
        const value = String((d as any)[this.searchField] || '').toLowerCase();
        if (!value.includes(query)) return false;
      }
      return true;
    });
  }

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
          this.hasEditPermission = !!(perms['distributors'] && perms['distributors'].edit === true);
        } catch (e) {
          this.hasEditPermission = false;
        }
      }
    }
    this.loadDistributors();
  }

  loadDistributors() {
    this.isLoading = true;
    this.distributorService.getDistributors().subscribe({
      next: (res) => {
        if (res.success) {
          this.distributors = res.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alertService.showError('Distribütörler yüklenirken hata oluştu.');
      }
    });
  }

  openAddModal() {
    this.editingItem = null;
    this.formData = {
      country: '',
      company_name: '',
      representative: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      instagram: '',
      facebook: '',
      youtube: ''
    };
    this.showModal = true;
  }

  openEditModal(item: Distributor) {
    this.editingItem = item;
    this.formData = { ...item };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingItem = null;
    this.formData = {};
  }

  saveDistributor() {
    if (!this.formData.country || !this.formData.company_name) return;

    const isEdit = !!(this.editingItem && this.editingItem.id);
    const title = isEdit ? 'Güncellemeyi Onayla' : 'Yeni Distribütör Ekle';
    const message = isEdit 
      ? `${this.formData.company_name} distribütörünün bilgilerini güncellemek istediğinize emin misiniz?` 
      : 'Yeni distribütör kaydını onaylıyor musunuz?';

    this.triggerConfirm(title, message, () => {
      this.executeSave();
    }, 'save');
  }

  executeSave() {
    if (this.editingItem && this.editingItem.id) {
      this.distributorService.updateDistributor(this.formData as Distributor).subscribe({
        next: (res) => {
          if (res.success) {
            this.alertService.showSuccess('Distribütör başarıyla güncellendi.');
            this.loadDistributors();
            this.closeModal();
          } else {
            this.alertService.showError(res.message || 'Güncelleme hatası.');
          }
        },
        error: () => this.alertService.showError('Güncellenirken bir hata oluştu.')
      });
    } else {
      this.distributorService.addDistributor(this.formData as Distributor).subscribe({
        next: (res) => {
          if (res.success) {
            this.alertService.showSuccess('Distribütör başarıyla eklendi.');
            this.loadDistributors();
            this.closeModal();
          } else {
            this.alertService.showError(res.message || 'Ekleme hatası.');
          }
        },
        error: () => this.alertService.showError('Eklenirken bir hata oluştu.')
      });
    }
  }

  confirmDelete(item: Distributor) {
    if (!item.id) return;
    this.triggerConfirm(
      'Silme İşlemini Onayla',
      `${item.company_name} distribütörünü silmek istediğinize emin misiniz?`,
      () => {
        this.distributorService.deleteDistributor(item.id!).subscribe({
          next: (res) => {
            if (res.success) {
              this.alertService.showSuccess('Distribütör silindi.');
              this.loadDistributors();
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
}
