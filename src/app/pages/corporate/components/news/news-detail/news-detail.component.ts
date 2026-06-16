import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NewsService, News } from '../../../../../services/news.service';
import { environment } from '../../../../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, TranslateModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private newsService = inject(NewsService);
  public translate = inject(TranslateService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

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
          if (this.news) {
            // Update SEO Meta Tags dynamically
            const nTitle = this.translate.currentLang === 'en' && this.news.title_en ? this.news.title_en : this.news.title;
            const nSummary = this.translate.currentLang === 'en' && this.news.summary_en ? this.news.summary_en : this.news.summary;
            
            this.titleService.setTitle(`${nTitle} | Beeses Audio`);
            this.metaService.updateTag({ name: 'description', content: nSummary || '' });
            this.metaService.updateTag({ property: 'og:title', content: `${nTitle} | Beeses Audio` });
            this.metaService.updateTag({ property: 'og:description', content: nSummary || '' });
          }
          this.loadOtherNews();
        } else {
          this.router.navigate(['/corporate/components/news']);
        }
        this.isLoading = false;
      },
      error: (err) => {
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

  getYoutubeId(url: string | undefined): string | null {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  getVideoThumbnail(url: string | undefined): string {
    if (!url) return this.getImageUrl(this.news?.image);
    const youtubeId = this.getYoutubeId(url);
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }
    return this.getImageUrl(this.news?.image);
  }

  openLightbox(image: string) {
    this.selectedLightboxImage = image;
  }

  closeLightbox() {
    this.selectedLightboxImage = null;
  }

  get translatedTitle(): string {
    if (!this.news) return '';
    return this.translate.currentLang === 'en' && this.news.title_en ? this.news.title_en : this.news.title;
  }

  get translatedSummary(): string {
    if (!this.news) return '';
    return this.translate.currentLang === 'en' && this.news.summary_en ? this.news.summary_en : this.news.summary;
  }

  get translatedSections(): any[] {
    if (!this.news) return [];
    const baseSections = this.news.sections || [];
    const enSections = this.news.sections_en || [];
    
    return baseSections.map((sec, index) => {
      const enSec = enSections[index];
      if (this.translate.currentLang === 'en' && enSec) {
        return {
          ...sec,
          title: enSec.title || sec.title,
          text: enSec.text || sec.text,
        };
      }
      return sec;
    });
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
}
