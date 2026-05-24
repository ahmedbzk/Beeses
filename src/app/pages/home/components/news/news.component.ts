import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { NewsService, News } from '../../../../services/news.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit {
  private newsService = inject(NewsService);
  newsItems: News[] = [];

  ngOnInit() {
    this.newsService.getLatestNews().subscribe({
      next: (res) => {
        if (res.success) {
          this.newsItems = res.data;
        }
      }
    });
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${environment.apiUrl}/${imagePath}`;
  }
}
