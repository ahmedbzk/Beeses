import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    
    <div *ngIf="isBrowser" class="min-h-screen flex items-center justify-center bg-beeses-silver px-4 relative overflow-hidden">
      <div class="absolute inset-0 w-full h-full">
        <img src="assets/backgrounds/bg1.jpg" class="w-full h-full object-cover opacity-10 filter grayscale" />
      </div>

      <div class="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-gray-100">
        <div class="text-center mb-10">
          <img src="assets/logo.png" alt="Beeses Logo" class="h-10 mx-auto mb-6 filter invert">
          <h1 class="text-2xl font-black text-beeses-dark uppercase tracking-widest">Yönetim Paneli</h1>
          <p class="text-gray-500 text-sm mt-2">Lütfen giriş bilgilerinizi yazın</p>
        </div>

        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
          <lucide-icon name="alert-circle" class="w-5 h-5 flex-shrink-0 text-red-500"></lucide-icon>
          <p class="font-medium text-sm">{{ errorMessage }}</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Kullanıcı Adı</label>
            <div class="relative">
              <input type="text" formControlName="username" class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-beeses-dark focus:outline-none focus:ring-2 focus:ring-beeses-gold/30 focus:border-beeses-gold transition-all text-sm" placeholder="Kullanıcı adınız">
              <lucide-icon name="user" class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></lucide-icon>
            </div>
          </div>

          <div class="space-y-2 mt-4">
            <label class="block text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Şifre</label>
            <div class="relative">
              <input type="password" formControlName="password" class="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3.5 text-beeses-dark focus:outline-none focus:ring-2 focus:ring-beeses-gold/30 focus:border-beeses-gold transition-all text-sm" placeholder="••••••">
              <lucide-icon name="lock" class="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></lucide-icon>
            </div>
          </div>

          <button type="submit" [disabled]="isSubmitting" class="w-full bg-beeses-dark hover:bg-beeses-gold text-white font-bold tracking-widest uppercase py-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-3 text-sm mt-4 shadow-lg disabled:opacity-50">
            <lucide-icon *ngIf="isSubmitting" name="loader" class="w-5 h-5 animate-spin"></lucide-icon>
            <span>{{ isSubmitting ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP' }}</span>
          </button>
        </form>
      </div>
    </div>

    
    <div *ngIf="!isBrowser" class="min-h-screen w-screen flex flex-col items-center justify-center bg-beeses-dark">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beeses-gold mb-4"></div>
      <p class="text-white/60 text-xs font-medium tracking-widest uppercase animate-pulse">Yükleniyor...</p>
    </div>
  `
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  isBrowser = false;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (typeof window !== 'undefined') {
      this.isBrowser = true;
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const apiUrl = `${environment.apiUrl}/auth/login.php`;
    
    this.http.post(apiUrl, this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.success) {
          localStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_username', res.username);
          localStorage.setItem('admin_id', String(res.id));
          localStorage.setItem('admin_role', res.role);
          localStorage.setItem('admin_permissions', typeof res.permissions === 'object' ? JSON.stringify(res.permissions) : res.permissions || '{}');
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = res.message;
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Sunucu bağlantı hatası. XAMPP açık mı?';
      }
    });
  }
}

