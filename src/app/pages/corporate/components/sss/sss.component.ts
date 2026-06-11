import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { FaqService, FAQ } from '../../../../services/faq.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sss',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, TranslateModule],
  templateUrl: './sss.component.html',
  styleUrl: './sss.component.scss'
})
export class SssComponent implements OnInit {
  private faqService = inject(FaqService);
  public translate = inject(TranslateService);
  faqs: FAQ[] = [];

  ngOnInit(): void {
    this.loadFaqs();
  }

  loadFaqs(): void {
    this.faqService.getFaqs().subscribe({
      next: (response) => {
        if (response.success) {
          this.faqs = response.data.map((item: FAQ, index: number) => ({
            ...item,
            isOpen: index === 0
          }));
        }
      },
      error: () => {}
    });
  }

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}

