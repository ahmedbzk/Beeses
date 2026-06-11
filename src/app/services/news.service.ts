import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface News {
  id?: number;
  title: string;
  summary: string;
  title_en?: string;
  summary_en?: string;
  content?: string;
  content_en?: string;
  category: string;
  image: string;
  sections?: { title?: string; text: string; image: string; }[];
  sections_en?: { title?: string; text: string; image: string; }[];
  news_date: string;
  formatted_date?: string;
  created_at?: string;
  selected?: boolean; // Admin checkbox helper
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

  getNewsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-news-detail.php?id=${id}`);
  }

  getLatestNews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-latest-news.php`);
  }

  addNews(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-news.php`, data);
  }

  updateNews(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update-news.php`, data);
  }

  deleteNews(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/delete-news.php?id=${id}`);
  }
}
