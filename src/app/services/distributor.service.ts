import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Distributor {
  id?: number;
  country: string;
  representative: string;
  company_name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
  created_at?: string;
}

export interface DistributorApplication {
  id: number;
  company_name: string;
  group1_info: string;
  group2_info: string;
  group3_info: string;
  file_path: string;
  contact_phone: string;
  contact_email: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'answered';
  reply_message?: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class DistributorService {
  private apiUrl = `${environment.apiUrl}/distributor`;
  private appApiUrl = `${environment.apiUrl}/distributor_applications`;

  constructor(private http: HttpClient) { }

  getDistributors(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-distributors.php`);
  }

  addDistributor(data: Distributor): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-distributor.php`, data);
  }

  updateDistributor(data: Distributor): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-distributor.php`, data);
  }

  deleteDistributor(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-distributor.php`, { id });
  }

  getApplications(): Observable<any> {
    return this.http.get<any>(`${this.appApiUrl}/get-applications.php`);
  }

  updateApplicationStatus(id: number, status: string, reply_message?: string): Observable<any> {
    return this.http.post(`${this.appApiUrl}/update-application-status.php`, { id, status, reply_message });
  }

  getApplicationLogs(id: number): Observable<any> {
    return this.http.get(`${this.appApiUrl}/get-application-logs.php?id=${id}`);
  }

  deleteApplication(id: number): Observable<any> {
    return this.http.post<any>(`${this.appApiUrl}/delete-application.php`, { id });
  }
}
