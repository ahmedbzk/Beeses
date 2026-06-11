import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface InnovationSpec {
  name: string;
  value: string;
}

export interface InnovationFeature {
  title: string;
  description: string;
}

export interface Innovation {
  id?: number;
  title: string;
  title_en?: string;
  subtitle: string;
  subtitle_en?: string;
  description: string;
  description_en?: string;
  status: string; // e.g. "Geliştirme Aşamasında", "Prototip"
  status_en?: string;
  launchDate: string;
  image?: string;
  features: string[];
  features_en?: string[];
  specs?: InnovationSpec[];
  specs_en?: InnovationSpec[];
}

@Injectable({
  providedIn: 'root'
})
export class InnovationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/innovations`;

  getInnovations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-innovations.php`);
  }

  addInnovation(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-innovation.php`, data);
  }

  updateInnovation(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-innovation.php`, data);
  }

  deleteInnovation(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/delete-innovation.php`, { id });
  }
}
