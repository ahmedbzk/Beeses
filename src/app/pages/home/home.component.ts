import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { TechnicalSpecsComponent } from './components/technical-specs/technical-specs.component';
import { AudioFeaturesComponent } from './components/audio-features/audio-features.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HeroComponent,AboutComponent,FeaturedProductsComponent,TechnicalSpecsComponent, AudioFeaturesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
