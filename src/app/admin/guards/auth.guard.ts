import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      const role = localStorage.getItem('admin_role');
      const permissionsRaw = localStorage.getItem('admin_permissions');
      // Traverse to the leaf route to check the actual child module path
      let leafRoute = route;
      while (leafRoute.firstChild) {
        leafRoute = leafRoute.firstChild;
      }
      const path = leafRoute.routeConfig?.path;

      if (path && path !== 'dashboard' && path !== '' && role !== 'superadmin') {
        try {
          const permissions = JSON.parse(permissionsRaw || '{}');
          if (!permissions[path] || permissions[path].view !== true) {
            router.navigate(['/admin/dashboard']);
            return false;
          }
        } catch (e) {
          // Error parsing permissions
        }
      }
      return true;
    }
    router.navigate(['/admin/login']);
    return false;
  }

  return true;
};
