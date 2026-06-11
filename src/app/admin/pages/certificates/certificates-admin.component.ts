import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CertificateService, Certificate } from '../../../services/certificate.service';
import { AlertService } from '../../../services/alert.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-certificates-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
          <lucide-icon name="award" class="w-5 h-5 text-beeses-gold"></lucide-icon>
          Sertifikalar Yönetimi
        </h2>
        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          <button (click)="loadCertificates()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap cursor-pointer">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white" *ngIf="!isLoading">
        <div class="relative w-full sm:w-80">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <lucide-icon name="search" class="w-4 h-4 text-gray-400"></lucide-icon>
          </div>
          <input type="text" [(ngModel)]="searchQuery" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block w-full pl-10 p-2.5 outline-none h-10 transition-colors" placeholder="Sertifikalarda arama yapın...">
        </div>

        <button (click)="openAddModal()" class="flex items-center gap-2 px-4 py-2 bg-beeses-gold hover:bg-beeses-dark text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer h-10 w-full sm:w-auto justify-center">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon> Yeni Sertifika Ekle
        </button>
      </div>

      <div class="p-6 text-center text-gray-500" *ngIf="isLoading">
        <lucide-icon name="refresh-cw" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
        <p>Sertifikalar Yükleniyor...</p>
      </div>

      <div class="overflow-x-auto" *ngIf="!isLoading">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
            <tr>
              <th class="px-6 py-4 w-16 text-center">ID</th>
              <th class="px-6 py-4 w-16 text-center">Simge</th>
              <th class="px-6 py-4">Sertifika Adı</th>
              <th class="px-6 py-4">Açıklama</th>
              <th class="px-6 py-4">Dosya</th>
              <th class="px-6 py-5 text-center w-28 rounded-tr-xl">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr *ngFor="let item of filteredCertificates; let i = index" 
                class="transition-colors hover:bg-beeses-gold/5" 
                [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'">
              
              <td class="px-6 py-4 text-center font-semibold text-beeses-dark">{{ item.id }}</td>
              
              <td class="px-6 py-4 text-center">
                <div class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100 text-beeses-gold">
                  <lucide-icon [name]="item.icon || 'award'" class="w-5 h-5"></lucide-icon>
                </div>
              </td>
              
              <td class="px-6 py-4 font-semibold text-beeses-dark max-w-xs">
                <div class="line-clamp-1" [title]="item.name">{{ item.name }}</div>
              </td>
              
              <td class="px-6 py-4 text-gray-500 max-w-sm">
                <div class="line-clamp-2" [title]="item.description">{{ item.description }}</div>
              </td>

              <td class="px-6 py-4">
                <div *ngIf="item.file_path; else noFile">
                  <a [href]="apiUrl + '/' + item.file_path" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 hover:bg-green-600 hover:text-white rounded-full text-xs font-bold transition-all" title="Belgeyi Görüntüle">
                    <lucide-icon name="external-link" class="w-3.5 h-3.5"></lucide-icon>
                    Görüntüle
                  </a>
                </div>
                <ng-template #noFile>
                  <span class="text-xs text-gray-400 italic">Yüklenmemiş</span>
                </ng-template>
              </td>

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
            <tr *ngIf="filteredCertificates.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <lucide-icon name="search" class="w-8 h-8 mx-auto mb-3 text-gray-300"></lucide-icon>
                <p>Eşleşen kayıt bulunamadı.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="award" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            {{ editingItem ? 'Sertifika Düzenle' : 'Yeni Sertifika Ekle' }}
          </h2>
          <button (click)="closeModal()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white cursor-pointer">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div class="px-6 pt-4 flex border-b border-gray-100 bg-gray-50/50 gap-2">
          <button type="button" (click)="activeTab = 'tr'" [class]="'flex items-center gap-1.5 px-4 py-2.5 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ' + (activeTab === 'tr' ? 'border-beeses-gold text-beeses-gold' : 'border-transparent text-gray-400 hover:text-gray-600')">
            Türkçe (TR)
          </button>
          <button type="button" (click)="activeTab = 'en'" [class]="'flex items-center gap-1.5 px-4 py-2.5 border-b-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ' + (activeTab === 'en' ? 'border-beeses-gold text-beeses-gold' : 'border-transparent text-gray-400 hover:text-gray-600')">
            English (EN)
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-grow space-y-4">
          <div *ngIf="activeTab === 'tr'" class="space-y-4 animate-fade-in">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sertifika Adı (TR) *</label>
              <input type="text" [(ngModel)]="formData.name" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Türkçe sertifika adını yazın...">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Açıklama (TR)</label>
              <textarea [(ngModel)]="formData.description" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all resize-none" placeholder="Türkçe sertifika açıklamasını yazın..."></textarea>
            </div>
          </div>

          <div *ngIf="activeTab === 'en'" class="space-y-4 animate-fade-in">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Sertifika Adı (EN)</label>
              <input type="text" [(ngModel)]="formData.name_en" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Write certificate name in English...">
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Açıklama (EN)</label>
              <textarea [(ngModel)]="formData.description_en" rows="3" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all resize-none" placeholder="Write certificate description in English..."></textarea>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Simge (Icon) *</label>
            <select [(ngModel)]="formData.icon" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all cursor-pointer mb-2">
              <option value="shield-check">Kalkan (shield-check)</option>
              <option value="leaf">Yaprak (leaf)</option>
              <option value="award">Ödül / Rozet (award)</option>
              <option value="flag">Bayrak (flag)</option>
              <option value="check-circle">Check Daire (check-circle)</option>
              <option value="settings">Ayarlar (settings)</option>
              <option value="help-circle">Soru (help-circle)</option>
              <option value="info">Bilgi (info)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Sertifika Belgesi (PDF / Görsel)
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors relative">
              <div class="space-y-1 text-center">
                <lucide-icon name="upload-cloud" class="mx-auto h-12 w-12 text-gray-400"></lucide-icon>
                <div class="flex text-sm text-gray-600 justify-center">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-semibold text-beeses-gold hover:text-beeses-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-beeses-gold">
                    <span>Dosya yükleyin</span>
                    <input id="file-upload" type="file" (change)="onFileSelected($event)" accept=".pdf,image/*" class="sr-only">
                  </label>
                </div>
                <p class="text-xs text-gray-400">PDF, PNG, JPG, JPEG, WEBP (maks. 5MB)</p>
                <p *ngIf="selectedFileName" class="text-xs font-bold text-beeses-gold mt-2 flex items-center justify-center gap-1">
                  <lucide-icon name="file-text" class="w-3.5 h-3.5"></lucide-icon>
                  {{ selectedFileName }}
                </p>
              </div>
            </div>
            <p *ngIf="editingItem && editingItem.file_path && !selectedFileName" class="text-xs text-gray-400 mt-2">
              Mevcut dosya: <span class="font-semibold text-beeses-dark">{{ getFileNameFromPath(editingItem.file_path) }}</span> (Yeni dosya seçilmezse korunur.)
            </p>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="closeModal()" class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold transition-all cursor-pointer">
            İptal
          </button>
          <button (click)="saveCertificate()" [disabled]="isSaving" class="px-6 py-2 bg-beeses-gold hover:bg-beeses-dark disabled:bg-gray-300 text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2">
            <span *ngIf="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  `
})
export class CertificatesAdminComponent implements OnInit {
  private certificateService = inject(CertificateService);
  private alertService = inject(AlertService);

