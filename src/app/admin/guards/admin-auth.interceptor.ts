import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { clearAdminSession } from './admin-session';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    const adminId = localStorage.getItem('admin_id');
    const username = localStorage.getItem('admin_username');

    // Exclude public endpoints from getting admin headers
    const isPublicEndpoint = req.url.includes('/apply.php') || req.url.includes('/get-distributors.php');

    // Only intercept requests going to our backend API and that are NOT public
    if (token && adminId && username && !isPublicEndpoint && (req.url.includes('/backend/api') || req.url.includes('/beeses_api') || req.url.includes('127.0.0.1'))) {
      const cloned = req.clone({
        setHeaders: {
          'X-Admin-Id': adminId,
          'X-Admin-Username': encodeURIComponent(username),
          'X-Admin-Token': token
        }
      });
      return next(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            alertService.showError('Bu işlem için yetkiniz yok.');
          } else if (error.status === 401 && !req.url.includes('/auth/logout.php')) {
            // Sunucu oturumu tanımıyor (süresi dolmuş / çıkış yapılmış): yerel oturumu temizle, girişe yönlendir
            clearAdminSession();
            alertService.showError('Oturum süreniz doldu, lütfen tekrar giriş yapın.');
            router.navigate(['/admin/login']);
          }
          return throwError(() => error);
        })
      );
    }
  }
  return next(req);
};
