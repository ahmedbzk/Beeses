import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { clearAdminSession, hasValidAdminTokenFormat } from './admin-session';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (hasValidAdminTokenFormat(token)) {
      const role = localStorage.getItem('admin_role');
      const permissionsRaw = localStorage.getItem('admin_permissions');
      // Traverse to the leaf route to check the actual child module path
      let leafRoute = route;
      while (leafRoute.firstChild) {
        leafRoute = leafRoute.firstChild;
      }
      const path = leafRoute.routeConfig?.path;
      // Rota yolu "distributor-applications", yetki anahtarı ise "distributor_applications"
      const permissionKey = path?.replace(/-/g, '_');

      if (permissionKey && path !== 'dashboard' && role !== 'superadmin') {
        try {
          const permissions = JSON.parse(permissionsRaw || '{}');
          if (!permissions[permissionKey] || permissions[permissionKey].view !== true) {
            router.navigate(['/admin/dashboard']);
            return false;
          }
        } catch (e) {
          // Error parsing permissions
        }
      }
      return true;
    }
    // Token yok ya da eski sürümün geçersiz token'ı: temizle ve girişe yönlendir
    clearAdminSession();
    router.navigate(['/admin/login']);
    return false;
  }

  return true;
};
