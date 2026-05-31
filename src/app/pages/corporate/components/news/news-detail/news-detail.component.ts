import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NewsService, News } from '../../../../../services/news.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private newsService = inject(NewsService);

  news: News | undefined;
  otherNews: News[] = [];
  isLoading = true;
  apiUrl = environment.apiUrl;

  // Lightbox State
  selectedLightboxImage: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        const id = parseInt(idStr, 10);
        this.loadNewsDetail(id);
      } else {
        this.isLoading = false;
        this.router.navigate(['/corporate/components/news']);
      }
    });
  }

  loadNewsDetail(id: number) {
    this.isLoading = true;
    this.newsService.getNewsById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.news = res.data;
          this.loadOtherNews();
        } else {
          this.router.navigate(['/corporate/components/news']);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Haber yüklenemedi:', err);
        this.isLoading = false;
        this.router.navigate(['/corporate/components/news']);
      }
    });
  }

  loadOtherNews() {
    this.newsService.getLatestNews().subscribe({
      next: (res) => {
        if (res.success && this.news) {
          // Filter out current news
          this.otherNews = res.data.filter((item: News) => item.id !== this.news!.id).slice(0, 3);
        }
      }
    });
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('assets/')) {
      return imagePath;
    }
    return `${this.apiUrl}/${imagePath}`;
  }

  openLightbox(image: string) {
    this.selectedLightboxImage = image;
  }

  closeLightbox() {
    this.selectedLightboxImage = null;
  }
}
