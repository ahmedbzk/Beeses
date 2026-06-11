import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  template: `
    
    <div *ngIf="isBrowser" class="flex h-screen bg-[#f8f9fa] relative overflow-hidden w-full">
      
      <div *ngIf="isMobileMenuOpen" (click)="toggleMobileMenu()" class="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm animate-fade-in"></div>

      
      <aside class="fixed lg:relative inset-y-0 left-0 bg-beeses-dark text-white flex flex-col shadow-2xl z-40 transform lg:translate-x-0"
             [ngClass]="[
               isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
               isSidebarCollapsed ? 'lg:w-20 w-80' : 'w-80'
             ]">
        
        
        <div class="border-b border-white/10 flex items-center transition-all duration-500 relative p-6 justify-between h-24"
             [ngClass]="isSidebarCollapsed ? 'lg:p-4 lg:justify-center lg:h-16' : ''">
          
          
          <button *ngIf="isSidebarCollapsed" (click)="toggleSidebar()" 
                  class="hidden lg:flex items-center justify-center w-10 h-10 hover:bg-white/5 rounded-xl text-beeses-gold hover:text-white transition-all duration-300">
            <lucide-icon name="chevron-right" class="w-5 h-5"></lucide-icon>
          </button>

          
          <div class="flex items-center justify-between w-full"
               [ngClass]="isSidebarCollapsed ? 'lg:hidden' : ''">
            <div class="flex flex-col">
              <img src="assets/logo.png" alt="Beeses Logo" class="h-8 transition-all duration-500">
              <p class="text-[10px] font-bold tracking-[0.2em] text-beeses-gold uppercase mt-2">Yönetim Paneli</p>
            </div>
            
            
            <button (click)="toggleSidebar()" 
                    class="hidden lg:flex items-center justify-center p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-beeses-gold transition-all duration-300">
              <lucide-icon name="chevron-left" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          
          <button (click)="toggleMobileMenu()" class="lg:hidden text-gray-400 hover:text-white p-2 absolute right-4 top-1/2 -translate-y-1/2">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        
        <nav class="flex-grow py-5 space-y-4 overflow-y-auto transition-all duration-500"
             [ngClass]="isSidebarCollapsed ? 'lg:px-2 px-3.5' : 'px-3.5'">
          
          <div class="space-y-1">
            <a routerLink="/admin/dashboard" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" [routerLinkActiveOptions]="{exact: true}" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="layout-grid" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Ana Sayfa
              </span>
            </a>
          </div>

          
          <div class="space-y-1" *ngIf="hasPermission('news') || hasPermission('certificates') || hasPermission('faq')">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Kurumsal Yönetim</p>
            </div>
            <a routerLink="/admin/dashboard/news" *ngIf="hasPermission('news')" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="file-text" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Haber Yönetimi
              </span>
            </a>
            <a routerLink="/admin/dashboard/certificates" *ngIf="hasPermission('certificates')" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="award" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Sertifikalar
              </span>
            </a>
            <a routerLink="/admin/dashboard/faq" *ngIf="hasPermission('faq')" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="message-square" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Sıkça Sorulan S.
              </span>
            </a>
          </div>

          
          <div class="space-y-1" *ngIf="hasPermission('contacts') || hasPermission('warranties')">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Müşteri İlişkileri</p>
            </div>
            <a routerLink="/admin/dashboard/contacts" *ngIf="hasPermission('contacts')" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="mail" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                İletişim Formları
              </span>
            </a>
            <a routerLink="/admin/dashboard/warranties" *ngIf="hasPermission('warranties')" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="shield-check" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Garanti Kayıtları
              </span>
            </a>
          </div>

          
          <div class="space-y-1" *ngIf="hasPermission('distributors')">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Distribütör Yönetimi</p>
            </div>
            <a routerLink="/admin/dashboard/distributors" *ngIf="hasPermission('distributors')" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="globe" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Distribütör Listesi
              </span>
            </a>
          </div>

          
          <div class="space-y-1" *ngIf="hasPermission('products') || hasPermission('innovations')">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Ürün Yönetimi</p>
            </div>
            <a routerLink="/admin/dashboard/products" *ngIf="hasPermission('products')" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="speaker" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Ürün Kataloğu
              </span>
            </a>
            <a routerLink="/admin/dashboard/innovations" *ngIf="hasPermission('innovations')" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="flask-conical" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                İnovasyon & Gelecek
              </span>
            </a>
          </div>

          
          <div class="space-y-1" *ngIf="hasPermission('newsletter')">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Bülten Yönetimi</p>
            </div>
            <a routerLink="/admin/dashboard/newsletter" *ngIf="hasPermission('newsletter')" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="bell" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Aboneler & Bülten
              </span>
            </a>
          </div>

          <!-- Sistem Yönetimi (If has permission for admins) -->
          <div class="space-y-1" *ngIf="hasPermission('admins')">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Sistem Yönetimi</p>
            </div>
            <a routerLink="/admin/dashboard/admins" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="users" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Yöneticiler
              </span>
            </a>
          </div>
        </nav>

        
        <div class="border-t border-white/10 transition-all duration-500"
             [ngClass]="isSidebarCollapsed ? 'lg:p-2 p-4' : 'p-4'">
          <div class="flex items-center justify-between transition-all duration-500 mb-4"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:px-0 px-2' : 'px-2'">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-beeses-gold flex items-center justify-center text-beeses-dark font-black shrink-0">A</div>
              <div *ngIf="!isSidebarCollapsed" class="animate-fade-in overflow-hidden">
                 <p class="text-xs font-bold text-white whitespace-nowrap">{{ adminUsername }}</p>
                 <p class="text-[10px] text-white/50 whitespace-nowrap">{{ adminRole === 'superadmin' ? 'Süper Admin' : 'Yönetici' }}</p>
              </div>
            </div>
            <button *ngIf="!isSidebarCollapsed" (click)="openProfileModal()" class="text-white/50 hover:text-beeses-gold transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer">
              <lucide-icon name="settings" class="w-4 h-4"></lucide-icon>
            </button>
          </div>
          <button (click)="logout()" class="w-full flex items-center justify-center transition-all duration-500 border border-red-500/20 gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold tracking-widest uppercase mt-0"
                  [ngClass]="isSidebarCollapsed ? 'lg:p-2.5 lg:rounded-xl lg:mt-2 lg:gap-0' : ''">
            <lucide-icon name="log-out" class="w-4 h-4 shrink-0"></lucide-icon>
            <span class="text-xs font-bold tracking-widest uppercase whitespace-nowrap"
                  [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[120px] opacity-100'">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      
      <main class="flex-grow flex flex-col h-screen overflow-hidden relative min-w-0">
        
        <header class="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 shrink-0 justify-between">
          <div class="flex items-center gap-3">
            <button (click)="toggleMobileMenu()" class="lg:hidden p-2 -ml-2 text-gray-500 hover:text-beeses-gold transition-colors">
              <lucide-icon name="menu" class="w-6 h-6"></lucide-icon>
            </button>
            <h1 class="text-beeses-dark font-bold text-lg hidden sm:block">Hoş Geldiniz</h1>
          </div>
          <a routerLink="/" target="_blank" class="flex items-center gap-2 text-sm text-gray-500 hover:text-beeses-gold transition-colors font-medium">
            <lucide-icon name="external-link" class="w-4 h-4"></lucide-icon> Siteyi Görüntüle
          </a>
        </header>

        
        <div class="flex-grow p-4 md:p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>

    <!-- PROFILE UPDATE MODAL -->
    <div *ngIf="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-beeses-dark/70 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 class="text-lg font-bold text-beeses-dark flex items-center gap-2">
            <lucide-icon name="settings" class="w-5 h-5 text-beeses-gold"></lucide-icon>
            Profil Ayarları
          </h2>
          <button (click)="closeProfileModal()" class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-white cursor-pointer">
            <lucide-icon name="x" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Kullanıcı Adı</label>
            <input type="text" [(ngModel)]="profileData.username" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all text-beeses-dark" placeholder="Kullanıcı adınız">
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Yeni Şifre (Değiştirmek istemiyorsanız boş bırakın)</label>
            <input type="password" [(ngModel)]="profileData.password" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-beeses-gold focus:ring-1 focus:ring-beeses-gold transition-all text-beeses-dark" placeholder="••••••">
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button (click)="closeProfileModal()" class="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-bold transition-all cursor-pointer">
            İptal
          </button>
          <button (click)="saveProfile()" [disabled]="isSavingProfile" class="px-6 py-2 bg-beeses-gold hover:bg-beeses-dark disabled:bg-gray-300 text-white rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center gap-2">
            <span *ngIf="isSavingProfile" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Kaydet
          </button>
        </div>
      </div>
    </div>

    
    <div *ngIf="!isBrowser" class="h-screen w-screen flex flex-col items-center justify-center bg-beeses-dark">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beeses-gold mb-4"></div>
      <p class="text-white/60 text-xs font-medium tracking-widest uppercase animate-pulse">Yükleniyor...</p>
    </div>
  `,
  styles: [`
    aside {
      transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    aside nav::-webkit-scrollbar {
      width: 5px;
    }
    aside nav::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 10px;
    }
    aside nav::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.12);
      border-radius: 10px;
    }
    aside nav::-webkit-scrollbar-thumb:hover {
      background: rgba(181, 129, 49, 0.6);
    }
    aside nav {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
    }
  `]
})
export class AdminLayoutComponent implements OnDestroy {
  private router = inject(Router);
  private adminService = inject(AdminService);
  private alertService = inject(AlertService);
  private destroy$ = new Subject<void>();
  
