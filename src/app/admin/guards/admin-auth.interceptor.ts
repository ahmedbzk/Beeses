import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    const adminId = localStorage.getItem('admin_id');
    const username = localStorage.getItem('admin_username');

    // Only intercept requests going to our backend API
    if (token && adminId && username && (req.url.includes('/beeses_api') || req.url.includes('127.0.0.1/beeses_api'))) {
      const cloned = req.clone({
        setHeaders: {
          'X-Admin-Id': adminId,
          'X-Admin-Username': username,
          'X-Admin-Token': token
        }
      });
      return next(cloned).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            alertService.showError('Bu işlem için yetkiniz yok.');
          } else if (error.status === 401) {
            alertService.showError('Oturum süreniz doldu, lütfen tekrar giriş yapın.');
          }
          return throwError(() => error);
        })
      );
    }
  }
  return next(req);
};
