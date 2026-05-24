import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.navigate(['/admin/dashboard']);
      return false; // Zaten giriş yapmışsa login sayfasını engelle
    }
  }

  return true;
};
