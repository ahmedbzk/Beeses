import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ChevronLeft, Search, ChevronRight, Award, Speaker, ChevronUp, Mail, Instagram, Facebook, Twitter, Youtube, Hand, ShieldCheck, Cpu, Layers, Settings, Shield, Phone, Music, Briefcase, Home, X, ArrowRight, Menu, ChevronDown, LucideAngularModule, MapPin, Headphones, Sliders, Zap, MessageCircle, LayoutGrid, CheckCircle, FileText, ExternalLink } from 'lucide-angular';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    importProvidersFrom(
      LucideAngularModule.pick({ ChevronLeft, Search, ChevronRight, Award, Speaker, ChevronDown, ChevronUp, Menu, ArrowRight, X, Music, Briefcase, Home, Phone, Cpu, Layers, Settings, Shield, ShieldCheck, Hand, Youtube, Facebook, Twitter, Instagram, Mail, MapPin, Headphones, Sliders, Zap, MessageCircle, LayoutGrid, CheckCircle, FileText, ExternalLink })
    )
  ]
};
