import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { NewsService, News } from '../../../../services/news.service';
import { environment } from '../../../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, TranslateModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent implements OnInit, OnDestroy {
  private newsService = inject(NewsService);
  public translate = inject(TranslateService);
  newsItems: News[] = [];
  
  // Slider State
  activeIdx = 0;
  itemsPerPage = 3;
  isHovered = false;
  private autoRotateInterval: any;

  ngOnInit() {
    this.updateItemsPerPage();
    this.newsService.getLatestNews().subscribe({
      next: (res) => {
        if (res.success) {
          // Limit to max 6 news articles
          this.newsItems = res.data.slice(0, 6);
        }
      }
    });
    this.startAutoRotate();
  }

  ngOnDestroy() {
    this.stopAutoRotate();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.updateItemsPerPage();
  }

  private updateItemsPerPage() {
    if (typeof window === 'undefined') {
      this.itemsPerPage = 3;
      return;
    }
    const width = window.innerWidth;
    if (width < 768) {
      this.itemsPerPage = 1;
    } else if (width < 1024) {
      this.itemsPerPage = 2;
    } else {
      this.itemsPerPage = 3;
    }
  }

  startAutoRotate() {
    if (typeof window === 'undefined') return;
    this.stopAutoRotate();
    this.autoRotateInterval = setInterval(() => {
      if (!this.isHovered && this.newsItems.length > 0) {
        this.nextSlide();
      }
    }, 4500);
  }

  stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }
  }

  nextSlide() {
    const total = Math.min(this.newsItems.length, 6);
    if (total === 0) return;
    this.activeIdx = (this.activeIdx + 1) % total;
  }

  prevSlide() {
    const total = Math.min(this.newsItems.length, 6);
    if (total === 0) return;
    this.activeIdx = (this.activeIdx - 1 + total) % total;
  }

  selectSlide(idx: number) {
    this.activeIdx = idx;
    this.startAutoRotate(); // Reset timer on manual selection
  }

  // Double items wrap list getter to enable smooth loop transitions
  get displayItems(): News[] {
    if (this.newsItems.length === 0) return [];
    const raw = this.newsItems.slice(0, 6);
    const extra = this.itemsPerPage - 1;
    const looped = [...raw, ...raw.slice(0, extra)];
    return looped;
  }

  getCategoryTranslationKey(cat: string): string {
    switch (cat) {
      case 'Tümü': return 'NEWS_CAT_ALL';
      case 'Haber': return 'NEWS_CAT_NEWS';
      case 'Duyuru': return 'NEWS_CAT_ANNOUNCEMENT';
      case 'Etkinlik': return 'NEWS_CAT_EVENT';
      default: return cat;
    }
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop';
    }
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('assets/')) {
      return imagePath;
    }
    return `${environment.apiUrl}/${imagePath}`;
  }
}
