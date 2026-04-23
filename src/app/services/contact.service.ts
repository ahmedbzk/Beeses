import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ContactForm {
  name: string;
  surname: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // Proje canlıya alındığında bu URL backend URL'iniz ile değiştirilmelidir.
  // Örnek: 'https://siteadi.com/send-mail.php'
  private apiUrl = '/backend/send-mail.php'; 

  constructor(private http: HttpClient) { }

  sendMessage(data: ContactForm): Observable<any> {
    // DİKKAT: Bilgisayarınızda PHP yüklü olmadığı için (ng serve PHP çalıştıramaz),
    // şu anlık formun çalıştığını görebilmeniz adına sahte (mock) bir cevap döndürüyoruz.
    // Projeyi PHP destekli bir sunucuya yüklediğinizde aşağıdaki satırı silip,
    // en alttaki yorum satırındaki gerçek kodu açmalısınız.
    
    console.log("Gönderilecek Veriler (SİMÜLASYON):", data);
    return of({ success: true, message: 'Mesajınız başarıyla gönderildi.' }).pipe(delay(1500));

    // GERÇEK SUNUCU KODU (Canlıya alırken bunu kullanın):
    // return this.http.post<any>(this.apiUrl, data);
  }
}
