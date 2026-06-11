import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, TranslateModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  public translate = inject(TranslateService);

  slides = [
    {
      image: 'assets/backgrounds/bg6.jpg',
      subtitleKey: 'HERO_SLIDE1_SUBTITLE',
      titleKey: 'HERO_SLIDE1_TITLE',
      descriptionKey: 'HERO_SLIDE1_DESC',
      position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 md:mt-0 md:top-auto md:bottom-24 md:left-12 md:translate-x-0 md:translate-y-0 text-center items-center md:text-left md:items-start w-[85%] max-w-[300px] md:max-w-2xl md:w-auto'
    },
    {
      image: 'assets/backgrounds/bg2.jpg',
      subtitleKey: 'HERO_SLIDE2_SUBTITLE',
      titleKey: 'HERO_SLIDE2_TITLE',
      descriptionKey: 'HERO_SLIDE2_DESC',
      position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 md:mt-0 md:top-auto md:left-auto md:bottom-24 md:right-12 md:translate-x-0 md:translate-y-0 text-center items-center md:text-right md:items-end w-[85%] max-w-[300px] md:max-w-2xl md:w-auto'
    },
    {
      image: 'assets/backgrounds/bg7.jpg',
      subtitleKey: 'HERO_SLIDE3_SUBTITLE',
      titleKey: 'HERO_SLIDE3_TITLE',
      descriptionKey: 'HERO_SLIDE3_DESC',
      position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 md:mt-0 text-center items-center w-[85%] max-w-[300px] md:max-w-2xl md:w-auto'
    }
  ];

  currentSlideIndex = 0;
  private intervalId: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.intervalId = setInterval(() => {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
      }, 6000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}