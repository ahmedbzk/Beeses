import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { DistributorService } from '../../../services/distributor.service';
import { NewsService } from '../../../services/news.service';
import { ContactService } from '../../../services/contact.service';
import { environment } from '../../../../environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <div class="space-y-8 animate-fade-in pb-8">
      
      <!-- Welcome Banner -->
      <div class="bg-gradient-to-r from-beeses-dark to-slate-900 rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_15px_30px_rgba(0,0,0,0.05)] border border-white/5">
        <div class="relative z-10 flex-1">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-beeses-gold/15 text-beeses-gold font-bold text-xs uppercase tracking-widest mb-4">
            <lucide-icon name="award" class="w-4 h-4"></lucide-icon> Yönetim Merkezi
          </div>
          <h2 class="text-3xl md:text-4xl font-light text-white mb-4 tracking-tight leading-tight">
            Hoş Geldiniz, <span class="text-beeses-gold font-bold">{{ adminUsername }}</span>
          </h2>
          <p class="text-white/60 text-sm md:text-base max-w-xl leading-relaxed font-light">
            Beeses Audio platformunun verilerini, garanti onaylarını, distribütör listesini ve gelen müşteri mesajlarını bu ekrandan gerçek zamanlı takip edebilirsiniz.
          </p>
        </div>
        
        <!-- Animated Decoration -->
        <div class="relative z-10 hidden md:block">
          <div class="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center relative border border-white/5 backdrop-blur-sm">
            <div class="absolute inset-2 border border-beeses-gold/30 rounded-full animate-[spin_12s_linear_infinite]"></div>
            <lucide-icon name="cpu" class="w-12 h-12 text-beeses-gold/80"></lucide-icon>
          </div>
        </div>
        <div class="absolute -right-20 -top-20 w-96 h-96 bg-beeses-gold/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <lucide-icon name="refresh-cw" class="w-10 h-10 animate-spin text-beeses-gold mb-3"></lucide-icon>
        <p class="text-gray-500 font-medium text-sm tracking-widest uppercase animate-pulse">İstatistikler Yükleniyor...</p>
      </div>

      <div *ngIf="!isLoading" class="space-y-8">
        <!-- KPI Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Garanti Stat Card -->
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <lucide-icon name="shield-check" class="w-6 h-6"></lucide-icon>
              </div>
              <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                {{ warrantiesApproved }} Onaylı
              </span>
            </div>
            <div>
              <p class="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Garanti Başvuruları</p>
              <h3 class="text-3xl font-black text-beeses-dark tracking-tight">{{ warrantiesCount }} <span class="text-xs text-gray-400 font-medium ml-1">kayıt</span></h3>
            </div>
          </div>

          <!-- Mesajlar Stat Card -->
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <lucide-icon name="mail" class="w-6 h-6"></lucide-icon>
              </div>
              <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                Yeni Mesajlar
              </span>
            </div>
            <div>
              <p class="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Gelen Mesajlar</p>
              <h3 class="text-3xl font-black text-beeses-dark tracking-tight">{{ contactsCount }} <span class="text-xs text-gray-400 font-medium ml-1">mesaj</span></h3>
            </div>
          </div>

          <!-- Distribütör Stat Card -->
          <div routerLink="/admin/dashboard/distributors" class="cursor-pointer bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <lucide-icon name="globe" class="w-6 h-6"></lucide-icon>
              </div>
              <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                Aktif Bayiler
              </span>
            </div>
            <div>
              <p class="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Distribütörler</p>
              <h3 class="text-3xl font-black text-beeses-dark tracking-tight">{{ distributorsCount }} <span class="text-xs text-gray-400 font-medium ml-1">nokta</span></h3>
            </div>
          </div>

          <!-- Haberler Stat Card -->
          <div class="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <lucide-icon name="file-text" class="w-6 h-6"></lucide-icon>
              </div>
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                Duyurular
              </span>
            </div>
            <div>
              <p class="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Haber & Etkinlikler</p>
              <h3 class="text-3xl font-black text-beeses-dark tracking-tight">{{ newsCount }} <span class="text-xs text-gray-400 font-medium ml-1">içerik</span></h3>
            </div>
          </div>

        </div>

        <!-- Charts Layout (Donut & Progress Bars) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- SVG Donut Chart (Garanti Dağılımı) -->
          <div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-base font-bold text-beeses-dark tracking-tight mb-2">Garanti Başvurusu Dağılımı</h3>
              <p class="text-xs text-gray-400 mb-6">Müşterilerin oluşturduğu garanti taleplerinin onay, red ve bekleme durumları</p>
            </div>
            
            <div class="py-4 relative flex items-center justify-center">
              <!-- SVG Donut -->
              <svg width="100%" height="180px" viewBox="0 0 42 42" class="donut max-w-[180px] mx-auto rotate-[-90deg]">
                <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>
                <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" stroke-width="2.8"></circle>
                
                <ng-container *ngIf="warrantiesCount > 0">
                  <!-- Approved Segment (Green) -->
                  <circle *ngIf="warrantiesApproved > 0" class="donut-segment text-emerald-500" cx="21" cy="21" r="15.91549430918954" fill="transparent" 
                          stroke="currentColor" stroke-width="2.8" 
                          [attr.stroke-dasharray]="(warrantiesApproved / warrantiesCount * 100) + ' ' + (100 - (warrantiesApproved / warrantiesCount * 100))"
                          stroke-dashoffset="0"></circle>
                  
                  <!-- Pending Segment (Gold) -->
                  <circle *ngIf="warrantiesPending > 0" class="donut-segment text-[#b58131]" cx="21" cy="21" r="15.91549430918954" fill="transparent" 
                          stroke="currentColor" stroke-width="2.8" 
                          [attr.stroke-dasharray]="(warrantiesPending / warrantiesCount * 100) + ' ' + (100 - (warrantiesPending / warrantiesCount * 100))"
                          [attr.stroke-dashoffset]="- (warrantiesApproved / warrantiesCount * 100)"></circle>
                          
                  <!-- Rejected Segment (Red) -->
                  <circle *ngIf="warrantiesRejected > 0" class="donut-segment text-red-500" cx="21" cy="21" r="15.91549430918954" fill="transparent" 
                          stroke="currentColor" stroke-width="2.8" 
                          [attr.stroke-dasharray]="(warrantiesRejected / warrantiesCount * 100) + ' ' + (100 - (warrantiesRejected / warrantiesCount * 100))"
                          [attr.stroke-dashoffset]="- ((warrantiesApproved + warrantiesPending) / warrantiesCount * 100)"></circle>
                </ng-container>
              </svg>
              
              <!-- Text Centered inside Donut (rotated back to 0deg) -->
              <div class="absolute flex flex-col items-center justify-center">
                <span class="text-3xl font-black text-beeses-dark leading-none">{{ warrantiesCount }}</span>
                <span class="text-[9px] font-bold text-gray-400 tracking-widest uppercase mt-1">Başvuru</span>
              </div>
            </div>

            <!-- Legends -->
            <div class="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-50 text-center">
              <div>
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>
                <span class="text-xs font-bold text-gray-700">Onaylı</span>
                <p class="text-sm font-black text-beeses-dark mt-0.5">{{ warrantiesApproved }} <span class="text-[9px] text-gray-400 font-medium">({{ donutApprovedPct }}%)</span></p>
              </div>
              <div>
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-beeses-gold mr-1.5"></span>
                <span class="text-xs font-bold text-gray-700">Bekleyen</span>
                <p class="text-sm font-black text-beeses-dark mt-0.5">{{ warrantiesPending }} <span class="text-[9px] text-gray-400 font-medium">({{ donutPendingPct }}%)</span></p>
              </div>
              <div>
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></span>
                <span class="text-xs font-bold text-gray-700">Reddedilen</span>
                <p class="text-sm font-black text-beeses-dark mt-0.5">{{ warrantiesRejected }} <span class="text-[9px] text-gray-400 font-medium">({{ donutRejectedPct }}%)</span></p>
              </div>
            </div>
          </div>

          <!-- Distributor Countries distribution -->
          <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 class="text-base font-bold text-beeses-dark tracking-tight mb-2">Distribütör Dağılımı</h3>
              <p class="text-xs text-gray-400 mb-6">Distribütörlerin ülkelere göre dağılım yüzdeleri ve adetleri</p>
            </div>
            
            <div class="space-y-5 flex-grow flex flex-col justify-center">
              <div *ngFor="let item of topCountries" class="space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="font-bold text-gray-700 uppercase tracking-wide">{{ item.country }}</span>
                  <span class="font-bold text-beeses-dark">{{ item.count }} Distribütör <span class="text-gray-400 font-medium ml-1">({{ item.percentage }}%)</span></span>
                </div>
                <!-- Progress bar container -->
                <div class="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100 relative">
                  <!-- Progress bar fill -->
                  <div class="h-full bg-gradient-to-r from-beeses-gold/60 to-beeses-gold rounded-full transition-all duration-1000" [style.width.%]="item.percentage"></div>
                </div>
              </div>
              
              <div *ngIf="topCountries.length === 0" class="text-center text-gray-400 text-sm py-8">
                Henüz distribütör verisi bulunmuyor.
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
              <span>* Sadece en yoğun ilk 4 ülke listelenmiştir.</span>
            </div>
          </div>

        </div>

        <!-- Recent Activities Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          <!-- Recent Warranties -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
              <h3 class="text-base font-bold text-beeses-dark tracking-tight flex items-center gap-2">
                <lucide-icon name="shield-check" class="w-5 h-5 text-emerald-500"></lucide-icon>
                Son Garanti Başvuruları
              </h3>
              <a routerLink="/admin/dashboard/warranties" class="text-xs text-beeses-gold font-bold hover:underline">Tümü &rarr;</a>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-gray-600">
                <thead>
                  <tr class="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                    <th class="py-2.5">Müşteri</th>
                    <th class="py-2.5">Ürün</th>
                    <th class="py-2.5">Seri No</th>
                    <th class="py-2.5 text-center">Durum</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr *ngFor="let item of latestWarranties" class="hover:bg-gray-50/50">
                    <td class="py-3 pr-2">
                      <div class="font-bold text-beeses-dark">{{ item.full_name }}</div>
                      <div class="text-[10px] text-gray-400">{{ item.country }}</div>
                    </td>
                    <td class="py-3 font-bold text-beeses-dark pr-2">{{ item.product_name }}</td>
                    <td class="py-3 font-mono text-gray-400 pr-2">{{ item.serial_number }}</td>
                    <td class="py-3 text-center">
                      <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                            [ngClass]="{
                              'bg-yellow-50 text-yellow-600 border border-yellow-200': item.status === 'pending',
                              'bg-green-50 text-green-600 border border-green-200': item.status === 'approved',
                              'bg-red-50 text-red-600 border border-red-200': item.status === 'rejected'
                            }">
                        {{ item.status === 'pending' ? 'Bekliyor' : (item.status === 'approved' ? 'Onaylı' : 'Red') }}
                      </span>
                    </td>
                  </tr>
                  <tr *ngIf="latestWarranties.length === 0">
                    <td colspan="4" class="py-8 text-center text-gray-400">
                      Henüz garanti başvurusu bulunmuyor.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Contacts -->
          <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
              <h3 class="text-base font-bold text-beeses-dark tracking-tight flex items-center gap-2">
                <lucide-icon name="mail" class="w-5 h-5 text-blue-500"></lucide-icon>
                Son Gelen Mesajlar
              </h3>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-gray-600">
                <thead>
                  <tr class="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                    <th class="py-2.5">Gönderen</th>
                    <th class="py-2.5">Konu</th>
                    <th class="py-2.5">Tarih</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr *ngFor="let item of latestContacts" class="hover:bg-gray-50/50">
                    <td class="py-3 pr-2">
                      <div class="font-bold text-beeses-dark">{{ item.first_name }} {{ item.last_name }}</div>
                      <div class="text-[10px] text-gray-400">{{ item.email }}</div>
                    </td>
                    <td class="py-3 text-beeses-dark pr-2 font-medium line-clamp-1 max-w-[150px] mt-1">{{ item.subject }}</td>
                    <td class="py-3 text-gray-400 whitespace-nowrap">{{ item.created_at | date:'dd.MM.yyyy HH:mm' }}</td>
                  </tr>
                  <tr *ngIf="latestContacts.length === 0">
                    <td colspan="3" class="py-8 text-center text-gray-400">
                      Henüz gelen mesaj bulunmuyor.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  `,
  styles: [`
    .donut-segment {
      transition: stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke-width 0.3s ease;
      cursor: pointer;
    }
    .donut-segment:hover {
      stroke-width: 3.5;
    }
  `]
})
export class DashboardHomeComponent implements OnInit {
  private http = inject(HttpClient);
  private distributorService = inject(DistributorService);
  private newsService = inject(NewsService);
  private contactService = inject(ContactService);

  isLoading = true;
  adminUsername = 'Yönetici';

  // Stats counters
  warrantiesCount = 0;
  warrantiesPending = 0;
  warrantiesApproved = 0;
  warrantiesRejected = 0;

  contactsCount = 0;
  distributorsCount = 0;
  newsCount = 0;

  // Detail lists
  latestWarranties: any[] = [];
  latestContacts: any[] = [];
  topCountries: { country: string; count: number; percentage: number }[] = [];

  // SVG percentages
  donutApprovedPct = 0;
  donutPendingPct = 0;
  donutRejectedPct = 0;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.adminUsername = localStorage.getItem('admin_username') || 'Yönetici';
    }
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Fetch all counts and lists in parallel using forkJoin
    forkJoin({
      warranties: this.http.get<any>(`${environment.apiUrl}/warranty/get-warranties.php`),
      distributors: this.distributorService.getDistributors(),
      contacts: this.contactService.getContacts(),
      news: this.newsService.getNews()
    }).subscribe({
      next: (res: any) => {
        // 1. Process Warranties
        if (res.warranties && res.warranties.success) {
          const wList = res.warranties.data || [];
          this.warrantiesCount = wList.length;
          this.warrantiesPending = wList.filter((w: any) => w.status === 'pending').length;
          this.warrantiesApproved = wList.filter((w: any) => w.status === 'approved').length;
          this.warrantiesRejected = wList.filter((w: any) => w.status === 'rejected').length;
          this.latestWarranties = wList.slice(0, 3);
          
          this.calculateDonutPercentages();
        }

        // 2. Process Distributors
        if (res.distributors && res.distributors.success) {
          const dList = res.distributors.data || [];
          this.distributorsCount = dList.length;

          // Group by country to calculate distributions
          const countryCounts: { [key: string]: number } = {};
          dList.forEach((d: any) => {
            if (d.country) {
              const countryKey = d.country.toUpperCase();
              countryCounts[countryKey] = (countryCounts[countryKey] || 0) + 1;
            }
          });

          const totalDist = this.distributorsCount || 1;
          const countries = Object.keys(countryCounts).map(country => ({
            country,
            count: countryCounts[country],
            percentage: Math.round((countryCounts[country] / totalDist) * 100)
          })).sort((a, b) => b.count - a.count);

          this.topCountries = countries.slice(0, 4);
        }

        // 3. Process Contacts
        if (res.contacts && res.contacts.success) {
          const cList = res.contacts.data || [];
          this.contactsCount = cList.length;
          this.latestContacts = cList.slice(0, 3);
        }

        // 4. Process News
        if (res.news && res.news.success) {
          const nList = res.news.data || [];
          this.newsCount = nList.length;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard statistics:', err);
        this.isLoading = false;
      }
    });
  }

  private calculateDonutPercentages() {
    if (this.warrantiesCount === 0) return;
    this.donutApprovedPct = Math.round((this.warrantiesApproved / this.warrantiesCount) * 100);
    this.donutPendingPct = Math.round((this.warrantiesPending / this.warrantiesCount) * 100);
    this.donutRejectedPct = Math.round((this.warrantiesRejected / this.warrantiesCount) * 100);
  }
}
