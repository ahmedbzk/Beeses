import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <!-- Client-side Rendered Dashboard -->
    <div *ngIf="isBrowser" class="flex h-screen bg-[#f8f9fa] relative overflow-hidden w-full">
      <!-- Mobile Sidebar Overlay -->
      <div *ngIf="isMobileMenuOpen" (click)="toggleMobileMenu()" class="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm animate-fade-in"></div>

      <!-- Sidebar -->
      <aside class="fixed lg:relative inset-y-0 left-0 bg-beeses-dark text-white flex flex-col shadow-2xl z-40 transform lg:translate-x-0"
             [ngClass]="[
               isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
               isSidebarCollapsed ? 'lg:w-20 w-80' : 'w-80'
             ]">
        
        <!-- Logo Section with Toggle Button -->
        <div class="border-b border-white/10 flex items-center transition-all duration-500 relative p-6 justify-between h-24"
             [ngClass]="isSidebarCollapsed ? 'lg:p-4 lg:justify-center lg:h-16' : ''">
          
          <!-- Collapsed Mode Icon: Visible ONLY on Desktop when Collapsed -->
          <button *ngIf="isSidebarCollapsed" (click)="toggleSidebar()" 
                  class="hidden lg:flex items-center justify-center w-10 h-10 hover:bg-white/5 rounded-xl text-beeses-gold hover:text-white transition-all duration-300">
            <lucide-icon name="chevron-right" class="w-5 h-5"></lucide-icon>
          </button>

          <!-- Logo & Subtitle & Toggle Button (Shown on mobile, or on desktop when expanded) -->
          <div class="flex items-center justify-between w-full"
               [ngClass]="isSidebarCollapsed ? 'lg:hidden' : ''">
            <div class="flex flex-col">
              <img src="assets/logo.png" alt="Beeses Logo" class="h-8 transition-all duration-500">
              <p class="text-[10px] font-bold tracking-[0.2em] text-beeses-gold uppercase mt-2">Yönetim Paneli</p>
            </div>
            
            <!-- Toggle Button inside Sidebar (Desktop Only, only when expanded) -->
            <button (click)="toggleSidebar()" 
                    class="hidden lg:flex items-center justify-center p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-beeses-gold transition-all duration-300">
              <lucide-icon name="chevron-left" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          <!-- Mobile Close Button (only on mobile) -->
          <button (click)="toggleMobileMenu()" class="lg:hidden text-gray-400 hover:text-white p-2 absolute right-4 top-1/2 -translate-y-1/2">
            <lucide-icon name="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-grow py-5 space-y-4 overflow-y-auto transition-all duration-500"
             [ngClass]="isSidebarCollapsed ? 'lg:px-2 px-3.5' : 'px-3.5'">
          <!-- Sidebar Menü -->
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

          <!-- KURUMSAL YÖNETİM -->
          <div class="space-y-1">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Kurumsal Yönetim</p>
            </div>
            <a routerLink="/admin/dashboard/news" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="file-text" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Haber Yönetimi
              </span>
            </a>
            <a (click)="$event.preventDefault()" 
               class="flex items-center rounded-xl text-white/30 font-medium text-sm transition-all border border-transparent cursor-not-allowed duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="award" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[120px] opacity-100'">
                Sertifikalar
              </span>
              <span class="text-[8px] bg-white/10 text-beeses-gold px-1.5 py-0.5 rounded-full font-bold ml-auto transition-all"
                    [ngClass]="isSidebarCollapsed ? 'lg:hidden' : 'inline-block'">KAPALI</span>
            </a>
            <a (click)="$event.preventDefault()" 
               class="flex items-center rounded-xl text-white/30 font-medium text-sm transition-all border border-transparent cursor-not-allowed duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="message-square" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[120px] opacity-100'">
                Sıkça Sorulan S.
              </span>
              <span class="text-[8px] bg-white/10 text-beeses-gold px-1.5 py-0.5 rounded-full font-bold ml-auto transition-all"
                    [ngClass]="isSidebarCollapsed ? 'lg:hidden' : 'inline-block'">KAPALI</span>
            </a>
          </div>

          <!-- MÜŞTERİ İLİŞKİLERİ -->
          <div class="space-y-1">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Müşteri İlişkileri</p>
            </div>
            <a (click)="$event.preventDefault()" 
               class="flex items-center rounded-xl text-white/30 font-medium text-sm transition-all border border-transparent cursor-not-allowed duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="mail" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[120px] opacity-100'">
                İletişim Formları
              </span>
              <span class="text-[8px] bg-white/10 text-beeses-gold px-1.5 py-0.5 rounded-full font-bold ml-auto transition-all"
                    [ngClass]="isSidebarCollapsed ? 'lg:hidden' : 'inline-block'">KAPALI</span>
            </a>
            <a routerLink="/admin/dashboard/warranties" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="shield-check" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Garanti Kayıtları
              </span>
            </a>
          </div>

          <!-- DİSTRİBÜTÖR YÖNETİMİ -->
          <div class="space-y-1">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Distribütör Yönetimi</p>
            </div>
            <a routerLink="/admin/dashboard/distributors" routerLinkActive="bg-white/10 text-beeses-gold border-white/10 shadow-sm" 
               class="flex items-center rounded-xl text-white/50 hover:text-white font-medium text-sm transition-all border border-transparent duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="globe" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Distribütör Listesi
              </span>
            </a>
          </div>

          <!-- ÜRÜN YÖNETİMİ -->
          <div class="space-y-1">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Ürün Yönetimi</p>
            </div>
            <a (click)="$event.preventDefault()" 
               class="flex items-center rounded-xl text-white/30 font-medium text-sm transition-all border border-transparent cursor-not-allowed duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="speaker" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[120px] opacity-100'">
                Ürün Kataloğu
              </span>
              <span class="text-[8px] bg-white/10 text-beeses-gold px-1.5 py-0.5 rounded-full font-bold ml-auto transition-all"
                    [ngClass]="isSidebarCollapsed ? 'lg:hidden' : 'inline-block'">KAPALI</span>
            </a>
          </div>

          <!-- BÜLTEN YÖNETİMİ -->
          <div class="space-y-1">
            <div class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                 [ngClass]="isSidebarCollapsed ? 'lg:max-h-0 lg:opacity-0 lg:mb-0 lg:pointer-events-none mb-1.5' : 'max-h-6 opacity-100 mb-1.5'">
              <p class="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-3.5">Bülten Yönetimi</p>
            </div>
            <a (click)="$event.preventDefault()"
               class="flex items-center rounded-xl text-white/30 font-medium text-sm transition-all border border-transparent cursor-not-allowed duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:p-2.5 lg:gap-0 px-3.5 py-2.5 gap-3' : 'px-3.5 py-2.5 gap-3'">
              <lucide-icon name="bell" class="w-5 h-5 shrink-0"></lucide-icon>
              <span class="transition-all duration-500 overflow-hidden whitespace-nowrap"
                    [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[200px] opacity-100'">
                Aboneler & Bülten
              </span>
              <span class="text-[8px] bg-white/10 text-beeses-gold px-1.5 py-0.5 rounded-full font-bold ml-auto transition-all"
                    [ngClass]="isSidebarCollapsed ? 'lg:hidden' : 'inline-block'">KAPALI</span>
            </a>
          </div>
        </nav>

        <!-- Profile & Logout -->
        <div class="border-t border-white/10 transition-all duration-500"
             [ngClass]="isSidebarCollapsed ? 'lg:p-2 p-4' : 'p-4'">
          <div class="flex items-center transition-all duration-500"
               [ngClass]="isSidebarCollapsed ? 'lg:justify-center lg:mb-0 lg:px-0 gap-3 mb-4 px-2' : 'gap-3 mb-4 px-2'">
            <div class="w-10 h-10 rounded-full bg-beeses-gold flex items-center justify-center text-beeses-dark font-black shrink-0">A</div>
            <div *ngIf="!isSidebarCollapsed" class="animate-fade-in overflow-hidden">
              <p class="text-xs font-bold text-white whitespace-nowrap">{{ adminUsername }}</p>
              <p class="text-[10px] text-white/50 whitespace-nowrap">Yönetici</p>
            </div>
          </div>
          <button (click)="logout()" class="w-full flex items-center justify-center transition-all duration-500 border border-red-500/20 gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold tracking-widest uppercase mt-0"
                  [ngClass]="isSidebarCollapsed ? 'lg:p-2.5 lg:rounded-xl lg:mt-2 lg:gap-0' : ''">
            <lucide-icon name="log-out" class="w-4 h-4 shrink-0"></lucide-icon>
            <span class="text-xs font-bold tracking-widest uppercase whitespace-nowrap"
                  [ngClass]="isSidebarCollapsed ? 'lg:max-w-0 lg:opacity-0 lg:pointer-events-none' : 'max-w-[120px] opacity-100'">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow flex flex-col h-screen overflow-hidden relative min-w-0">
        <!-- Top Header -->
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

        <!-- Dynamic Content (Warranties Table) -->
        <div class="flex-grow p-4 md:p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>

    <!-- Server-side / Hydration Loading Screen -->
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
      display: none;
    }
    aside nav {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class AdminLayoutComponent {
  private router = inject(Router);
  adminUsername = 'Admin';
  isMobileMenuOpen = false;
  isBrowser = false;
  isSidebarCollapsed = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isBrowser = true;
      this.adminUsername = localStorage.getItem('admin_username') || 'Admin';
      this.isSidebarCollapsed = localStorage.getItem('admin_sidebar_collapsed') === 'true';
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_sidebar_collapsed', String(this.isSidebarCollapsed));
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
    }
    this.router.navigate(['/admin/login']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
