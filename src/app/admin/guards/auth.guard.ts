import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Sadece tarayıcıda çalışıyorsa localStorage'ı kontrol et
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      return true; // Giriş yapılmış, geçişe izin ver
    }
    // Giriş yapılmamışsa login sayfasına yönlendir
    router.navigate(['/admin/login']);
    return false;
  }

  // Sunucu tarafında (SSR) yönlendirme yapma, true dönerek client-side guard'ın çalışmasını bekle
  return true;
};

