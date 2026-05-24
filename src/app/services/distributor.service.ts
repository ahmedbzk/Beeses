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

@Injectable({
  providedIn: 'root'
})
export class DistributorService {
  private apiUrl = `${environment.apiUrl}/distributor`;

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
}
