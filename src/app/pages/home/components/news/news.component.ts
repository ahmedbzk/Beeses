import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { NewsService, News } from '../../../../services/news.service';

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
}
