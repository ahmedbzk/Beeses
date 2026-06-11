import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Admin {
  id?: number;
  username: string;
  password?: string;
  role: string;
  permissions: any; // JSON object
  created_at?: string;
}

export interface AdminLog {
  id: number;
  admin_id: number;
  username: string;
  page: string;
  action: string;
  details: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admins`;

  getAdmins(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-admins.php`);
  }

  addAdmin(data: Admin): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-admin.php`, data);
  }

  updateAdmin(data: Admin): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-admin.php`, data);
  }

  deleteAdmin(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/delete-admin.php?id=${id}`);
  }

  getLogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-logs.php`);
  }

  updateProfile(data: { username: string; password?: string }): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/update-profile.php`, data);
  }
}
