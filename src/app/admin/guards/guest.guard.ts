import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { clearAdminSession, hasValidAdminTokenFormat } from './admin-session';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (hasValidAdminTokenFormat(token)) {
      router.navigate(['/admin/dashboard']);
      return false; // Zaten giriş yapmışsa login sayfasını engelle
    }
    // Eski sürümden kalan geçersiz token: temizle ve giriş sayfasını göster
    if (token) clearAdminSession();
  }

  return true;
};
