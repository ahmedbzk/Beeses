import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DistributorService, Distributor } from '../../services/distributor.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, TranslateModule],
  templateUrl: './distributors.component.html',
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .distributor-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .distributor-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 30px 60px rgba(0,0,0,0.12) !important;
    }
    .floating-card {
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0); }
    }
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
  `]
})
export class DistributorsComponent implements OnInit {
  distributors: Distributor[] = [];
  filteredDistributors: Distributor[] = [];
  countries: string[] = [];
  
  selectedCountry: string | null = null;
  searchQuery: string = '';
  isLoading: boolean = true;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Application Form
  isFormModalOpen = false;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  selectedFile: File | null = null;
  fileError = '';
  
  applicationForm = {
    company_name: '',
    contact_email: '',
    group1_info: '',
    group2_info: '',
    group3_info: ''
  };

  constructor(
    private distributorService: DistributorService,
    private http: HttpClient,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.distributorService.getDistributors().subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.distributors = res.data;
            
            const countrySet = new Set<string>();
            this.distributors.forEach(d => {
              if (d.country) countrySet.add(d.country);
            });
            this.countries = Array.from(countrySet).sort((a, b) => a.localeCompare(b, 'tr'));

            this.applyFilters();
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      });
    }
  }

  filterByCountry(country: string | null): void {
    this.selectedCountry = country;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = this.distributors;

    if (this.selectedCountry) {
      result = result.filter(d => d.country === this.selectedCountry);
    }

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(d => 
        (d.company_name || '').toLowerCase().includes(q) || 
        (d.representative || '').toLowerCase().includes(q) || 
        (d.country || '').toLowerCase().includes(q) ||
        (d.address || '').toLowerCase().includes(q)
      );
    }

    this.filteredDistributors = result;
  }

  get paginatedDistributors(): Distributor[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredDistributors.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredDistributors.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  formatUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }

  // Form Methods
  openApplicationModal(): void {
    this.isFormModalOpen = true;
    this.submitSuccess = false;
    this.submitError = '';
    document.body.style.overflow = 'hidden';
  }

  closeApplicationModal(): void {
    this.isFormModalOpen = false;
    document.body.style.overflow = 'auto';
    this.resetForm();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.fileError = '';
    
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        this.fileError = this.translate.instant('DIST_APPLY_FILE_ERROR');
        this.selectedFile = null;
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = this.translate.instant('DIST_APPLY_FILE_ERROR');
        this.selectedFile = null;
        return;
      }
      
      this.selectedFile = file;
    }
  }

  submitApplication(): void {
    if (!this.applicationForm.company_name || !this.applicationForm.contact_email || !this.applicationForm.group1_info) {
      this.submitError = this.translate.instant('VALIDATION_REQUIRED');
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const formData = new FormData();
    Object.keys(this.applicationForm).forEach(key => {
      formData.append(key, (this.applicationForm as any)[key]);
    });

    if (this.selectedFile) {
      formData.append('company_profile', this.selectedFile);
    }

    this.http.post<any>(`${environment.apiUrl}/distributor_applications/apply.php`, formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.submitSuccess = true;
        } else {
          this.submitError = res.message || this.translate.instant('DIST_APPLY_ERROR');
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = this.translate.instant('DIST_APPLY_ERROR');
      }
    });
  }

  resetForm(): void {
    this.applicationForm = {
      company_name: '',
      contact_email: '',
      group1_info: '',
      group2_info: '',
      group3_info: ''
    };
    this.selectedFile = null;
    this.fileError = '';
    this.submitSuccess = false;
    this.submitError = '';
  }
}

