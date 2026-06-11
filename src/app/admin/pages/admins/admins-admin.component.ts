import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { AdminService, Admin, AdminLog } from '../../../services/admin.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-admins-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
          <lucide-icon name="users" class="w-5 h-5 text-beeses-gold"></lucide-icon>
          Sistem Yetkilendirme ve İşlem Logları
        </h2>
        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          <button (click)="refresh()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap cursor-pointer">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-100 bg-white px-6">
        <button (click)="activeTab = 'admins'" 
                [class]="'flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-bold transition-all cursor-pointer ' + 
                         (activeTab === 'admins' ? 'border-beeses-gold text-beeses-gold' : 'border-transparent text-gray-500 hover:text-gray-700')">
          <lucide-icon name="shield" class="w-4 h-4"></lucide-icon>
          Yöneticiler
        </button>
        <button *ngIf="adminRole === 'superadmin'" (click)="activeTab = 'logs'" 
                [class]="'flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-bold transition-all cursor-pointer ' + 
                         (activeTab === 'logs' ? 'border-beeses-gold text-beeses-gold' : 'border-transparent text-gray-500 hover:text-gray-700')">
          <lucide-icon name="file-text" class="w-4 h-4"></lucide-icon>
          İşlem Logları
        </button>
      </div>

      <!-- ADMIIN LIST SECTION -->
      <div *ngIf="activeTab === 'admins'">
        <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white" *ngIf="!isLoading">
          <div class="text-sm text-gray-500">
            Sistemde kayıtlı yöneticileri ve erişim yetkilerini buradan düzenleyebilirsiniz.
          </div>
          <button (click)="openAddModal()" class="flex items-center gap-2 px-4 py-2 bg-beeses-gold hover:bg-beeses-dark text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer h-10 w-full sm:w-auto justify-center">
            <lucide-icon name="plus" class="w-4 h-4"></lucide-icon> Yeni Yönetici Ekle
          </button>
        </div>

        <div class="p-6 text-center text-gray-500" *ngIf="isLoading">
          <lucide-icon name="refresh-cw" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
          <p>Yöneticiler Yükleniyor...</p>
        </div>

        <div class="overflow-x-auto" *ngIf="!isLoading">
          <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
              <tr>
                <th class="px-6 py-4 w-16 text-center">ID</th>
                <th class="px-6 py-4">Kullanıcı Adı</th>
                <th class="px-6 py-4">Erişim İzinleri</th>
                <th class="px-6 py-4">Kayıt Tarihi</th>
                <th class="px-6 py-5 text-center w-28 rounded-tr-xl">İşlem</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr *ngFor="let item of admins; let i = index" 
                  class="transition-colors hover:bg-beeses-gold/5" 
                  [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'">
                
                <td class="px-6 py-4 text-center font-semibold text-beeses-dark">{{ i + 1 }}</td>
                <td class="px-6 py-4 font-semibold text-beeses-dark">{{ item.username }}</td>
                <td class="px-6 py-4 text-xs max-w-md">
                  <div class="flex flex-wrap gap-1.5">
                    <span *ngFor="let p of getPermList(item.permissions)" 
                          class="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-md">
                      {{ p.name }} ({{ p.modes }})
                    </span>
                    <span *ngIf="getPermList(item.permissions).length === 0" class="text-red-500 italic">Erişim yetkisi yok</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-500">{{ item.created_at | date:'dd.MM.yyyy HH:mm' }}</td>
                <td class="px-6 py-4 text-center whitespace-nowrap">
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
            </tbody>
          </table>
        </div>
      </div>

      <!-- ACTION LOGS SECTION -->
      <div *ngIf="activeTab === 'logs'">
        <!-- Filter Bar -->
        <div class="border-b border-gray-100 bg-white" *ngIf="!isLoading">
          <!-- Row 1: Search + Admin + Dates -->
          <div class="p-4 flex flex-wrap items-center gap-3">
            <!-- Text Search -->
            <div class="relative flex-grow min-w-[200px] max-w-xs">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <lucide-icon name="search" class="w-4 h-4 text-gray-400"></lucide-icon>
              </div>
              <input type="text" [(ngModel)]="searchQuery" (input)="onFilterChange()" 
                class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-beeses-gold focus:border-beeses-gold block w-full pl-10 pr-4 py-2.5 outline-none transition-colors" 
                placeholder="Detay veya anahtar kelime...">
            </div>

            <!-- Admin Username Dropdown -->
            <div class="relative">
              <select [(ngModel)]="filterUsername" (change)="onFilterChange()"
                class="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 pr-8 outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-colors cursor-pointer">
                <option value="">Tüm Adminler</option>
                <option *ngFor="let u of uniqueUsernames" [value]="u">{{ u }}</option>
              </select>
              <lucide-icon name="chevron-down" class="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"></lucide-icon>
            </div>

            <!-- Date From -->
            <div class="relative">
              <input type="date" [(ngModel)]="filterDateFrom" (change)="onFilterChange()"
                class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-colors cursor-pointer"
                title="Başlangıç Tarihi">
            </div>

            <!-- Date To -->
            <div class="relative">
              <input type="date" [(ngModel)]="filterDateTo" (change)="onFilterChange()"
                class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-colors cursor-pointer"
                title="Bitiş Tarihi">
            </div>

            <!-- Active Filter Badge + Clear -->
            <div class="flex items-center gap-2 ml-auto">
              <span *ngIf="activeFilterCount > 0" class="inline-flex items-center gap-1 px-2.5 py-1 bg-beeses-gold/10 text-beeses-gold border border-beeses-gold/30 rounded-full text-xs font-bold">
                <lucide-icon name="sliders" class="w-3 h-3"></lucide-icon>
                {{ activeFilterCount }} filtre aktif
              </span>
              <button *ngIf="activeFilterCount > 0" (click)="clearFilters()" 
                class="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer">
                <lucide-icon name="x" class="w-3.5 h-3.5"></lucide-icon>
                Temizle
              </button>
              <span class="text-xs text-gray-400 border-l border-gray-200 pl-3 whitespace-nowrap">
                Son 500 kayıt
              </span>
            </div>
          </div>

          <!-- Row 2: Action Type Chips -->
          <div class="px-4 pb-3 flex flex-wrap gap-2">
            <button *ngFor="let a of actionTypes" (click)="toggleActionFilter(a.value)" 
              [ngClass]="filterActions.includes(a.value) ? a.activeClass : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer">
              <span [ngClass]="filterActions.includes(a.value) ? a.dotActive : a.dotInactive" class="w-1.5 h-1.5 rounded-full"></span>
              {{ a.label }}
              <span *ngIf="getActionCount(a.value) > 0" class="ml-1 opacity-70">({{ getActionCount(a.value) }})</span>
            </button>
          </div>
        </div>

        <div class="p-10 text-center text-gray-400" *ngIf="isLoading">
          <lucide-icon name="refresh-cw" class="w-10 h-10 animate-spin mx-auto mb-3 text-beeses-gold"></lucide-icon>
          <p class="text-sm font-medium">İşlem Logları Yükleniyor...</p>
        </div>

        <div *ngIf="!isLoading">
          <!-- Log Rows -->
          <div class="divide-y divide-gray-100">
            <div *ngFor="let item of paginatedLogs; let i = index" 
                 class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-5 py-3.5 transition-colors hover:bg-beeses-gold/5"
                 [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'">
              
              <!-- Action Badge -->
              <div class="flex items-center gap-3 sm:w-28 shrink-0">
                <span [ngClass]="getActionBadgeClass(item.action)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">
                  <span [ngClass]="getActionDotClass(item.action)" class="w-1.5 h-1.5 rounded-full"></span>
                  {{ item.action }}
                </span>
              </div>

              <!-- Page / Module -->
              <div class="sm:w-36 shrink-0">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-md text-xs font-medium">
                  <lucide-icon name="layers" class="w-3 h-3 text-gray-400"></lucide-icon>
                  {{ getPageLabel(item.page) }}
                </span>
              </div>

              <!-- User -->
              <div class="sm:w-28 shrink-0 flex items-center gap-1.5">
                <div class="w-5 h-5 rounded-full bg-beeses-gold/20 flex items-center justify-center text-beeses-dark font-black text-[9px] shrink-0">{{ item.username.charAt(0).toUpperCase() }}</div>
                <span class="text-sm font-semibold text-beeses-dark truncate">{{ item.username }}</span>
              </div>

              <!-- Details -->
              <div class="flex-grow text-sm text-gray-600 truncate" [title]="item.details">{{ item.details }}</div>

              <!-- Date -->
              <div class="sm:w-36 shrink-0 text-right">
                <span class="text-xs text-gray-400 whitespace-nowrap">{{ item.created_at | date:'dd.MM.yyyy' }}</span>
                <span class="text-xs font-semibold text-gray-500 ml-1 whitespace-nowrap">{{ item.created_at | date:'HH:mm:ss' }}</span>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="paginatedLogs.length === 0" class="py-16 text-center text-gray-400">
              <lucide-icon name="search" class="w-10 h-10 mx-auto mb-3 text-gray-200"></lucide-icon>
              <p class="font-medium">Eşleşen kayıt bulunamadı.</p>
              <p class="text-xs mt-1">Farklı bir arama terimi deneyin.</p>
            </div>
          </div>

          <!-- Pagination -->
          <div class="px-5 py-3.5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/80" *ngIf="filteredLogs.length > 0">
            <span class="text-xs text-gray-500">
              Toplam <strong class="text-beeses-dark">{{ filteredLogs.length }}</strong> kayıttan 
              <strong class="text-beeses-dark">{{ getStartRange() }}</strong>–<strong class="text-beeses-dark">{{ getEndRange() }}</strong> arası
            </span>
            <div class="flex items-center gap-1">
              <!-- First Page -->
              <button (click)="currentPage = 1" [disabled]="currentPage === 1" 
                class="px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-beeses-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center"
                title="İlk Sayfa">
                <lucide-icon name="chevrons-left" class="w-4 h-4"></lucide-icon>
              </button>
              <!-- Prev -->
              <button (click)="currentPage = currentPage - 1" [disabled]="currentPage === 1" 
                class="px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-beeses-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center">
                <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
              </button>

              <!-- Smart Page Numbers -->
              <ng-container *ngFor="let page of getSmartPages()">
                <button *ngIf="page !== -1" (click)="currentPage = page"
                  [ngClass]="currentPage === page ? 'bg-beeses-gold text-white border-beeses-gold shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-white hover:text-beeses-gold'"
                  class="min-w-[34px] px-2.5 py-1.5 rounded-lg border text-sm font-bold transition-colors cursor-pointer">
                  {{ page }}
                </button>
                <span *ngIf="page === -1" class="px-1 py-1.5 text-gray-400 text-sm font-bold">…</span>
              </ng-container>

              <!-- Next -->
              <button (click)="currentPage = currentPage + 1" [disabled]="currentPage === totalPages()" 
                class="px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-beeses-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center">
                <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
              </button>
              <!-- Last Page -->
              <button (click)="currentPage = totalPages()" [disabled]="currentPage === totalPages()" 
                class="px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:text-beeses-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center"
                title="Son Sayfa">
                <lucide-icon name="chevrons-right" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL FOR ADD/EDIT ADMIN -->
    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="user" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            {{ editingItem ? 'Yönetici Güncelle' : 'Yeni Yönetici Ekle' }}
          </h2>
          <button (click)="closeModal()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white cursor-pointer">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-grow space-y-6">
          <!-- Credentials Section -->
          <div>
            <h3 class="text-sm font-bold text-beeses-dark border-b border-gray-100 pb-2 mb-4">Yönetici Bilgileri</h3>
            <div [ngClass]="editingItem ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kullanıcı Adı *</label>
                <input type="text" [(ngModel)]="formData.username" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Yönetici kullanıcı adı">
              </div>
              <div *ngIf="!editingItem">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Şifre *</label>
                <input type="password" [(ngModel)]="formData.password" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="••••••">
              </div>
            </div>
          </div>

          <!-- Permissions Checklist -->
          <div class="space-y-3">
            <h3 class="text-sm font-bold text-beeses-dark border-b border-gray-100 pb-2 mb-3">Sayfa Erişim Yetkileri</h3>
            
            <div class="border border-gray-150 rounded-xl overflow-hidden divide-y divide-gray-100 shadow-sm">
              <!-- Grid Header -->
              <div class="grid grid-cols-3 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-500 uppercase">
                <div>Başlık / Modül</div>
                <div>Görüntüleme</div>
                <div>İşlem / Güncelleme</div>
              </div>

              <!-- Module Rows -->
              <div *ngFor="let mod of modules" class="grid grid-cols-3 px-4 py-3 text-sm items-center hover:bg-gray-50/50">
                <div class="font-semibold text-beeses-dark">{{ mod.label }}</div>
                <div class="text-center">
                  <input type="checkbox" [(ngModel)]="formData.permissions[mod.key].view" (change)="onViewChange(mod.key)" class="w-4 h-4 rounded text-beeses-gold focus:ring-beeses-gold cursor-pointer">
                </div>
                <div class="text-center">
                  <input type="checkbox" [(ngModel)]="formData.permissions[mod.key].edit" [disabled]="!formData.permissions[mod.key].view" class="w-4 h-4 rounded text-beeses-gold focus:ring-beeses-gold cursor-pointer">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="closeModal()" class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold transition-all cursor-pointer">
            İptal
          </button>
          <button (click)="saveAdmin()" [disabled]="isSaving" class="px-6 py-2 bg-beeses-gold hover:bg-beeses-dark disabled:bg-gray-300 text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2">
            <span *ngIf="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  `
})
export class AdminsAdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  activeTab = 'admins';
  admins: Admin[] = [];
  logs: AdminLog[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;
  editingItem: Admin | null = null;
  adminRole = 'admin';

  searchQuery = '';
  filterUsername = '';
  filterActions: string[] = [];
  filterDateFrom = '';
  filterDateTo = '';
  currentPage = 1;
  itemsPerPage = 15;

  actionTypes = [
    { value: 'Giriş',      label: 'Giriş',      activeClass: 'bg-green-50 text-green-700 border-green-300',  dotActive: 'bg-green-500', dotInactive: 'bg-gray-400' },
    { value: 'Ekleme',     label: 'Ekleme',     activeClass: 'bg-blue-50 text-blue-700 border-blue-300',    dotActive: 'bg-blue-500',  dotInactive: 'bg-gray-400' },
    { value: 'Güncelleme', label: 'Güncelleme', activeClass: 'bg-amber-50 text-amber-700 border-amber-300', dotActive: 'bg-amber-500', dotInactive: 'bg-gray-400' },
    { value: 'Silme',      label: 'Silme',      activeClass: 'bg-red-50 text-red-700 border-red-300',       dotActive: 'bg-red-500',   dotInactive: 'bg-gray-400' },
  ];

  modules = [
    { key: 'products', label: 'Ürün Kataloğu' },
    { key: 'news', label: 'Haber Yönetimi' },
    { key: 'certificates', label: 'Sertifikalar' },
    { key: 'faq', label: 'Sıkça Sorulan Sorular' },
    { key: 'contacts', label: 'İletişim Formları' },
    { key: 'warranties', label: 'Garanti Kayıtları' },
    { key: 'distributors', label: 'Distribütör Listesi' },
    { key: 'innovations', label: 'İnovasyon & Gelecek' },
    { key: 'newsletter', label: 'Aboneler & Bülten' },
    { key: 'admins', label: 'Yönetici Yetkilendirme' }
  ];

  formData = {
    username: '',
    password: '',
    role: 'admin',
    permissions: this.createEmptyPermissions()
  };

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.adminRole = localStorage.getItem('admin_role') || 'admin';
      const permsRaw = localStorage.getItem('admin_permissions') || '{}';
      try {
        const perms = JSON.parse(permsRaw);
        const hasAdminsPerm = this.adminRole === 'superadmin' || !!(perms['admins'] && perms['admins'].view === true);
        if (!hasAdminsPerm) {
          this.router.navigate(['/admin/dashboard']);
          return;
        }
      } catch (e) {
        this.router.navigate(['/admin/dashboard']);
        return;
      }
    }
    this.refresh();
  }

  refresh() {
    this.isLoading = true;
    if (this.activeTab === 'admins') {
      this.loadAdmins();
    } else {
      this.loadLogs();
    }
  }

  loadAdmins() {
    this.adminService.getAdmins().subscribe({
      next: (res) => {
        if (res.success) {
          this.admins = (res.data || []).filter((a: any) => a.role !== 'superadmin' && a.username !== 'admin');
        } else {
          this.alertService.showError('Yöneticiler yüklenirken hata oluştu.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.alertService.showError('Sunucu bağlantı hatası.');
        this.isLoading = false;
      }
    });
  }

  loadLogs() {
    this.adminService.getLogs().subscribe({
      next: (res) => {
        if (res.success) {
          this.logs = res.data;
        } else {
          this.alertService.showError('Sistem logları yüklenirken hata oluştu.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.alertService.showError('Sunucu bağlantı hatası.');
        this.isLoading = false;
      }
    });
  }

  createEmptyPermissions() {
    const perms: any = {};
    for (const mod of this.modules) {
      perms[mod.key] = { view: false, edit: false };
    }
    return perms;
  }

  onViewChange(key: string) {
    // If view is disabled, edit must be disabled too
    if (!this.formData.permissions[key].view) {
      this.formData.permissions[key].edit = false;
    }
  }

  getPermList(permissions: any): { name: string, modes: string }[] {
    const list: { name: string, modes: string }[] = [];
    if (!permissions) return list;
    
    for (const mod of this.modules) {
      if (permissions[mod.key] && permissions[mod.key].view === true) {
        const edit = permissions[mod.key].edit === true;
        list.push({
          name: mod.label,
          modes: edit ? 'Oku & Yaz' : 'Yalnız Oku'
        });
      }
    }
    return list;
  }

  getPageLabel(pageKey: string): string {
    if (pageKey === 'dashboard') return 'Ana Sayfa';
    if (pageKey === 'auth') return 'Giriş / Çıkış';
    
    const mod = this.modules.find(m => m.key === pageKey);
    return mod ? mod.label : pageKey;
  }

  getActionClass(action: string): string {
    if (action === 'Giriş') return 'text-green-600';
    if (action === 'Ekleme') return 'text-blue-600';
    if (action === 'Güncelleme') return 'text-amber-600';
    if (action === 'Silme') return 'text-red-600';
    return 'text-gray-600';
  }

  getActionBadgeClass(action: string): string {
    if (action === 'Giriş') return 'bg-green-50 text-green-700 border border-green-200';
    if (action === 'Ekleme') return 'bg-blue-50 text-blue-700 border border-blue-200';
    if (action === 'Güncelleme') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (action === 'Silme') return 'bg-red-50 text-red-700 border border-red-200';
    return 'bg-gray-100 text-gray-600 border border-gray-200';
  }

  getActionDotClass(action: string): string {
    if (action === 'Giriş') return 'bg-green-500';
    if (action === 'Ekleme') return 'bg-blue-500';
    if (action === 'Güncelleme') return 'bg-amber-500';
    if (action === 'Silme') return 'bg-red-500';
    return 'bg-gray-400';
  }

  get uniqueUsernames(): string[] {
    const names = [...new Set(this.logs.map(l => l.username))].sort();
    return names;
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.filterUsername) count++;
    if (this.filterActions.length > 0) count++;
    if (this.filterDateFrom) count++;
    if (this.filterDateTo) count++;
    return count;
  }

  toggleActionFilter(action: string) {
    const idx = this.filterActions.indexOf(action);
    if (idx === -1) {
      this.filterActions = [...this.filterActions, action];
    } else {
      this.filterActions = this.filterActions.filter(a => a !== action);
    }
    this.currentPage = 1;
  }

  getActionCount(action: string): number {
    return this.logs.filter(l => l.action === action).length;
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterUsername = '';
    this.filterActions = [];
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.currentPage = 1;
  }

  get filteredLogs(): AdminLog[] {
    return this.logs.filter(log => {
      // Text search
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase().trim();
        const matchText = log.username.toLowerCase().includes(q) ||
          log.page.toLowerCase().includes(q) ||
          this.getPageLabel(log.page).toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          (log.details && log.details.toLowerCase().includes(q));
        if (!matchText) return false;
      }
      // Username filter
      if (this.filterUsername && log.username !== this.filterUsername) return false;
      // Action type filter
      if (this.filterActions.length > 0 && !this.filterActions.includes(log.action)) return false;
      // Date from
      if (this.filterDateFrom) {
        const logDate = new Date(log.created_at);
        const from = new Date(this.filterDateFrom);
        from.setHours(0, 0, 0, 0);
        if (logDate < from) return false;
      }
      // Date to
      if (this.filterDateTo) {
        const logDate = new Date(log.created_at);
        const to = new Date(this.filterDateTo);
        to.setHours(23, 59, 59, 999);
        if (logDate > to) return false;
      }
      return true;
    });
  }

  get paginatedLogs(): AdminLog[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLogs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getStartRange(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndRange(): number {
    const end = this.currentPage * this.itemsPerPage;
    const total = this.filteredLogs.length;
    return end > total ? total : end;
  }

  totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  getSmartPages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage;
    const delta = 2; // pages around current
    const pages: number[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (current - delta > 2) pages.push(-1); // ellipsis

    const start = Math.max(2, current - delta);
    const end = Math.min(total - 1, current + delta);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current + delta < total - 1) pages.push(-1); // ellipsis
    pages.push(total);

    return pages;
  }

  openAddModal() {
    this.editingItem = null;
    this.formData = {
      username: '',
      password: '',
      role: 'admin',
      permissions: this.createEmptyPermissions()
    };
    this.showModal = true;
  }

  openEditModal(item: Admin) {
    this.editingItem = item;
    
    // Copy existing permissions, fill default values if any are missing
    const perms = this.createEmptyPermissions();
    if (item.permissions && typeof item.permissions === 'object') {
      for (const mod of this.modules) {
        if (item.permissions[mod.key]) {
          perms[mod.key] = {
            view: !!item.permissions[mod.key].view,
            edit: !!item.permissions[mod.key].edit
          };
        }
      }
    }

    this.formData = {
      username: item.username,
      password: '',
      role: 'admin',
      permissions: perms
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingItem = null;
  }

  saveAdmin() {
    if (!this.formData.username.trim()) {
      this.alertService.showError('Kullanıcı adı boş olamaz.');
      return;
    }

    if (!this.editingItem && !this.formData.password) {
      this.alertService.showError('Yeni yönetici için şifre gereklidir.');
      return;
    }

    this.isSaving = true;

    const payload: Admin = {
      username: this.formData.username,
      role: 'admin',
      permissions: this.formData.permissions
    };

    if (this.formData.password) {
      payload.password = this.formData.password;
    }

    if (this.editingItem) {
      payload.id = this.editingItem.id;
      this.adminService.updateAdmin(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.alertService.showSuccess('Yönetici başarıyla güncellendi.');
            this.loadAdmins();
            this.closeModal();
          } else {
            this.alertService.showError(res.message || 'Hata oluştu.');
          }
          this.isSaving = false;
        },
        error: () => {
          this.alertService.showError('Sunucu hatası oluştu.');
          this.isSaving = false;
        }
      });
    } else {
      this.adminService.addAdmin(payload).subscribe({
        next: (res) => {
          if (res.success) {
            this.alertService.showSuccess('Yönetici başarıyla eklendi.');
            this.loadAdmins();
            this.closeModal();
          } else {
            this.alertService.showError(res.message || 'Hata oluştu.');
          }
          this.isSaving = false;
        },
        error: () => {
          this.alertService.showError('Sunucu hatası oluştu.');
          this.isSaving = false;
        }
      });
    }
  }

  confirmDelete(item: Admin) {
    if (confirm(`"${item.username}" adlı yöneticiyi silmek istediğinize emin misiniz?`)) {
      this.adminService.deleteAdmin(item.id!).subscribe({
        next: (res) => {
          if (res.success) {
            this.alertService.showSuccess('Yönetici başarıyla silindi.');
            this.loadAdmins();
          } else {
            this.alertService.showError(res.message || 'Hata oluştu.');
          }
        },
        error: () => {
          this.alertService.showError('Sunucu hatası oluştu.');
        }
      });
    }
  }
}
