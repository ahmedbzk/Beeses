import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SocialFabComponent } from './components/social-fab/social-fab.component';
import { AlertComponent } from './components/alert/alert.component';
import { LucideAngularModule } from 'lucide-angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SocialFabComponent,
    AlertComponent,
    LucideAngularModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'beeses-audio';
  isDemoPage = false;

  constructor(
    private router: Router,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Sayfa henüz yüklenirken veya yenilenirken ilk andan itibaren URL kontrolünü yap
    this.checkIfDemoPage(this.location.path());
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkIfDemoPage(event.url);
      
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  private checkIfDemoPage(url: string) {
    this.isDemoPage = url.includes('header-demo') || url.includes('/admin');
  }
}
