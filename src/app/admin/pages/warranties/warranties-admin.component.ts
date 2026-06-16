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
          Garanti Kayıtları
        </h2>
        <div class="flex items-center gap-4 w-full md:w-auto justify-end">
          <button (click)="loadWarranties()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      <div class="flex border-b border-gray-100 bg-gray-50/50">
        <button (click)="switchTab('applications')" 
                 [ngClass]="activeTab === 'applications' ? 'border-beeses-gold text-beeses-gold bg-white' : 'border-transparent text-gray-500 hover:text-beeses-dark hover:bg-gray-50/20'"
                 class="flex-1 md:flex-initial px-6 py-4 border-b-2 font-bold text-sm transition-all flex items-center justify-center gap-2 outline-none cursor-pointer">
          <lucide-icon name="layers" class="w-4 h-4"></lucide-icon>
          Garanti Başvuruları
        </button>
        <button (click)="switchTab('status')" 
                 [ngClass]="activeTab === 'status' ? 'border-beeses-gold text-beeses-gold bg-white' : 'border-transparent text-gray-500 hover:text-beeses-dark hover:bg-gray-50/20'"
                 class="flex-1 md:flex-initial px-6 py-4 border-b-2 font-bold text-sm transition-all flex items-center justify-center gap-2 outline-none cursor-pointer">
          <lucide-icon name="shield-check" class="w-4 h-4"></lucide-icon>
          Garanti Durumu (Aktif/Pasif)
        </button>
      </div>

      <div class="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white" *ngIf="!isLoading">
        
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

        <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <select [(ngModel)]="filterStatus" (change)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none cursor-pointer h-10 min-w-[160px] ml-auto">
            <ng-container *ngIf="activeTab === 'applications'">
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Bekleyenler</option>
              <option value="rejected">Reddedilenler</option>
            </ng-container>
            <ng-container *ngIf="activeTab === 'status'">
              <option value="all">Tüm Durumlar</option>
              <option value="approved_active">Aktif Garantiler</option>
              <option value="approved_passive">Süresi Dolanlar (Pasif)</option>
            </ng-container>
          </select>
          
          <div *ngIf="hasEditPermission && activeTab === 'applications' && getSelectedCount() > 0" class="flex items-center gap-2 animate-fade-in pl-0 lg:pl-3 lg:border-l border-gray-200 h-10">
            <span class="text-sm font-bold text-beeses-gold whitespace-nowrap">{{ getSelectedCount() }} Seçili</span>
            <button (click)="openBulkConfirmModal('rejected')" class="h-10 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-bold shadow-sm">
              <lucide-icon name="x" class="w-4 h-4"></lucide-icon> <span class="hidden sm:inline">Toplu Reddet</span>
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
          <thead *ngIf="activeTab === 'applications'" class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
            <tr>
              <th *ngIf="hasEditPermission" class="px-6 py-5 w-10 text-center rounded-tl-xl">
                <input type="checkbox" (change)="toggleAll($event)" [checked]="isAllSelected()" class="w-4 h-4 rounded border-gray-300 text-beeses-gold focus:ring-beeses-gold cursor-pointer bg-white/10">
              </th>
              <th class="px-6 py-4" [class.rounded-tl-xl]="!hasEditPermission">Tarih</th>
              <th class="px-6 py-4">Müşteri Bilgisi</th>
              <th class="px-6 py-4">Ülke / Telefon</th>
              <th class="px-6 py-4">Ürün Adı</th>
              <th class="px-6 py-4">Seri No</th>
              <th class="px-6 py-4 text-center">Fatura</th>
              <th class="px-6 py-5 text-center" [class.rounded-tr-xl]="!hasEditPermission">Durum</th>
              <th *ngIf="hasEditPermission" class="px-6 py-5 text-center rounded-tr-xl">İşlem</th>
            </tr>
          </thead>
          
          <thead *ngIf="activeTab === 'status'" class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
            <tr>
              <th class="px-6 py-4 rounded-tl-xl">Tarih</th>
              <th class="px-6 py-4">Ürün Adı</th>
              <th class="px-6 py-4">Seri No</th>
              <th class="px-6 py-4">Müşteri Bilgisi</th>
              <th class="px-6 py-4 text-center">Garanti Başlangıç/Bitiş Tarihleri</th>
              <th class="px-6 py-5 text-center" [class.rounded-tr-xl]="!hasEditPermission">Garanti Durumu</th>
              <th *ngIf="hasEditPermission" class="px-6 py-5 text-center rounded-tr-xl">İşlem</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100 bg-white">
            <ng-container *ngIf="activeTab === 'applications'">
              <tr *ngFor="let item of paginatedWarranties; let i = index" 
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
                  <div class="font-bold text-beeses-dark">{{ item.full_name }}</div>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="text-xs text-gray-400">{{ item.email }}</span>
                    <button *ngIf="hasEditPermission" (click)="openEmailModal(item.email, item.full_name, item.id)" class="text-beeses-gold hover:text-beeses-dark transition-colors cursor-pointer" title="E-posta Gönder">
                      <lucide-icon name="mail" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                  </div>
                  <div *ngIf="item.email_count > 0" class="flex items-center gap-1 mt-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full w-max">
                    <lucide-icon name="check-circle" class="w-3 h-3"></lucide-icon>
                    {{ item.email_count }} E-posta Gönderildi
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="font-medium text-gray-700">{{ item.country }}</div>
                  <div class="text-xs text-gray-400 mt-0.5">{{ item.phone }}</div>
                </td>
                <td class="px-6 py-4 font-bold text-beeses-dark">{{ item.product_name }}</td>
                <td class="px-6 py-4 text-gray-500 font-mono text-xs">{{ item.serial_number | uppercase }}</td>
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
                  <div *ngIf="item.status === 'approved'" class="mt-1 flex items-center justify-center gap-1 animate-fade-in">
                    <span class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border"
                          [ngClass]="item.approved_status === 'active' ? 'bg-green-500 text-white border-green-600' : 'bg-gray-400 text-white border-gray-500'">
                      {{ item.approved_status === 'active' ? 'Aktif' : 'Pasif' }}
                    </span>
                  </div>
                </td>
                <td *ngIf="hasEditPermission" class="px-6 py-4 text-center">
                  <button (click)="openDetail(item)" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-beeses-gold hover:border-beeses-gold rounded-lg text-sm font-bold transition-all shadow-sm">
                    <lucide-icon name="search" class="w-4 h-4"></lucide-icon>
                    İncele
                  </button>
                </td>
              </tr>
            </ng-container>

            <ng-container *ngIf="activeTab === 'status'">
              <tr *ngFor="let item of paginatedWarranties; let i = index" 
                  class="transition-colors hover:bg-beeses-gold/5 animate-fade-in" 
                  [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <lucide-icon name="calendar" class="w-4 h-4 text-gray-400"></lucide-icon>
                    <span class="text-sm font-medium text-gray-700">{{ item.created_at | date:'dd.MM.yyyy HH:mm' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 font-bold text-beeses-dark">{{ item.product_name }}</td>
                <td class="px-6 py-4 text-gray-500 font-mono text-xs font-semibold">{{ item.serial_number | uppercase }}</td>
                <td class="px-6 py-4">
                  <div class="font-bold text-beeses-dark">{{ item.full_name }}</div>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    <span class="text-xs text-gray-400">{{ item.email }}</span>
                    <button (click)="openEmailModal(item.email, item.full_name, item.id)" class="text-beeses-gold hover:text-beeses-dark transition-colors cursor-pointer" title="E-posta Gönder">
                      <lucide-icon name="mail" class="w-3.5 h-3.5"></lucide-icon>
                    </button>
                  </div>
                  <div *ngIf="item.email_count > 0" class="flex items-center gap-1 mt-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full w-max">
                    <lucide-icon name="check-circle" class="w-3 h-3"></lucide-icon>
                    {{ item.email_count }} E-posta Gönderildi
                  </div>
                </td>
                <td class="px-6 py-4 text-center whitespace-nowrap">
                  <div class="flex flex-col items-center justify-center gap-1">
                    <div class="flex items-center gap-1 text-xs text-gray-700 font-semibold">
                      <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider mr-1">BAŞLANGIÇ:</span>
                      {{ item.start_date | date:'dd.MM.yyyy' }}
                    </div>
                    <div class="flex items-center gap-1 text-xs text-gray-500">
                      <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider mr-1">BİTİŞ:</span>
                      {{ item.end_date | date:'dd.MM.yyyy' }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm"
                        [ngClass]="item.approved_status === 'active' ? 'bg-green-500 text-white border-green-600' : 'bg-gray-400 text-white border-gray-500'">
                    <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    {{ item.approved_status === 'active' ? 'Aktif' : 'Pasif' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button (click)="openDetail(item)" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-beeses-gold hover:border-beeses-gold rounded-lg text-sm font-bold transition-all shadow-sm">
                    <lucide-icon name="search" class="w-4 h-4"></lucide-icon>
                    İncele
                  </button>
                </td>
              </tr>
            </ng-container>

            <tr *ngIf="filteredWarranties.length === 0">
              <td [attr.colspan]="activeTab === 'applications' ? (hasEditPermission ? 9 : 7) : (hasEditPermission ? 7 : 6)" class="px-6 py-12 text-center text-gray-500">
                <lucide-icon name="search" class="w-8 h-8 mx-auto mb-3 text-gray-300"></lucide-icon>
                <p>Eşleşen kayıt bulunamadı.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
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

    <div *ngIf="showConfirmModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-beeses-dark/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all border border-gray-100">
        <div class="p-8 text-center">
          <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner" 
               [ngClass]="confirmAction === 'approved' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'">
            <lucide-icon [name]="confirmAction === 'approved' ? 'check' : 'x'" class="w-10 h-10"></lucide-icon>
          </div>
          <h3 class="text-2xl font-black text-beeses-dark mb-3 tracking-tight">Emin misiniz?</h3>
          <p class="text-gray-500 text-sm mb-6 leading-relaxed">
            <span *ngIf="!isBulkAction">Bu garanti başvurusunu <strong [ngClass]="confirmAction === 'approved' ? 'text-green-600' : 'text-red-600'">{{ confirmAction === 'approved' ? 'ONAYLAMAK' : 'REDDETMEK' }}</strong> istediğinize emin misiniz?</span>
            <span *ngIf="isBulkAction">Seçilen <strong>{{ getSelectedCount() }}</strong> başvuruyu <strong [ngClass]="confirmAction === 'approved' ? 'text-green-600' : 'text-red-600'">{{ confirmAction === 'approved' ? 'ONAYLAMAK' : 'REDDETMEK' }}</strong> istediğinize emin misiniz?</span>
            <br>Bu işlem durumu değiştirecektir.
          </p>

          <div *ngIf="confirmAction === 'approved'" class="text-left mb-6">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Garanti Başlangıç Tarihi *</label>
            <input type="date" [(ngModel)]="startDateInput" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 transition-all font-semibold text-beeses-dark">
          </div>
          
          <div class="flex gap-3">
            <button (click)="closeConfirmModal()" class="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm uppercase tracking-wider font-extrabold">İptal</button>
            <button (click)="executeStatusUpdate()" 
                    [disabled]="confirmAction === 'approved' && !startDateInput"
                    class="flex-1 py-3.5 px-4 text-white font-bold rounded-xl transition-colors text-sm uppercase tracking-wider shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-extrabold" 
                    [ngClass]="confirmAction === 'approved' ? 'bg-green-500 hover:bg-green-600 hover:shadow-green-500/30' : 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/30'">
              Evet, {{ confirmAction === 'approved' ? 'Onayla' : 'Reddet' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="selectedWarranty" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="shield-check" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            Garanti Detayı
          </h2>
          <button (click)="closeDetail()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-grow space-y-6">
          <div class="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-200 shadow-inner">
            <div class="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
              <div class="space-y-1.5">
                <span class="text-[10px] font-black text-beeses-gold uppercase tracking-widest block mb-1">Müşteri Bilgileri</span>
                <p class="text-sm font-bold text-beeses-dark flex items-center gap-2">
                  <lucide-icon name="user" class="w-4 h-4 text-gray-400"></lucide-icon>
                  {{ selectedWarranty.full_name }}
                </p>
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div class="flex items-center gap-1.5">
                    <lucide-icon name="mail" class="w-3.5 h-3.5 text-gray-400"></lucide-icon>
                    <span>{{ selectedWarranty.email }}</span>
                  </div>
                  <span class="text-gray-300">|</span>
                  <div class="flex items-center gap-1.5">
                    <lucide-icon name="phone" class="w-3.5 h-3.5 text-gray-400"></lucide-icon>
                    <span>{{ selectedWarranty.phone }}</span>
                  </div>
                  <span class="text-gray-300">|</span>
                  <div class="flex items-center gap-1.5">
                    <lucide-icon name="globe" class="w-3.5 h-3.5 text-gray-400"></lucide-icon>
                    <span>{{ selectedWarranty.country }}</span>
                  </div>
                </div>
              </div>
              <div class="flex-shrink-0 flex items-center">
                <button (click)="openEmailModal(selectedWarranty.email, selectedWarranty.full_name, selectedWarranty.id)" 
                        class="px-5 py-2.5 bg-beeses-gold hover:bg-beeses-dark hover:text-beeses-gold text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-beeses-gold/10">
                  <lucide-icon name="mail" class="w-3.5 h-3.5"></lucide-icon> E-posta Gönder
                </button>
              </div>
            </div>

            <div class="p-5 space-y-3 bg-white">
              <span class="text-[10px] font-black text-beeses-gold uppercase tracking-widest block">Ürün Bilgileri</span>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <span class="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ürün Adı</span>
                  <span class="text-sm font-bold text-beeses-dark flex items-center gap-1.5 mt-1">
                    <lucide-icon name="box" class="w-4 h-4 text-gray-400"></lucide-icon>
                    {{ selectedWarranty.product_name }}
                  </span>
                </div>
                <div>
                  <span class="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Seri Numarası</span>
                  <span class="text-sm font-mono font-bold text-beeses-gold bg-beeses-gold/5 px-2.5 py-0.5 rounded border border-beeses-gold/20 w-max mt-1 block uppercase tracking-wider">
                    {{ selectedWarranty.serial_number | uppercase }}
                  </span>
                </div>
              </div>
            </div>

            <div class="p-5 space-y-3 bg-gray-50/30">
              <span class="text-[10px] font-black text-beeses-gold uppercase tracking-widest block">Fatura Bilgileri</span>
              <div class="flex justify-start">
                <a [href]="apiUrl + '/' + selectedWarranty.invoice_path" target="_blank" 
                   class="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 hover:bg-blue-600 border border-blue-100 text-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                  <lucide-icon name="file-text" class="w-4 h-4"></lucide-icon>
                  Faturayı Görüntüle
                </a>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-6">
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Gönderilen E-posta Geçmişi</p>
             
             <div *ngIf="sentEmailsList.length === 0" class="text-gray-400 text-xs italic p-4 bg-gray-50 rounded-xl border border-gray-100">
               Bu başvuruya henüz e-posta gönderilmemiş.
             </div>

             <div *ngIf="sentEmailsList.length > 0" class="space-y-3.5">
               <div *ngFor="let email of sentEmailsList" class="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                 <div (click)="email.isExpanded = !email.isExpanded" class="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100/50 transition-colors">
                   <div class="flex items-center gap-2.5">
                     <lucide-icon name="mail" class="w-4 h-4 text-beeses-gold"></lucide-icon>
                     <div>
                       <p class="text-xs font-bold text-beeses-dark">{{ email.subject }}</p>
                       <p class="text-[10px] text-gray-400 mt-0.5">{{ email.sent_at | date:'dd.MM.yyyy HH:mm' }}</p>
                     </div>
                   </div>
                   <lucide-icon [name]="email.isExpanded ? 'chevron-up' : 'chevron-down'" class="w-4 h-4 text-gray-400"></lucide-icon>
                 </div>
                 
                 <div *ngIf="email.isExpanded" class="p-4 bg-white border-t border-gray-100 text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                   {{ email.message }}
                 </div>
               </div>
             </div>
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

             <div *ngIf="selectedWarranty.status === 'approved' && selectedWarranty.start_date" 
                   class="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 mt-4 text-xs">
               <p class="text-[10px] font-black text-beeses-dark uppercase tracking-widest border-b border-gray-200 pb-2">Garanti Süreç Detayları</p>
               <div class="grid grid-cols-2 gap-4">
                 <div>
                   <span class="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Başlangıç Tarihi</span>
                   <span class="font-bold text-gray-700">{{ selectedWarranty.start_date | date:'dd.MM.yyyy' }}</span>
                 </div>
                 <div>
                   <span class="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Bitiş Tarihi (+2 Yıl)</span>
                   <span class="font-bold text-gray-700">{{ selectedWarranty.end_date | date:'dd.MM.yyyy' }}</span>
                 </div>
               </div>
               <div class="pt-2 border-t border-gray-200 flex justify-between items-center">
                 <span class="text-gray-500 font-bold uppercase tracking-wider text-[9px]">Garanti Durumu:</span>
                 <span class="px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider"
                       [ngClass]="selectedWarranty.approved_status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                   {{ selectedWarranty.approved_status === 'active' ? 'AKTİF' : 'PASİF' }}
                 </span>
               </div>
             </div>
          </div>

        </div>

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

    <div *ngIf="showEmailModal" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="mail" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            Müşteriye E-posta Gönder
          </h2>
          <button (click)="closeEmailModal()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white cursor-pointer">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-grow space-y-4">
          <div>
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Alıcı E-posta</label>
            <input type="text" [value]="emailData.to" readonly class="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-xs text-gray-500 font-semibold focus:outline-none cursor-not-allowed">
          </div>
          
          <div>
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Konu / Başlık *</label>
            <input type="text" [(ngModel)]="emailData.subject" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all" placeholder="E-posta konusunu girin...">
          </div>

          <div>
            <label class="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Mesaj İçeriği *</label>
            <textarea [(ngModel)]="emailData.message" rows="8" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-beeses-gold focus:ring-2 focus:ring-beeses-gold/20 focus:bg-white transition-all resize-none min-h-[150px]" placeholder="Mesajınızı buraya yazın..."></textarea>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button (click)="closeEmailModal()" class="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer">
            Vazgeç
          </button>
          <button (click)="sendEmail()" [disabled]="isSendingEmail" class="px-5 py-2.5 bg-beeses-gold hover:bg-beeses-dark disabled:bg-gray-300 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2">
            <span *ngIf="isSendingEmail" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <lucide-icon *ngIf="!isSendingEmail" name="send" class="w-4 h-4"></lucide-icon>
            {{ isSendingEmail ? 'Gönderiliyor...' : 'Gönder' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class WarrantiesAdminComponent implements OnInit {
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
          this.hasEditPermission = !!(perms['warranties'] && perms['warranties'].edit === true);
        } catch (e) {
          this.hasEditPermission = false;
        }
      }
    }
    this.loadWarranties();
  }
  private http = inject(HttpClient);
  apiUrl = environment.apiUrl;
  
  warranties: any[] = [];
  isLoading = true;

  activeTab: 'applications' | 'status' = 'applications';

  searchQuery = '';
  searchDateStart = '';
  searchDateEnd = '';
  searchField = 'serial_number';
  filterStatus = 'all';
  
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

  switchTab(tab: 'applications' | 'status') {
    this.activeTab = tab;
    this.searchQuery = '';
    this.searchDateStart = '';
    this.searchDateEnd = '';
    this.filterStatus = 'all';
    this.currentPage = 1;
    this.warranties.forEach(w => w.selected = false);
  }

  getRemainingDays(endDateStr: string): number {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr).getTime();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = end - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  get filteredWarranties() {
    return this.warranties.filter(w => {
      if (this.activeTab === 'status') {
        if (w.status !== 'approved') return false;
        
        if (this.filterStatus !== 'all') {
          if (this.filterStatus === 'approved_active') {
            if (w.approved_status !== 'active') return false;
          } else if (this.filterStatus === 'approved_passive') {
            if (w.approved_status !== 'passive') return false;
          }
        }
      } else {
        if (w.status === 'approved') return false;
        
        if (this.filterStatus !== 'all') {
          if (this.filterStatus === 'pending') {
            if (w.status !== 'pending') return false;
          } else if (this.filterStatus === 'rejected') {
            if (w.status !== 'rejected') return false;
          }
        }
      }
      
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

  loadWarranties() {
    this.isLoading = true;
    this.http.get(`${this.apiUrl}/warranty/get-warranties.php`).subscribe({
      next: (res: any) => {
        if (res.success) {
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
  startDateInput = '';

  showEmailModal = false;
  isSendingEmail = false;
  emailData = {
    to: '',
    subject: '',
    message: '',
    warranty_id: 0
  };
  sentEmailsList: any[] = [];

  openEmailModal(recipientEmail: string, fullName: string, warrantyId: number) {
    this.emailData = {
      to: recipientEmail,
      subject: 'Beeses Audio - Garanti Başvurusu Hakkında',
      message: `Sayın ${fullName},\n\nGaranti başvurunuzla ilgili olarak:\n\n\n\nSaygılarimizla,\nBeeses Audio Ekibi`,
      warranty_id: warrantyId
    };
    this.showEmailModal = true;
  }

  closeEmailModal() {
    this.showEmailModal = false;
    this.isSendingEmail = false;
  }

  sendEmail() {
    if (!this.emailData.subject.trim() || !this.emailData.message.trim()) {
      alert('Lütfen konu ve mesaj içeriği alanlarını doldurun.');
      return;
    }

    this.isSendingEmail = true;
    this.http.post(`${this.apiUrl}/warranty/send-mail.php`, this.emailData).subscribe({
      next: (res: any) => {
        this.isSendingEmail = false;
        if (res.success) {
          alert('E-posta başarıyla gönderildi ve kaydedildi.');
          
          const item = this.warranties.find(w => w.id === this.emailData.warranty_id);
          if (item) {
            item.email_count = (item.email_count || 0) + 1;
          }
          if (this.selectedWarranty && this.selectedWarranty.id === this.emailData.warranty_id) {
            this.selectedWarranty.email_count = (this.selectedWarranty.email_count || 0) + 1;
            this.loadEmailHistory(this.selectedWarranty.id);
          }

          this.closeEmailModal();
        } else {
          alert('Hata: ' + res.message);
        }
      },
      error: () => {
        this.isSendingEmail = false;
        alert('E-posta gönderilirken sunucuyla bağlantı kurulamadı.');
      }
    });
  }

  loadEmailHistory(warrantyId: number) {
    this.http.get(`${this.apiUrl}/warranty/get-warranty-emails.php?warranty_id=${warrantyId}`).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.sentEmailsList = res.data.map((email: any) => ({ ...email, isExpanded: false }));
        }
      }
    });
  }

  openDetail(warranty: any) {
    this.selectedWarranty = warranty;
    this.sentEmailsList = [];
    this.loadEmailHistory(warranty.id);
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
    this.startDateInput = '';
  }

  executeStatusUpdate() {
    if (!this.confirmAction) return;

    const status = this.confirmAction;
    let payload: any = { status };

    if (status === 'approved') {
      if (!this.startDateInput) {
        alert('Lütfen garanti başlangıç tarihini seçin.');
        return;
      }
      payload.start_date = this.startDateInput;
    }

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
          this.loadWarranties();
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
