import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsService, News } from '../../../../services/news.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, FormsModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsListComponent implements OnInit {
  private newsService = inject(NewsService);

  news: News[] = [];
  isLoading = true;

  // Search & Filter
  searchQuery = '';
  selectedCategory = 'Tümü';
  categories = ['Tümü', 'Haber', 'Duyuru', 'Etkinlik'];

  // Pagination
  currentPage = 1;
  pageSize = 6;

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.isLoading = true;
    this.newsService.getNews().subscribe({
      next: (res) => {
        if (res.success) {
          this.news = res.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get filteredNews() {
    return this.news.filter(item => {
      const matchesCategory = this.selectedCategory === 'Tümü' || item.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery || 
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  get paginatedNews() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredNews.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredNews.length / this.pageSize));
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
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
