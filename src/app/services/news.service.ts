import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface News {
  id?: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
  news_date: string;
  formatted_date?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = `${environment.apiUrl}/news`;

  constructor(private http: HttpClient) { }

  getNews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-news.php`);
  }

  getLatestNews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-latest-news.php`);
  }

  addNews(data: News): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-news.php`, data);
  }

  updateNews(data: News): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-news.php`, data);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/delete-news.php?id=${id}`);
  }
}
