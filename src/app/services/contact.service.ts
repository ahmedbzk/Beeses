import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ContactForm {
  id?: number;
  name?: string;
  surname?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: string;
  reply_message?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contact`; 

  constructor(private http: HttpClient) { }

  sendMessage(data: ContactForm): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/submit-contact.php`, data);
  }

  getContacts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-contacts.php`);
  }

  updateContactStatus(id: number, status: string, reply_message?: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-contact.php`, { id, status, reply_message });
  }
}