  certificates: Certificate[] = [];
  isLoading = true;
  isSaving = false;
  apiUrl = environment.apiUrl;

  searchQuery = '';

  showModal = false;
  editingItem: Certificate | null = null;
  selectedFile: File | null = null;
  selectedFileName = '';
  activeTab = 'tr';
  formData = {
    name: '',
    description: '',
    name_en: '',
    description_en: '',
    icon: 'award'
  };

  ngOnInit() {
    this.loadCertificates();
  }

  loadCertificates() {
    this.isLoading = true;
    this.certificateService.getCertificates().subscribe({
      next: (response) => {
        if (response.success) {
          this.certificates = response.data;
        } else {
          this.alertService.showError('Sertifikalar yüklenirken hata oluştu.');
        }
        this.isLoading = false;
      },
      error: () => {
        this.alertService.showError('Sunucu bağlantı hatası.');
        this.isLoading = false;
      }
    });
  }

  get filteredCertificates(): Certificate[] {
    if (!this.searchQuery.trim()) {
      return this.certificates;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return this.certificates.filter(
      item =>
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.alertService.showError('Dosya boyutu 5MB\'tan küçük olmalıdır.');
        return;
      }
      this.selectedFile = file;
      this.selectedFileName = file.name;
    }
  }

  getFileNameFromPath(path: string): string {
    if (!path) return '';
    return path.split('/').pop() || '';
  }

