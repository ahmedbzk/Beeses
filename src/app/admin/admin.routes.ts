import { Routes } from '@angular/router';
import { AdminLoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './layout/admin.component';
import { WarrantiesAdminComponent } from './pages/warranties/warranties-admin.component';
import { DashboardHomeComponent } from './pages/dashboard/dashboard-home.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const adminRoutes: Routes = [
  { path: 'login', component: AdminLoginComponent, canActivate: [guestGuard] },
  { 
    path: 'dashboard', 
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'warranties', component: WarrantiesAdminComponent },
      { path: 'contacts', loadComponent: () => import('./pages/contacts/contacts-admin.component').then(m => m.ContactsAdminComponent) },
      { path: 'distributors', loadComponent: () => import('./pages/distributors/distributors-admin.component').then(m => m.DistributorsAdminComponent) },
      { path: 'news', loadComponent: () => import('./pages/news/news-admin.component').then(m => m.NewsAdminComponent) }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
