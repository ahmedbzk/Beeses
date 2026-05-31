import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FaqService, FAQ } from '../../../services/faq.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-faq-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
          <lucide-icon name="message-square" class="w-5 h-5 text-beeses-gold"></lucide-icon>
          Sıkça Sorulan Sorular Yönetimi
        </h2>
        <div class="flex items-center gap-3 w-full md:w-auto justify-end">
          <button (click)="loadFaqs()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap cursor-pointer">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      <!-- Toolbar: Search & Add -->
      <div class="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white" *ngIf="!isLoading">
        <!-- Search -->
        <div class="relative w-full sm:w-80">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <lucide-icon name="search" class="w-4 h-4 text-gray-400"></lucide-icon>
          </div>
          <input type="text" [(ngModel)]="searchQuery" (input)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block w-full pl-10 p-2.5 outline-none h-10 transition-colors" placeholder="Sorularda arama yapın...">
        </div>

        <button (click)="openAddModal()" class="flex items-center gap-2 px-4 py-2 bg-beeses-gold hover:bg-beeses-dark text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer h-10 w-full sm:w-auto justify-center">
          <lucide-icon name="plus" class="w-4 h-4"></lucide-icon> Yeni Soru Ekle
        </button>
      </div>

      <!-- Loading State -->
      <div class="p-6 text-center text-gray-500" *ngIf="isLoading">
        <lucide-icon name="refresh-cw" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
        <p>Sorular Yükleniyor...</p>
      </div>

      <!-- Table View -->
      <div class="overflow-x-auto" *ngIf="!isLoading">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="bg-beeses-dark text-beeses-gold font-bold uppercase text-[10px] tracking-[0.15em] border-b-2 border-beeses-gold shadow-sm">
            <tr>
              <th class="px-6 py-4 w-16 text-center">ID</th>
              <th class="px-6 py-4">Soru</th>
              <th class="px-6 py-4">Cevap</th>
              <th class="px-6 py-5 text-center w-28 rounded-tr-xl">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr *ngFor="let item of paginatedFaqs; let i = index" 
                class="transition-colors hover:bg-beeses-gold/5" 
                [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'">
              
              <td class="px-6 py-4 text-center font-semibold text-beeses-dark">{{ item.id }}</td>
              
              <td class="px-6 py-4 font-semibold text-beeses-dark max-w-xs md:max-w-sm">
                <div class="line-clamp-2" [title]="item.question">{{ item.question }}</div>
              </td>
              
              <td class="px-6 py-4 text-gray-500 max-w-sm md:max-w-md">
                <div class="line-clamp-2" [title]="item.answer">{{ item.answer }}</div>
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
            <tr *ngIf="paginatedFaqs.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                <lucide-icon name="search" class="w-8 h-8 mx-auto mb-3 text-gray-300"></lucide-icon>
                <p>Eşleşen kayıt bulunamadı.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50" *ngIf="!isLoading && filteredFaqs.length > 0">
        <span class="text-sm text-gray-600">
          Toplam <strong>{{ filteredFaqs.length }}</strong> kayıttan <strong>{{ getStartRange() }}</strong> - <strong>{{ getEndRange() }}</strong> arası gösteriliyor
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
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="message-square" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            {{ editingItem ? 'Soru Düzenle' : 'Yeni Soru Ekle' }}
          </h2>
          <button (click)="closeModal()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white cursor-pointer">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-grow space-y-4">
          <!-- Question -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Soru *</label>
            <input type="text" [(ngModel)]="formData.question" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Soruyu yazın...">
          </div>

          <!-- Answer -->
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cevap *</label>
            <textarea [(ngModel)]="formData.answer" rows="6" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all resize-none" placeholder="Cevabı yazın..."></textarea>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="closeModal()" class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold transition-all cursor-pointer">
            İptal
          </button>
          <button (click)="saveFaq()" [disabled]="isSaving" class="px-6 py-2 bg-beeses-gold hover:bg-beeses-dark disabled:bg-gray-300 text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2">
            <span *ngIf="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  `
})
export class FaqAdminComponent implements OnInit {
  private faqService = inject(FaqService);
  private alertService = inject(AlertService);

  faqs: FAQ[] = [];
  isLoading = true;
  isSaving = false;

  // Search & Pagination
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;

  // Modal State
  showModal = false;
  editingItem: FAQ | null = null;
  formData = {
    question: '',
    answer: ''
  };

  ngOnInit() {
    this.loadFaqs();
  }

  loadFaqs() {
    this.isLoading = true;
    this.faqService.getFaqs().subscribe({
      next: (response) => {
        if (response.success) {
          this.faqs = response.data;
        } else {
          this.alertService.showError('Sorular yüklenirken hata oluştu.');
        }
        this.isLoading = false;
      },
      error: () => {
        this.alertService.showError('Sunucu bağlantı hatası.');
        this.isLoading = false;
      }
    });
  }

  // Getters for filtered and paginated lists
  get filteredFaqs(): FAQ[] {
    if (!this.searchQuery.trim()) {
      return this.faqs;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return this.faqs.filter(
      item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    );
  }

  get paginatedFaqs(): FAQ[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFaqs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getStartRange(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndRange(): number {
    const end = this.currentPage * this.itemsPerPage;
    const total = this.filteredFaqs.length;
    return end > total ? total : end;
  }

  totalPages(): number {
    return Math.ceil(this.filteredFaqs.length / this.itemsPerPage);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  // Modal actions
  openAddModal() {
    this.editingItem = null;
    this.formData = {
      question: '',
      answer: ''
    };
    this.showModal = true;
  }

  openEditModal(item: FAQ) {
    this.editingItem = item;
    this.formData = {
      question: item.question,
      answer: item.answer
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingItem = null;
  }

  saveFaq() {
    if (!this.formData.question.trim() || !this.formData.answer.trim()) {
      this.alertService.showError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    this.isSaving = true;

    if (this.editingItem) {
      // Update
      const payload = {
        id: this.editingItem.id,
        question: this.formData.question,
        answer: this.formData.answer
      };

      this.faqService.updateFaq(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.alertService.showSuccess('Soru başarıyla güncellendi.');
            this.loadFaqs();
            this.closeModal();
          } else {
            this.alertService.showError(response.message || 'Soru güncellenemedi.');
          }
          this.isSaving = false;
        },
        error: () => {
          this.alertService.showError('Soru güncellenirken hata oluştu.');
          this.isSaving = false;
        }
      });
    } else {
      // Add
      const payload = {
        question: this.formData.question,
        answer: this.formData.answer
      };

      this.faqService.addFaq(payload).subscribe({
        next: (response) => {
          if (response.success) {
            this.alertService.showSuccess('Soru başarıyla eklendi.');
            this.loadFaqs();
            this.closeModal();
          } else {
            this.alertService.showError(response.message || 'Soru eklenemedi.');
          }
          this.isSaving = false;
        },
        error: () => {
          this.alertService.showError('Soru eklenirken hata oluştu.');
          this.isSaving = false;
        }
      });
    }
  }

  confirmDelete(item: FAQ) {
    if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
      this.faqService.deleteFaq(item.id!).subscribe({
        next: (response) => {
          if (response.success) {
            this.alertService.showSuccess('Soru başarıyla silindi.');
            this.loadFaqs();
          } else {
            this.alertService.showError(response.message || 'Soru silinemedi.');
          }
        },
        error: () => {
          this.alertService.showError('Soru silinirken hata oluştu.');
        }
      });
    }
  }
}
