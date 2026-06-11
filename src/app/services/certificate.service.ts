import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Certificate {
  id?: number;
  name: string;
  description: string;
  name_en?: string;
  description_en?: string;
  icon: string;
  file_path: string;
  created_at?: string;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = `${environment.apiUrl}/certificates`;

  constructor(private http: HttpClient) { }

  getCertificates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-certificates.php`);
  }

  addCertificate(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-certificate.php`, data);
  }

  updateCertificate(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-certificate.php`, data);
  }

  deleteCertificate(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/delete-certificate.php?id=${id}`);
  }
}