  openAddModal() {
    this.editingItem = null;
    this.selectedFile = null;
    this.selectedFileName = '';
    this.activeTab = 'tr';
    this.formData = {
      name: '',
      description: '',
      name_en: '',
      description_en: '',
      icon: 'award'
    };
    this.showModal = true;
  }

  openEditModal(item: Certificate) {
    this.editingItem = item;
    this.selectedFile = null;
    this.selectedFileName = '';
    this.activeTab = 'tr';
    this.formData = {
      name: item.name,
      description: item.description || '',
      name_en: item.name_en || '',
      description_en: item.description_en || '',
      icon: item.icon || 'award'
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingItem = null;
    this.selectedFile = null;
    this.selectedFileName = '';
  }

  saveCertificate() {
    if (!this.formData.name.trim()) {
      this.alertService.showError('Sertifika adı zorunludur.');
      return;
    }

    this.isSaving = true;

    const uploadData = new FormData();
    uploadData.append('name', this.formData.name);
    uploadData.append('description', this.formData.description);
    uploadData.append('name_en', this.formData.name_en);
    uploadData.append('description_en', this.formData.description_en);
    uploadData.append('icon', this.formData.icon);

    if (this.selectedFile) {
      uploadData.append('certificate_file', this.selectedFile);
    }

    if (this.editingItem) {
      uploadData.append('id', String(this.editingItem.id));

      this.certificateService.updateCertificate(uploadData).subscribe({
        next: (response) => {
          if (response.success) {
            this.alertService.showSuccess('Sertifika başarıyla güncellendi.');
            this.loadCertificates();
            this.closeModal();
          } else {
            this.alertService.showError(response.message || 'Sertifika güncellenemedi.');
          }
          this.isSaving = false;
        },
        error: () => {
          this.alertService.showError('Sertifika güncellenirken hata oluştu.');
          this.isSaving = false;
        }
      });
    } else {
      this.certificateService.addCertificate(uploadData).subscribe({
        next: (response) => {
          if (response.success) {
            this.alertService.showSuccess('Sertifika başarıyla eklendi.');
            this.loadCertificates();
            this.closeModal();
          } else {
            this.alertService.showError(response.message || 'Sertifika eklenemedi.');
          }
          this.isSaving = false;
        },
        error: () => {
          this.alertService.showError('Sertifika eklenirken hata oluştu.');
          this.isSaving = false;
        }
      });
    }
  }

  confirmDelete(item: Certificate) {
    if (confirm('Bu sertifikayı silmek istediğinize emin misiniz?')) {
      this.certificateService.deleteCertificate(item.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.alertService.showSuccess('Sertifika başarıyla silindi.');
            this.loadCertificates();
          } else {
            this.alertService.showError(response.message || 'Sertifika silinemedi.');
          }
        },
        error: () => {
          this.alertService.showError('Sertifika silinirken hata oluştu.');
        }
      });
    }
  }
}
