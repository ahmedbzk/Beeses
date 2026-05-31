import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FAQ {
  id?: number;
  question: string;
  answer: string;
  created_at?: string;
  isOpen?: boolean;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private apiUrl = `${environment.apiUrl}/faq`;

  constructor(private http: HttpClient) { }

  getFaqs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-faqs.php`);
  }

  addFaq(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-faq.php`, data);
  }

  updateFaq(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-faq.php`, data);
  }

  deleteFaq(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/delete-faq.php?id=${id}`);
  }
}
