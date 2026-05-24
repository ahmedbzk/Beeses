import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ContactService, ContactForm } from '../../../services/contact.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-contacts-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
        <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
          <lucide-icon name="mail" class="w-5 h-5 text-beeses-gold"></lucide-icon>
          İletişim Mesajları
        </h2>
        <div class="flex items-center gap-4 w-full md:w-auto justify-end">
          <button (click)="loadContacts()" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium whitespace-nowrap">
            <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon> Yenile
          </button>
        </div>
      </div>

      <!-- Toolbar: Search & Filters -->
      <div class="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white" *ngIf="!isLoading">
        
        <!-- Search -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <select [(ngModel)]="searchField" (change)="currentPage = 1" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-beeses-gold focus:border-beeses-gold block p-2.5 outline-none cursor-pointer h-10 min-w-[120px]">
            <option value="name">İsim Soyisim</option>
            <option value="email">Email</option>
            <option value="subject">Konu</option>
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
            <option value="yeni">Yeni</option>
            <option value="okundu">Okundu</option>
            <option value="cevaplandi">Cevaplandı</option>
          </select>
          
          <div *ngIf="getSelectedCount() > 0" class="flex items-center gap-2 animate-fade-in pl-0 lg:pl-3 lg:border-l border-gray-200 h-10">
            <span class="text-sm font-bold text-beeses-gold whitespace-nowrap">{{ getSelectedCount() }} Seçili</span>
            <button (click)="executeBulkStatus('okundu')" class="h-10 px-3 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-bold shadow-sm">
              <lucide-icon name="eye" class="w-4 h-4"></lucide-icon> <span class="hidden sm:inline">Okundu İşaretle</span>
            </button>
            <button (click)="executeBulkStatus('yeni')" class="h-10 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-bold shadow-sm">
              <lucide-icon name="mail" class="w-4 h-4"></lucide-icon> <span class="hidden sm:inline">Yeni İşaretle</span>
            </button>
          </div>
        </div>
      </div>

      <div class="p-6 text-center text-gray-500" *ngIf="isLoading">
        <lucide-icon name="loader" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
        <p>Mesajlar Yükleniyor...</p>
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
              <th class="px-6 py-4">Konu</th>
              <th class="px-6 py-5 text-center">Durum</th>
              <th class="px-6 py-5 text-center rounded-tr-xl">İşlem</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr *ngFor="let item of paginatedContacts; let i = index" 
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
                <div class="font-bold text-beeses-dark">{{ item.first_name }} {{ item.last_name }}</div>
                <div class="text-xs text-gray-400 mt-0.5">{{ item.email }}</div>
                <div class="text-xs text-gray-400 mt-0.5" *ngIf="item.phone">{{ item.phone }}</div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-gray-700">{{ item.subject }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      [ngClass]="{
                        'bg-blue-50 text-blue-600 border border-blue-200': item.status === 'yeni',
                        'bg-yellow-50 text-yellow-600 border border-yellow-200': item.status === 'okundu',
                        'bg-green-50 text-green-600 border border-green-200': item.status === 'cevaplandi'
                      }">
                  <lucide-icon [name]="item.status === 'yeni' ? 'mail' : (item.status === 'okundu' ? 'eye' : 'check-circle')" class="w-3 h-3"></lucide-icon>
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button (click)="openDetail(item)" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-beeses-gold hover:border-beeses-gold rounded-lg text-sm font-bold transition-all shadow-sm">
                  <lucide-icon name="search" class="w-4 h-4"></lucide-icon>
                  İncele
                </button>
              </td>
            </tr>
            <tr *ngIf="paginatedContacts.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                <lucide-icon name="search" class="w-8 h-8 mx-auto mb-3 text-gray-300"></lucide-icon>
                <p>Eşleşen kayıt bulunamadı.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50" *ngIf="!isLoading && filteredContacts.length > 0">
        <span class="text-sm text-gray-600">
          Toplam <strong>{{ filteredContacts.length }}</strong> kayıttan <strong>{{ (currentPage - 1) * pageSize + 1 }}</strong> - <strong>{{ Math.min(currentPage * pageSize, filteredContacts.length) }}</strong> arası gösteriliyor
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

    <!-- Detay Modal -->
    <div *ngIf="selectedMessage" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="message-square" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            Mesaj Detayı
          </h2>
          <button (click)="closeDetail()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto flex-grow space-y-6">
          
          <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gönderen</p>
              <p class="text-sm font-bold text-beeses-dark">{{ selectedMessage.first_name }} {{ selectedMessage.last_name }}</p>
              <p class="text-xs text-gray-500">{{ selectedMessage.email }}</p>
              <p class="text-xs text-gray-500" *ngIf="selectedMessage.phone">{{ selectedMessage.phone }}</p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Tarih</p>
              <p class="text-sm font-medium text-gray-700">{{ selectedMessage.created_at | date:'dd.MM.yyyy HH:mm' }}</p>
            </div>
          </div>

          <div>
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Konu</p>
             <p class="text-md font-bold text-beeses-dark">{{ selectedMessage.subject }}</p>
          </div>

          <div>
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mesaj İçeriği</p>
             <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed min-h-[100px]">
               {{ selectedMessage.message }}
             </div>
          </div>

          <div *ngIf="selectedMessage.status !== 'cevaplandi'" class="border-t border-gray-100 pt-6">
             <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cevap Yaz</p>
             <textarea [(ngModel)]="replyText" rows="4" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all" placeholder="Müşteriye gönderilecek cevabı buraya yazın..."></textarea>
             <p class="text-xs text-gray-400 mt-2">* Gerçek mail entegrasyonu tamamlandığında, buraya yazılan cevap otomatik olarak gönderenin e-posta adresine iletilecektir.</p>
          </div>

          <div *ngIf="selectedMessage.status === 'cevaplandi'" class="border-t border-gray-100 pt-6">
             <div class="bg-green-50 border border-green-200 p-4 rounded-xl mb-4 flex items-start gap-3">
               <lucide-icon name="check-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"></lucide-icon>
               <div>
                 <p class="text-sm font-bold text-green-800">Bu mesaja cevap verildi</p>
                 <p class="text-xs text-green-600 mt-1">Müşteriyle iletişime geçildiği için işlem tamamlandı olarak işaretlenmiş.</p>
               </div>
             </div>
             
             <div *ngIf="selectedMessage.reply_message">
               <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gönderilen Cevap</p>
               <div class="bg-white p-4 rounded-xl border border-gray-100 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed shadow-sm border-l-4 border-l-green-400">
                 {{ selectedMessage.reply_message }}
               </div>
             </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="closeDetail()" class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-bold text-sm transition-colors">
            Kapat
          </button>
          
          <button *ngIf="selectedMessage.status !== 'cevaplandi'" (click)="markAsReplied()" [disabled]="!replyText" class="px-5 py-2.5 rounded-xl bg-beeses-gold hover:bg-beeses-dark text-white font-bold text-sm transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <lucide-icon name="send" class="w-4 h-4"></lucide-icon>
            Cevapla ve Kapat
          </button>
        </div>
      </div>
    </div>
  `
})
export class ContactsAdminComponent implements OnInit {
  private contactService = inject(ContactService);
  private alertService = inject(AlertService);

  contacts: (ContactForm & { selected?: boolean })[] = [];
  selectedMessage: ContactForm | null = null;
  replyText = '';
  isLoading = true;

  // Filter & Search states
  searchQuery = '';
  searchDateStart = '';
  searchDateEnd = '';
  searchField = 'name';
  filterStatus = 'all';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  Math = Math;

  get paginatedContacts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredContacts.slice(start, start + this.pageSize);
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredContacts.length / this.pageSize));
  }

  get filteredContacts() {
    return this.contacts.filter(c => {
      if (this.filterStatus !== 'all' && c.status !== this.filterStatus) return false;
      
      if (this.searchField === 'created_at') {
        if (this.searchDateStart || this.searchDateEnd) {
          if (!c.created_at) return false;
          const itemDate = new Date(c.created_at);
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
        if (this.searchField === 'name') {
          value = String((c as any).first_name + ' ' + (c as any).last_name).toLowerCase();
        } else {
          value = String((c as any)[this.searchField] || '').toLowerCase();
        }
        if (!value.includes(query)) return false;
      }
      return true;
    });
  }

  toggleAll(event: any) {
    const isChecked = event.target.checked;
    this.filteredContacts.forEach(c => c.selected = isChecked);
  }

  isAllSelected() {
    if (this.filteredContacts.length === 0) return false;
    return this.filteredContacts.every(c => c.selected);
  }

  getSelectedCount() {
    return this.contacts.filter(c => c.selected).length;
  }

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.isLoading = true;
    this.contactService.getContacts().subscribe({
      next: (res) => {
        if (res.success) {
          this.contacts = res.data.map((c: any) => ({ ...c, selected: false }));
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alertService.showError('Mesajlar yüklenirken hata oluştu.');
      }
    });
  }

  openDetail(msg: ContactForm) {
    this.selectedMessage = msg;
    this.replyText = '';
    
    // Eğer yeni mesaj açıldıysa okundu yapalım
    if (msg.status === 'yeni' && msg.id) {
      this.contactService.updateContactStatus(msg.id, 'okundu').subscribe({
        next: (res) => {
          if(res.success) msg.status = 'okundu';
        }
      });
    }
  }

  closeDetail() {
    this.selectedMessage = null;
    this.replyText = '';
  }

  markAsReplied() {
    if (!this.selectedMessage || !this.selectedMessage.id) return;

    this.contactService.updateContactStatus(this.selectedMessage.id, 'cevaplandi', this.replyText).subscribe({
      next: (res) => {
        if(res.success) {
          this.alertService.showSuccess('Cevap başarıyla kaydedildi ve durum güncellendi.');
          if(this.selectedMessage) {
            this.selectedMessage.status = 'cevaplandi';
            this.selectedMessage.reply_message = this.replyText;
          }
          this.closeDetail();
        } else {
          this.alertService.showError('Durum güncellenemedi.');
        }
      },
      error: () => this.alertService.showError('Bir hata oluştu.')
    });
  }

  executeBulkStatus(status: string) {
    const selectedIds = this.contacts.filter(c => c.selected).map(c => c.id).filter(id => id !== undefined) as number[];
    if (selectedIds.length === 0) return;

    // For simplicity, we loop through updates if backend doesn't support bulk.
    // Ideally we should update the backend to support bulk status updates.
    let completed = 0;
    selectedIds.forEach(id => {
      this.contactService.updateContactStatus(id, status).subscribe({
        next: (res) => {
          if(res.success) {
            const item = this.contacts.find(c => c.id === id);
            if(item) { item.status = status; item.selected = false; }
          }
          completed++;
          if (completed === selectedIds.length) {
            this.alertService.showSuccess('Seçili mesajların durumu güncellendi.');
          }
        },
        error: () => {
          completed++;
          if (completed === selectedIds.length) {
            this.alertService.showError('Bazı mesajlar güncellenirken hata oluştu.');
          }
        }
      });
    });
  }
}
