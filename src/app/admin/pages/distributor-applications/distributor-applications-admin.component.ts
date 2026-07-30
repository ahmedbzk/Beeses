import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DistributorService } from '../../../services/distributor.service';
import { AlertService } from '../../../services/alert.service';
import { environment } from '../../../../environments/environment';

interface DistributorApplication {
  id: number;
  company_name: string;
  contact_email: string;
  group1_info: string;
  group2_info: string;
  group3_info: string;
  file_path: string;
  status: string;
  reply_message?: string;
  created_at: string;
  selected?: boolean;
}

@Component({
  selector: 'app-distributor-applications-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
          <lucide-icon name="briefcase" class="w-5 h-5 text-beeses-gold"></lucide-icon>
          Distribütör Başvuruları
        </h2>
        <div class="flex items-center gap-4 w-full md:w-auto justify-end">
          <button (click)="loadApplications()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      <div class="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white" *ngIf="!isLoading">
        
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <div class="relative w-full lg:w-64">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <lucide-icon name="search" class="w-4 h-4 text-gray-400"></lucide-icon>
            </div>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="currentPage = 1; applyFilters()" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block w-full pl-10 p-2.5 outline-none h-10 transition-colors" placeholder="Firma, e-posta veya telefon ara...">
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <select [(ngModel)]="filterStatus" (ngModelChange)="currentPage = 1; applyFilters()" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none cursor-pointer h-10 min-w-[140px] ml-auto">
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Bekliyor</option>
            <option value="reviewed">İncelendi</option>
            <option value="answered">Cevaplandı</option>
            <option value="rejected">Reddedildi</option>
          </select>
          
          <div *ngIf="hasEditPermission && getSelectedCount() > 0" class="flex items-center gap-2 animate-fade-in pl-0 lg:pl-3 lg:border-l border-gray-200 h-10">
            <span class="text-sm font-bold text-beeses-gold whitespace-nowrap">{{ getSelectedCount() }} Seçili</span>
            <button (click)="executeBulkStatus('reviewed')" class="h-10 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-bold shadow-sm">
              <lucide-icon name="check-square" class="w-4 h-4"></lucide-icon> <span class="hidden sm:inline">İncelendi</span>
            </button>
            <button (click)="executeBulkStatus('pending')" class="h-10 px-3 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-bold shadow-sm">
              <lucide-icon name="clock" class="w-4 h-4"></lucide-icon> <span class="hidden sm:inline">Bekliyor</span>
            </button>
          </div>
        </div>
      </div>

      <div class="p-6 text-center text-gray-500" *ngIf="isLoading">
        <lucide-icon name="loader" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
        <p>Başvurular Yükleniyor...</p>
      </div>

      <div class="overflow-x-auto" *ngIf="!isLoading">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
            <tr>
              <th *ngIf="hasEditPermission" class="px-6 py-5 w-10 text-center rounded-tl-xl">
                <input type="checkbox" (change)="toggleAll($event)" [checked]="isAllSelected()" class="w-4 h-4 rounded border-gray-300 text-beeses-gold focus:ring-beeses-gold cursor-pointer bg-white/10">
              </th>
              <th class="px-6 py-4" [class.rounded-tl-xl]="!hasEditPermission">Tarih</th>
              <th class="px-6 py-4">Firma & İletişim</th>
              <th class="px-6 py-4">Firma & Operasyonel Bilgiler</th>
              <th class="px-6 py-5 text-center" [class.rounded-tr-xl]="!hasEditPermission">Durum</th>
              <th *ngIf="hasEditPermission" class="px-6 py-5 text-center rounded-tr-xl">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr *ngFor="let item of paginatedApplications; let i = index" 
                class="transition-colors hover:bg-beeses-gold/5" 
                [ngClass]="item.selected ? 'bg-beeses-gold/10 border-l-2 border-l-beeses-gold' : (i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40 border-l-2 border-l-transparent')">
              <td *ngIf="hasEditPermission" class="px-6 py-4 text-center">
                <input type="checkbox" [(ngModel)]="item.selected" class="w-4 h-4 rounded border-gray-300 text-beeses-gold focus:ring-beeses-gold cursor-pointer">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <lucide-icon name="calendar" class="w-4 h-4 text-gray-400"></lucide-icon>
                  <span class="text-sm font-medium text-gray-700">{{ item.created_at | date:'dd.MM.yyyy HH:mm' }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-start gap-3">

                  <div>
                    <div class="font-bold text-gray-900 mb-1">{{ item.company_name }}</div>
                    <div class="text-xs text-gray-500 flex flex-col gap-1">
                      <span class="flex items-center gap-1.5"><lucide-icon name="mail" class="w-3 h-3"></lucide-icon> {{ item.contact_email }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-xs text-gray-500 space-y-1">
                  <p class="line-clamp-3">{{ item.group1_info || 'Detay Yok' }}</p>
                </div>
              </td>
              <!-- Tailwind Safelist: bg-yellow-50 text-yellow-600 border border-yellow-200 bg-yellow-500 bg-blue-50 text-blue-600 border-blue-200 bg-blue-500 bg-green-50 text-green-600 border-green-200 bg-green-500 bg-red-50 text-red-600 border-red-200 bg-red-500 -->
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      [ngClass]="{
                        'bg-yellow-50 text-yellow-600 border border-yellow-200': item.status === 'pending',
                        'bg-blue-50 text-blue-600 border border-blue-200': item.status === 'reviewed',
                        'bg-green-50 text-green-600 border border-green-200': item.status === 'answered',
                        'bg-red-50 text-red-600 border border-red-200': item.status === 'rejected'
                      }">
                  <div class="w-1.5 h-1.5 rounded-full"
                       [ngClass]="{
                         'bg-yellow-500': item.status === 'pending',
                         'bg-blue-500': item.status === 'reviewed',
                         'bg-green-500': item.status === 'answered',
                         'bg-red-500': item.status === 'rejected'
                       }"></div>
                  {{ item.status === 'pending' ? 'Bekliyor' : (item.status === 'reviewed' ? 'İncelendi' : (item.status === 'answered' ? 'Cevaplandı' : 'Reddedildi')) }}
                </span>
              </td>
              <td *ngIf="hasEditPermission" class="px-6 py-4 text-center whitespace-nowrap">
                <div class="flex items-center justify-center gap-2">
                  <button (click)="viewDetails(item)" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-beeses-gold hover:border-beeses-gold rounded-lg text-sm font-bold transition-all shadow-sm">
                    <lucide-icon name="search" class="w-4 h-4"></lucide-icon> İncele
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="paginatedApplications.length === 0">
              <td [attr.colspan]="hasEditPermission ? 6 : 4" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <lucide-icon name="inbox" class="w-12 h-12 text-gray-300 mb-3"></lucide-icon>
                  <p class="text-base font-medium">Başvuru bulunamadı</p>
                  <p class="text-xs mt-1 text-gray-400">Arama kriterlerinize uygun sonuç yok veya henüz başvuru yapılmamış.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50" *ngIf="!isLoading && filteredApplications.length > 0">
        <div class="text-sm text-gray-500 font-medium">
          Toplam <span class="font-bold text-beeses-dark">{{ filteredApplications.length }}</span> başvurudan <span class="font-bold text-beeses-dark">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - <span class="font-bold text-beeses-dark">{{ Math.min(currentPage * itemsPerPage, filteredApplications.length) }}</span> arası gösteriliyor
        </div>
        <div class="flex gap-1">
          <button (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1" class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-beeses-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
          </button>
          <button *ngFor="let p of getPages()" (click)="changePage(p)" [ngClass]="{'bg-beeses-gold text-white border-beeses-gold': currentPage === p, 'bg-white text-gray-700': currentPage !== p}" class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 font-medium hover:bg-gray-50 hover:text-beeses-dark transition-colors shadow-sm">
            {{ p }}
          </button>
          <button (click)="changePage(currentPage + 1)" [disabled]="currentPage === totalPages" class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-beeses-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Application Details Modal -->
    <div *ngIf="isModalOpen && selectedApp" class="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="closeModal()"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col animate-fade-in overflow-hidden">
        
        <!-- Modal Header -->
        <div class="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-beeses-gold/10 flex items-center justify-center text-beeses-gold">
              <lucide-icon name="briefcase" class="w-6 h-6"></lucide-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ selectedApp.company_name }}</h3>
              <p class="text-sm text-gray-500 flex items-center gap-2">
                <lucide-icon name="calendar" class="w-3.5 h-3.5"></lucide-icon>
                {{ selectedApp.created_at | date:'dd.MM.yyyy HH:mm' }}
              </p>
            </div>
          </div>
          <button (click)="closeModal()" class="text-gray-400 hover:text-red-500 hover:bg-red-50 w-10 h-10 rounded-xl flex items-center justify-center transition-colors">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <div class="flex flex-col lg:flex-row flex-1 overflow-hidden bg-gray-50/30">
          
          <!-- Left Column: Details -->
          <div class="flex-1 p-8 overflow-y-auto border-r border-gray-100">
            <div class="max-w-3xl space-y-8">
              
              <!-- Contact Info -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <lucide-icon name="mail" class="w-4 h-4"></lucide-icon> İletişim Bilgileri
                </h4>
                <div>
                  <p class="text-sm text-gray-500 mb-1">E-Posta Adresi</p>
                  <a [href]="'mailto:' + selectedApp.contact_email" class="text-lg font-medium text-beeses-gold hover:underline">{{ selectedApp.contact_email }}</a>
                </div>
              </div>

              <!-- Group 1 -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <lucide-icon name="building" class="w-4 h-4"></lucide-icon> Firma ve Operasyonel Bilgiler
                </h4>
                <div class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{{ selectedApp.group1_info || 'Bilgi girilmemiş.' }}</div>
              </div>

              <!-- Group 2 -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" *ngIf="selectedApp.group2_info">
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <lucide-icon name="users" class="w-4 h-4"></lucide-icon> Pazar ve Müşteri
                </h4>
                <div class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{{ selectedApp.group2_info }}</div>
              </div>

              <!-- Group 3 -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" *ngIf="selectedApp.group3_info">
                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <lucide-icon name="trending-up" class="w-4 h-4"></lucide-icon> Pazarlama ve Deneyim
                </h4>
                <div class="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{{ selectedApp.group3_info }}</div>
              </div>

              <!-- Download File -->
              <div *ngIf="selectedApp.file_path" class="bg-gradient-to-r from-beeses-dark to-gray-900 p-6 rounded-2xl shadow-md text-white flex items-center justify-between">
                <div>
                  <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Şirket Profili Dosyası</h4>
                  <p class="text-sm text-gray-300">Başvuru ile birlikte gönderilen sunum/profil belgesi.</p>
                </div>
                <a [href]="getFileUrl(selectedApp.file_path)" target="_blank" class="px-6 py-3 bg-beeses-gold hover:bg-white hover:text-beeses-dark text-white rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-lg flex items-center gap-2 shrink-0">
                  <lucide-icon name="download" class="w-4 h-4"></lucide-icon> İndir
                </a>
              </div>

            </div>
          </div>

          <!-- Right Column: Actions & Logs -->
          <div class="w-full lg:w-96 bg-white flex flex-col shrink-0 overflow-y-auto">
            
            <!-- Action System & Email Reply -->
            <div class="flex-1 bg-gray-50/50 flex flex-col">
              
              <div class="p-6" *ngIf="selectedApp.status !== 'answered'">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <lucide-icon name="mail" class="w-4 h-4"></lucide-icon> Adaya E-Posta Gönder
                </p>
                <textarea [(ngModel)]="replyText" rows="12" class="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all shadow-sm resize-none" placeholder="Enter your message here..."></textarea>
                <p class="text-xs text-beeses-gold/75 mt-3 font-medium">* Gönder'e tıkladığınızda bu mesaj adayın e-posta adresine iletilecek ve başvuru durumu "Cevaplandı" olarak güncellenecektir.</p>
                
                <div class="mt-6 flex flex-col gap-3">
                  <button (click)="sendReply()" [disabled]="!replyText" class="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <lucide-icon name="send" class="w-4 h-4"></lucide-icon> Gönder ve Cevaplandı İşaretle
                  </button>
                  <button (click)="markAsRejected()" class="w-full px-5 py-3 rounded-xl border-2 border-red-100 text-red-600 hover:bg-red-50 font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <lucide-icon name="x" class="w-4 h-4"></lucide-icon> Başvuruyu Reddet
                  </button>
                </div>
              </div>

              <!-- Answered State -->
              <div class="p-6" *ngIf="selectedApp.status === 'answered'">
                 <div class="bg-green-50 border border-green-200 p-4 rounded-xl mb-6 flex items-start gap-3">
                   <lucide-icon name="check-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"></lucide-icon>
                   <div>
                     <p class="text-sm font-bold text-green-800">Başvuru Cevaplandı</p>
                     <p class="text-xs text-green-600 mt-1">Adaya bir cevap e-postası gönderilmiş ve işlem tamamlanmış.</p>
                   </div>
                 </div>
                 
                 <div *ngIf="selectedApp.reply_message">
                   <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gönderilen E-Posta Metni</p>
                   <div class="bg-white p-4 rounded-xl border border-gray-100 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed shadow-sm border-l-4 border-l-green-400">
                     {{ selectedApp.reply_message }}
                   </div>
                 </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>

    <!-- Custom Confirm Modal -->
    <div *ngIf="confirmDialog.isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center transform transition-all">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
             [ngClass]="confirmDialog.type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'">
          <lucide-icon [name]="confirmDialog.type === 'danger' ? 'alert-triangle' : 'send'" class="w-8 h-8"></lucide-icon>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">{{ confirmDialog.title }}</h3>
        <p class="text-sm text-gray-500 mb-6">{{ confirmDialog.message }}</p>
        <div class="flex gap-3 justify-center w-full">
          <button (click)="closeConfirm()" class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
            {{ confirmDialog.cancelText }}
          </button>
          <button (click)="confirmDialog.onConfirm(); closeConfirm()" 
                  class="flex-1 px-4 py-2.5 rounded-xl text-white font-bold text-sm transition-colors shadow-lg"
                  [ngClass]="confirmDialog.type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'">
            {{ confirmDialog.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class DistributorApplicationsAdminComponent implements OnInit {
  Math = Math;
  private distributorService = inject(DistributorService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  
  applications: DistributorApplication[] = [];
  filteredApplications: DistributorApplication[] = [];
  isLoading = true;
  hasEditPermission = false;

  // Search and Filter
  searchQuery = '';
  filterStatus = 'all';

  markAsRejected() {
    if (!this.selectedApp || !this.hasEditPermission) return;
    
    this.showConfirm(
      'Başvuruyu Reddet',
      'Bu distribütör başvurusunu reddetmek istediğinize emin misiniz? (Bu işlem adaya otomatik mail atmaz, sadece statüyü değiştirir)',
      'Evet, Reddet',
      'danger',
      () => {
        this.distributorService.updateApplicationStatus(this.selectedApp.id, 'rejected').subscribe({
          next: (res) => {
            if (res.success) {
              this.alertService.showSuccess('Başvuru reddedildi.');
              const app = this.applications.find(a => a.id === this.selectedApp.id);
              if (app) app.status = 'rejected';
              if (this.selectedApp) this.selectedApp.status = 'rejected';
              this.applyFilters();
              this.closeModal();
            } else {
              this.alertService.showError('Hata: ' + res.message);
            }
          },
          error: () => this.alertService.showError('Bir hata oluştu')
        });
      }
    );
  }

  // Pagination
  currentPage = 1;
  itemsPerPage = 15;

  // Detail Modal
  isModalOpen = false;
  selectedApp: any = null;
  replyText = '';

  // Confirm Modal
  confirmDialog = {
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'İptal',
    type: 'danger' as 'danger' | 'primary',
    onConfirm: () => {}
  };

  showConfirm(title: string, message: string, confirmText: string, type: 'danger'|'primary', onConfirm: () => void) {
    this.confirmDialog = { isOpen: true, title, message, confirmText, cancelText: 'İptal', type, onConfirm };
  }

  closeConfirm() {
    this.confirmDialog.isOpen = false;
  }

  ngOnInit() {
    this.checkPermissions();
    this.loadApplications();
  }

  checkPermissions() {
    try {
      const role = localStorage.getItem('admin_role');
      const permsRaw = localStorage.getItem('admin_permissions') || '{}';
      const perms = JSON.parse(permsRaw);
      
      const hasViewPerm = role === 'superadmin' || !!(perms['distributor_applications'] && perms['distributor_applications'].view === true);
      if (!hasViewPerm) {
        this.router.navigate(['/admin/dashboard']);
        return;
      }
      
      this.hasEditPermission = role === 'superadmin' || !!(perms['distributor_applications'] && perms['distributor_applications'].edit === true);
    } catch (e) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  loadApplications() {
    this.isLoading = true;
    this.distributorService.getApplications().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.applications = res.data.map((item: DistributorApplication) => ({ ...item, selected: false }));
          this.applyFilters();
        } else {
          this.applications = [];
          this.filteredApplications = [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alertService.showError('Başvurular yüklenirken bir hata oluştu');
      }
    });
  }

  applyFilters() {
    let result = [...this.applications];

    if (this.filterStatus !== 'all') {
      result = result.filter(item => item.status === this.filterStatus);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(item => 
        item.company_name.toLowerCase().includes(q) || 
        item.contact_email.toLowerCase().includes(q)
      );
    }

    this.filteredApplications = result;
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedApplications() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredApplications.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredApplications.length / this.itemsPerPage);
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  // Selection
  isAllSelected(): boolean {
    return this.paginatedApplications.length > 0 && this.paginatedApplications.every(c => c.selected);
  }

  toggleAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.paginatedApplications.forEach(c => c.selected = isChecked);
  }

  getSelectedCount(): number {
    return this.applications.filter(c => c.selected).length;
  }

  // Details
  viewDetails(app: any) {
    this.selectedApp = app;
    this.isModalOpen = true;
    
    // Set default english template
    if (app.status !== 'answered' && (!app.reply_message)) {
      this.replyText = `Thank you for your interest in becoming a distributor for Beeses Audio.\nWe have carefully reviewed your application and information you provided.\n\n[PLEASE TYPE YOUR DETAILED RESPONSE HERE]\n\nBest regards,\nBeeses Audio Global Team`;
    } else {
      this.replyText = app.reply_message || '';
    }

    document.body.style.overflow = 'hidden';
    
    // Auto mark as reviewed if pending and has edit permission
    if (app.status === 'pending' && this.hasEditPermission) {
      this.distributorService.updateApplicationStatus(app.id, 'reviewed').subscribe({
        next: (res) => {
          if (res.success) {
            app.status = 'reviewed';
            if (this.selectedApp && this.selectedApp.id === app.id) {
              this.selectedApp.status = 'reviewed';
            }
            this.applyFilters();
          }
        }
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedApp = null;
    this.replyText = '';
    document.body.style.overflow = 'auto';
  }

  sendReply() {
    if (!this.selectedApp || !this.replyText) return;

    this.showConfirm(
      'E-Posta Gönderilsin mi?',
      'Bu mesaj adayın e-posta adresine iletilecek ve başvuru statüsü "Cevaplandı" olarak güncellenecektir. Onaylıyor musunuz?',
      'Evet, Gönder',
      'primary',
      () => {
        this.distributorService.updateApplicationStatus(this.selectedApp.id, 'answered', this.replyText).subscribe({
          next: (res) => {
            if (res.success) {
              this.alertService.showSuccess('Cevap başarıyla e-posta ile gönderildi.');
              const app = this.applications.find(a => a.id === this.selectedApp.id);
              if (app) {
                app.status = 'answered';
                app.reply_message = this.replyText;
              }
              if (this.selectedApp) {
                this.selectedApp.status = 'answered';
                this.selectedApp.reply_message = this.replyText;
              }
              this.applyFilters();
            } else {
              this.alertService.showError('Hata: ' + res.message);
            }
          },
          error: () => this.alertService.showError('Bir hata oluştu.')
        });
      }
    );
  }

  // Actions
  updateStatus(id: number, status: string) {
    if (!this.hasEditPermission) return;

    this.distributorService.updateApplicationStatus(id, status).subscribe({
      next: (res) => {
        if (res.success) {
          const app = this.applications.find(a => a.id === id);
          if (app) app.status = status;
          if (this.selectedApp && this.selectedApp.id === id) {
            this.selectedApp.status = status;
          }
          this.applyFilters();
        } else {
          this.alertService.showError(res.message || 'Durum güncellenemedi');
        }
      },
      error: () => this.alertService.showError('Bir hata oluştu')
    });
  }

  executeBulkStatus(status: string) {
    if (!this.hasEditPermission) return;
    
    const selected = this.applications.filter(c => c.selected);
    if (selected.length === 0) return;

    let processedCount = 0;
    let hasError = false;

    selected.forEach(app => {
      this.distributorService.updateApplicationStatus(app.id, status).subscribe({
        next: (res) => {
          if (res.success) {
            app.status = status;
            app.selected = false;
          } else {
            hasError = true;
          }
          processedCount++;
          if (processedCount === selected.length) {
            if (!hasError) {
              this.alertService.showSuccess(`Seçili başvurular "${status}" olarak işaretlendi`);
            } else {
              this.alertService.showError('Bazı başvurular güncellenirken hata oluştu');
            }
            this.applyFilters();
          }
        },
        error: () => {
          hasError = true;
          processedCount++;
          if (processedCount === selected.length) {
            this.alertService.showError('Bazı başvurular güncellenirken hata oluştu');
            this.applyFilters();
          }
        }
      });
    });
  }

  deleteApplication(id: number) {
    if (!this.hasEditPermission) return;

    if (confirm('Bu başvuruyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz (Dosyası varsa o da silinir).')) {
      this.distributorService.deleteApplication(id).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.applications = this.applications.filter(a => a.id !== id);
            this.applyFilters();
            this.alertService.showSuccess('Başvuru silindi');
          } else {
            this.alertService.showError(res.message || 'Silinemedi');
          }
        },
        error: () => this.alertService.showError('Bir hata oluştu')
      });
    }
  }

  getFileUrl(filePath: string): string {
    return `${environment.apiUrl}/${filePath}`;
  }
}