  adminUsername = 'Admin';
  adminRole = 'admin';
  adminPermissions: any = {};
  isMobileMenuOpen = false;
  isBrowser = false;
  isSidebarCollapsed = false;

  showProfileModal = false;
  isSavingProfile = false;
  profileData = {
    username: '',
    password: ''
  };

  openProfileModal() {
    this.profileData = {
      username: this.adminUsername,
      password: ''
    };
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  saveProfile() {
    if (!this.profileData.username.trim()) {
      this.alertService.showError('Kullanıcı adı boş olamaz.');
      return;
    }

    this.isSavingProfile = true;
    this.adminService.updateProfile({
      username: this.profileData.username,
      password: this.profileData.password || undefined
    }).subscribe({
      next: (res) => {
        this.isSavingProfile = false;
        if (res.success) {
          this.alertService.showSuccess('Profiliniz başarıyla güncellendi.');
          this.adminUsername = res.username;
          if (typeof window !== 'undefined') {
            localStorage.setItem('admin_username', res.username);
          }
          this.closeProfileModal();
        } else {
          this.alertService.showError(res.message || 'Profil güncellenirken hata oluştu.');
        }
      },
      error: (err) => {
        this.isSavingProfile = false;
        this.alertService.showError(err.error?.message || 'Sunucu bağlantı hatası.');
      }
    });
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.isBrowser = true;
      this.adminUsername = localStorage.getItem('admin_username') || 'Admin';
      this.adminRole = localStorage.getItem('admin_role') || 'admin';
      this.isSidebarCollapsed = localStorage.getItem('admin_sidebar_collapsed') === 'true';

      const permsRaw = localStorage.getItem('admin_permissions');
      try {
        this.adminPermissions = JSON.parse(permsRaw || '{}');
      } catch (e) {
        this.adminPermissions = {};
      }

      // Sayfa görüntüleme artık loglanmıyor.
      // Sadece gerçek işlemler (ekleme/güncelleme/silme/giriş) loglanır.
    }
  }

  hasPermission(page: string): boolean {
    if (this.adminRole === 'superadmin') return true;
    return !!(this.adminPermissions[page] && this.adminPermissions[page].view === true);
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_sidebar_collapsed', String(this.isSidebarCollapsed));
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    // Cancel all subscriptions FIRST to prevent console errors after logout
    this.destroy$.next();
    this.isBrowser = false;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_role');
      localStorage.removeItem('admin_permissions');
      localStorage.removeItem('admin_id');
    }
    this.router.navigate(['/admin/login']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}

