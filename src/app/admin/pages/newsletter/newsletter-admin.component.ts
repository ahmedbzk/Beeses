import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { NewsletterService, NewsletterSubscriber, NewsletterLog } from '../../../services/newsletter.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-newsletter-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6">

      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-beeses-gold/10 flex items-center justify-center shrink-0">
            <lucide-icon name="users" class="w-6 h-6 text-beeses-gold"></lucide-icon>
          </div>
          <div>
            <p class="text-2xl font-black text-beeses-dark">{{ subscribers.length }}</p>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Toplam Abone</p>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <lucide-icon name="send" class="w-6 h-6 text-green-500"></lucide-icon>
          </div>
          <div>
            <p class="text-2xl font-black text-beeses-dark">{{ logs.length }}</p>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Toplam Kampanya</p>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <lucide-icon name="mail" class="w-6 h-6 text-blue-500"></lucide-icon>
          </div>
          <div>
            <p class="text-2xl font-black text-beeses-dark">{{ getTotalSent() }}</p>
            <p class="text-xs text-gray-400 font-medium uppercase tracking-wider">Toplam Gönderilen</p>
          </div>
        </div>
      </div>

      
      <div class="grid grid-cols-1 xl:grid-cols-5 gap-6">

        
        <div class="xl:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 class="text-base font-bold text-beeses-dark flex items-center gap-2">
              <lucide-icon name="users" class="w-5 h-5 text-beeses-gold"></lucide-icon>
              Abone Listesi
            </h2>
            <button (click)="loadSubscribers()" class="flex items-center gap-1.5 text-sm text-gray-400 hover:text-beeses-gold transition-colors font-medium">
              <lucide-icon name="refresh-cw" class="w-4 h-4"></lucide-icon>
              Yenile
            </button>
          </div>

          
          <div class="px-6 py-4 border-b border-gray-100">
            <div class="relative">
              <lucide-icon name="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-icon>
              <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="subPage = 1" placeholder="E-posta ile ara..."
                     class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-beeses-gold/30 focus:border-beeses-gold transition-all">
            </div>
          </div>

          
          <div *ngIf="isLoadingSubscribers" class="p-12 text-center">
            <lucide-icon name="loader" class="w-8 h-8 animate-spin mx-auto mb-2 text-beeses-gold"></lucide-icon>
            <p class="text-sm text-gray-400">Aboneler yükleniyor...</p>
          </div>

          
          <div *ngIf="!isLoadingSubscribers" class="overflow-x-auto flex-1">
            <table class="w-full text-sm text-left">
              <thead class="bg-beeses-dark text-beeses-gold text-[10px] font-bold uppercase tracking-[0.15em]">
                <tr>
                  <th class="px-6 py-4">#</th>
                  <th class="px-6 py-4">E-posta Adresi</th>
                  <th class="px-6 py-4 whitespace-nowrap">Abone Tarihi</th>
                  <th class="px-6 py-4 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr *ngFor="let sub of pagedSubscribers; let i = index"
                    class="hover:bg-beeses-gold/5 transition-colors"
                    [ngClass]="i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'">
                  <td class="px-6 py-3.5 text-gray-400 text-xs font-bold">
                    {{ (subPage - 1) * subPageSize + i + 1 }}
                  </td>
                  <td class="px-6 py-3.5">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-beeses-gold/10 flex items-center justify-center shrink-0">
                        <lucide-icon name="mail" class="w-4 h-4 text-beeses-gold"></lucide-icon>
                      </div>
                      <span class="font-medium text-beeses-dark text-sm">{{ sub.email }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-3.5 whitespace-nowrap text-gray-500 text-xs">
                    {{ sub.subscribed_at | date:'dd.MM.yyyy HH:mm' }}
                  </td>
                  <td class="px-6 py-3.5 text-center">
                    <button (click)="askDeleteSubscriber(sub)"
                            class="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 border border-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all">
                      <lucide-icon name="trash" class="w-3.5 h-3.5"></lucide-icon>
                      Sil
                    </button>
                  </td>
                </tr>
                <tr *ngIf="filteredSubscribers.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center text-gray-400">
                    <lucide-icon name="users" class="w-8 h-8 mx-auto mb-2 text-gray-200"></lucide-icon>
                    <p class="text-sm">Abone bulunamadı.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          
          <div *ngIf="!isLoadingSubscribers && filteredSubscribers.length > 0"
               class="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4 flex-wrap">
            <p class="text-xs text-gray-400">
              Toplam <span class="font-bold text-beeses-dark">{{ filteredSubscribers.length }}</span> aboneden
              <span class="font-bold text-beeses-dark">{{ (subPage - 1) * subPageSize + 1 }}</span> –
              <span class="font-bold text-beeses-dark">{{ Math.min(subPage * subPageSize, filteredSubscribers.length) }}</span> arası
            </p>
            <div class="flex items-center gap-1">
              <button (click)="subPage = subPage - 1" [disabled]="subPage === 1"
                      class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-beeses-gold hover:border-beeses-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold">
                <lucide-icon name="chevron-left" class="w-4 h-4"></lucide-icon>
              </button>
              <button *ngFor="let p of subPages()" (click)="subPage = p"
                      class="w-8 h-8 rounded-lg border text-xs font-bold transition-all"
                      [ngClass]="subPage === p ? 'bg-beeses-gold text-white border-beeses-gold shadow-sm' : 'border-gray-200 text-gray-600 hover:border-beeses-gold hover:text-beeses-gold'">
                {{ p }}
              </button>
              <button (click)="subPage = subPage + 1" [disabled]="subPage === subTotalPages()"
                      class="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-beeses-gold hover:border-beeses-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm font-bold">
                <lucide-icon name="chevron-right" class="w-4 h-4"></lucide-icon>
              </button>
            </div>
          </div>
        </div>

        
        <div class="xl:col-span-2 space-y-5">

          
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 class="text-base font-bold text-beeses-dark flex items-center gap-2">
                <lucide-icon name="send" class="w-5 h-5 text-beeses-gold"></lucide-icon>
                Toplu E-posta Gönder
              </h2>
              <p class="text-xs text-gray-400 mt-1">Tüm aktif abonelere e-posta gönderilecektir.</p>
            </div>

            <div class="p-6 space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-posta Konusu</label>
                <input type="text" [(ngModel)]="mailSubject" placeholder="Örn: Yeni Ürünlerimiz Geldi!"
                       class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-beeses-gold/30 focus:border-beeses-gold transition-all bg-gray-50">
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-posta İçeriği</label>
                <textarea [(ngModel)]="mailBody" rows="6" placeholder="E-posta içeriğini buraya yazın..."
                          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-beeses-gold/30 focus:border-beeses-gold transition-all resize-none bg-gray-50"></textarea>
              </div>
              <div class="bg-beeses-gold/5 border border-beeses-gold/20 rounded-xl p-4 flex items-start gap-3">
                <lucide-icon name="info" class="w-4 h-4 text-beeses-gold shrink-0 mt-0.5"></lucide-icon>
                <p class="text-xs text-gray-500 leading-relaxed">
                  Bu e-posta <strong class="text-beeses-dark">{{ subscribers.length }} aktif aboneye</strong> gönderilecektir.
                </p>
              </div>
              <button (click)="sendNewsletter()"
                      [disabled]="isSending || !mailSubject || !mailBody || subscribers.length === 0"
                      class="w-full flex items-center justify-center gap-2 bg-beeses-dark hover:bg-beeses-gold text-beeses-gold hover:text-beeses-dark font-bold text-sm tracking-wider uppercase px-6 py-3.5 rounded-xl transition-all duration-300 border border-beeses-gold/30 hover:border-beeses-gold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                <lucide-icon *ngIf="!isSending" name="send" class="w-4 h-4"></lucide-icon>
                <lucide-icon *ngIf="isSending" name="loader" class="w-4 h-4 animate-spin"></lucide-icon>
                {{ isSending ? 'Gönderiliyor...' : 'Toplu E-posta Gönder' }}
              </button>
            </div>
          </div>

          
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h2 class="text-sm font-bold text-beeses-dark flex items-center gap-2">
                <lucide-icon name="clock" class="w-4 h-4 text-beeses-gold"></lucide-icon>
                Gönderim Geçmişi
              </h2>
              <button (click)="loadLogs()" class="text-xs text-gray-400 hover:text-beeses-gold transition-colors font-medium flex items-center gap-1">
                <lucide-icon name="refresh-cw" class="w-3.5 h-3.5"></lucide-icon>
                Yenile
              </button>
            </div>

            
            <div *ngIf="isLoadingLogs" class="p-8 text-center">
              <lucide-icon name="loader" class="w-6 h-6 animate-spin mx-auto text-beeses-gold"></lucide-icon>
            </div>

            
            <div *ngIf="!isLoadingLogs" class="divide-y divide-gray-100">
              <div *ngFor="let log of pagedLogs" class="px-5 py-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-bold text-beeses-dark truncate">{{ log.subject }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ log.sent_at | date:'dd.MM.yyyy HH:mm' }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ log.recipients_count }} alıcı</p>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold">
                      <lucide-icon name="check" class="w-3 h-3"></lucide-icon>
                      {{ log.sent_count }}
                    </span>
                    <span *ngIf="log.failed_count > 0" class="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-500 rounded-full text-[10px] font-bold">
                      <lucide-icon name="x" class="w-3 h-3"></lucide-icon>
                      {{ log.failed_count }}
                    </span>
                  </div>
                </div>
              </div>
              <div *ngIf="logs.length === 0" class="p-8 text-center text-gray-400">
                <lucide-icon name="clock" class="w-8 h-8 mx-auto mb-2 text-gray-200"></lucide-icon>
                <p class="text-sm">Henüz gönderim yapılmadı.</p>
              </div>
            </div>

            
            <div *ngIf="!isLoadingLogs && logs.length > 0"
                 class="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3 flex-wrap">
              <p class="text-xs text-gray-400">
                <span class="font-bold text-beeses-dark">{{ logs.length }}</span> kampanyadan
                <span class="font-bold text-beeses-dark">{{ (logPage - 1) * logPageSize + 1 }}</span>–<span class="font-bold text-beeses-dark">{{ Math.min(logPage * logPageSize, logs.length) }}</span>
              </p>
              <div class="flex items-center gap-1">
                <button (click)="logPage = logPage - 1" [disabled]="logPage === 1"
                        class="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-beeses-gold hover:border-beeses-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <lucide-icon name="chevron-left" class="w-3.5 h-3.5"></lucide-icon>
                </button>
                <button *ngFor="let p of logPages()" (click)="logPage = p"
                        class="w-7 h-7 rounded-lg border text-xs font-bold transition-all"
                        [ngClass]="logPage === p ? 'bg-beeses-gold text-white border-beeses-gold' : 'border-gray-200 text-gray-600 hover:border-beeses-gold hover:text-beeses-gold'">
                  {{ p }}
                </button>
                <button (click)="logPage = logPage + 1" [disabled]="logPage === logTotalPages()"
                        class="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-beeses-gold hover:border-beeses-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <lucide-icon name="chevron-right" class="w-3.5 h-3.5"></lucide-icon>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    
    <div *ngIf="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div class="p-6 text-center">
          <div class="w-16 h-16 rounded-full bg-beeses-gold/10 flex items-center justify-center mx-auto mb-4">
            <lucide-icon name="send" class="w-8 h-8 text-beeses-gold"></lucide-icon>
          </div>
          <h3 class="text-lg font-black text-beeses-dark mb-2">Toplu E-posta Gönder</h3>
          <p class="text-sm text-gray-500 mb-1">
            <strong class="text-beeses-dark">{{ subscribers.length }} aktif aboneye</strong> e-posta gönderilecek.
          </p>
          <p class="text-sm font-bold text-beeses-dark bg-gray-50 rounded-xl p-3 mt-3 border border-gray-100">
            "{{ mailSubject }}"
          </p>
        </div>
        <div class="px-6 pb-6 flex gap-3">
          <button (click)="showConfirm = false" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm transition-colors">İptal</button>
          <button (click)="confirmSend()" class="flex-1 py-3 rounded-xl bg-beeses-gold text-beeses-dark font-black text-sm hover:bg-yellow-500 transition-colors">Gönder</button>
        </div>
      </div>
    </div>

    
    <div *ngIf="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div class="p-6 text-center">
          <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <lucide-icon name="trash" class="w-8 h-8 text-red-500"></lucide-icon>
          </div>
          <h3 class="text-lg font-black text-beeses-dark mb-2">Abonenin Silinmesi</h3>
          <p class="text-sm text-gray-500 mb-3">Bu işlem geri alınamaz. Aşağıdaki e-posta adresi bülten listenizden kaldırılacak:</p>
          <p class="text-sm font-bold text-red-500 bg-red-50 rounded-xl p-3 border border-red-100 break-all">
            {{ subscriberToDelete?.email }}
          </p>
        </div>
        <div class="px-6 pb-6 flex gap-3">
          <button (click)="showDeleteConfirm = false; subscriberToDelete = null"
                  class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm transition-colors">Vazgeç</button>
          <button (click)="confirmDelete()"
                  class="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
            <lucide-icon name="trash" class="w-4 h-4"></lucide-icon>
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  `
})
export class NewsletterAdminComponent implements OnInit {
  private newsletterService = inject(NewsletterService);
  private alertService = inject(AlertService);

  subscribers: NewsletterSubscriber[] = [];
  logs: NewsletterLog[] = [];

  isLoadingSubscribers = true;
  isLoadingLogs = true;
  isSending = false;
  showConfirm = false;
  showDeleteConfirm = false;
  subscriberToDelete: NewsletterSubscriber | null = null;

  searchQuery = '';
  mailSubject = '';
  mailBody = '';

  subPage = 1;
  subPageSize = 10;

  logPage = 1;
  logPageSize = 8;

  Math = Math;

  get filteredSubscribers() {
    if (!this.searchQuery.trim()) return this.subscribers;
    const q = this.searchQuery.toLowerCase();
    return this.subscribers.filter(s => s.email.toLowerCase().includes(q));
  }

  get pagedSubscribers() {
    const start = (this.subPage - 1) * this.subPageSize;
    return this.filteredSubscribers.slice(start, start + this.subPageSize);
  }

  subTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredSubscribers.length / this.subPageSize));
  }

  subPages(): number[] {
    const total = this.subTotalPages();
    const current = this.subPage;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push(-2);
        pages.push(total);
      }
    }
    return pages;
  }

  get pagedLogs() {
    const start = (this.logPage - 1) * this.logPageSize;
    return this.logs.slice(start, start + this.logPageSize);
  }

  logTotalPages(): number {
    return Math.max(1, Math.ceil(this.logs.length / this.logPageSize));
  }

  logPages(): number[] {
    const total = this.logTotalPages();
    const pages: number[] = [];
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  getTotalSent(): number {
    return this.logs.reduce((sum, l) => sum + (l.sent_count || 0), 0);
  }

  ngOnInit() {
    this.loadSubscribers();
    this.loadLogs();
  }

  loadSubscribers() {
    this.isLoadingSubscribers = true;
    this.newsletterService.getSubscribers().subscribe({
      next: (res) => {
        if (res.success) this.subscribers = res.data;
        this.isLoadingSubscribers = false;
      },
      error: () => {
        this.isLoadingSubscribers = false;
        this.alertService.showError('Aboneler yüklenirken hata oluştu.');
      }
    });
  }

  loadLogs() {
    this.isLoadingLogs = true;
    this.newsletterService.getLogs().subscribe({
      next: (res) => {
        if (res.success) this.logs = res.data;
        this.isLoadingLogs = false;
      },
      error: () => {
        this.isLoadingLogs = false;
      }
    });
  }

  askDeleteSubscriber(sub: NewsletterSubscriber) {
    this.subscriberToDelete = sub;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.subscriberToDelete?.id) return;
    const sub = this.subscriberToDelete;
    this.showDeleteConfirm = false;
    this.subscriberToDelete = null;

    this.newsletterService.unsubscribe(sub.id!).subscribe({
      next: (res) => {
        if (res.success) {
          this.subscribers = this.subscribers.filter(s => s.id !== sub.id);
          if (this.pagedSubscribers.length === 0 && this.subPage > 1) this.subPage--;
          this.alertService.showSuccess('Abone başarıyla silindi.');
        } else {
          this.alertService.showError(res.message || 'Silinemedi.');
        }
      },
      error: () => this.alertService.showError('Bir hata oluştu.')
    });
  }

  sendNewsletter() {
    if (!this.mailSubject || !this.mailBody || this.isSending) return;
    this.showConfirm = true;
  }

  confirmSend() {
    this.showConfirm = false;
    this.isSending = true;

    this.newsletterService.sendNewsletter(this.mailSubject, this.mailBody).subscribe({
      next: (res) => {
        this.isSending = false;
        if (res.success) {
          this.alertService.showSuccess(res.message || 'E-postalar başarıyla gönderildi.');
          this.mailSubject = '';
          this.mailBody = '';
          this.logPage = 1;
          this.loadLogs();
        } else {
          this.alertService.showError(res.message || 'Gönderilemedi.');
        }
      },
      error: () => {
        this.isSending = false;
        this.alertService.showError('Sunucu hatası oluştu.');
      }
    });
  }
}

