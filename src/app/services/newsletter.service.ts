import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NewsletterSubscriber {
  id?: number;
  email: string;
  is_active?: number;
  subscribed_at?: string;
}

export interface NewsletterLog {
  id?: number;
  subject: string;
  body: string;
  recipients_count: number;
  sent_count: number;
  failed_count: number;
  sent_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = `${environment.apiUrl}/newsletter`;

  constructor(private http: HttpClient) { }

  subscribe(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/subscribe.php`, { email });
  }

  getSubscribers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-subscribers.php`);
  }

  unsubscribe(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/unsubscribe.php`, { id });
  }

  sendNewsletter(subject: string, body: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-newsletter.php`, { subject, body });
  }

  getLogs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-logs.php`);
  }
}
