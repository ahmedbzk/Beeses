import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { DistributorService, Distributor } from '../../services/distributor.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-distributors',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
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
  `]
})
export class DistributorsComponent implements OnInit {
  distributors: Distributor[] = [];
  filteredDistributors: Distributor[] = [];
  countries: string[] = ['Tayvan', 'Amerika', 'Almanya', 'İran', 'Türkiye'];
  
  selectedCountry: string | null = null;
  searchQuery: string = '';
  isLoading: boolean = true;

  constructor(
    private distributorService: DistributorService
  ) {}

  ngOnInit(): void {
    // Ülkeleri alfabetik sıralayalım
    this.countries.sort((a, b) => a.localeCompare(b, 'tr'));

    setTimeout(() => {
      this.distributors = this.distributorService.getDistributors();
      this.applyFilters();
      this.isLoading = false;
    }, 800);
  }

  filterByCountry(country: string | null): void {
    this.selectedCountry = country;
    this.applyFilters();
  }

  onSearchChange(): void {
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
        d.name.toLowerCase().includes(q) || 
        d.country.toLowerCase().includes(q) ||
        d.address.toLowerCase().includes(q)
      );
    }

    this.filteredDistributors = result;
  }
}
