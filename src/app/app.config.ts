import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, UrlSerializer } from '@angular/router';
import { Trash2, Building, History, TrendingUp, Download, FileDown, ChevronsLeft, ChevronsRight, UploadCloud, Star, FlaskConical, Eye, Inbox, CalendarDays, CalendarCheck, Hash, Edit, ImagePlus, Link, Image, Info, Check, Clock, RefreshCw, LogOut, MessageSquare, Box, Loader, Lock, User, ChevronLeft, Search, SearchX, ChevronRight, Award, Speaker, ChevronUp, Mail, Send, Instagram, Facebook, Twitter, Youtube, Hand, ShieldCheck, Cpu, Layers, Settings, Shield, Phone, Music, Briefcase, Home, X, ArrowRight, Menu, ChevronDown, LucideAngularModule, MapPin, Headphones, Sliders, Zap, MessageCircle, LayoutGrid, CheckCircle, FileText, ExternalLink, Leaf, Flag, AudioWaveform, Calendar, Globe, Plus, Trash, Bell, Users, AlertTriangle, Play, Video, GitCompare, Minus, Scale } from 'lucide-angular';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from './i18n/custom-translate-loader';
import { APP_BASE_HREF, IMAGE_CONFIG } from '@angular/common';
import { adminAuthInterceptor } from './admin/guards/admin-auth.interceptor';
import { baseHrefFactory } from './i18n/site-lang';
import { TrailingSlashUrlSerializer } from './i18n/trailing-slash-url-serializer';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_BASE_HREF, useFactory: baseHrefFactory },
    provideRouter(routes),
    // Linkleri sunucunun kullandığı sondaki "/" ile üret (gereksiz 301 yönlendirmelerini önler)
    { provide: UrlSerializer, useClass: TrailingSlashUrlSerializer },
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([adminAuthInterceptor])),
    provideAnimationsAsync(),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
    },
    importProvidersFrom(
      LucideAngularModule.pick({ Trash2, Building, History, TrendingUp, Download, FileDown, ChevronsLeft, ChevronsRight, UploadCloud, Star, FlaskConical, Eye, Inbox, CalendarDays, CalendarCheck, Hash, Edit, ImagePlus, Link, Image, Info, Check, Clock, RefreshCw, LogOut, MessageSquare, Box, Loader, Lock, User, ChevronLeft, Search, SearchX, ChevronRight, Award, Speaker, ChevronDown, ChevronUp, Menu, ArrowRight, X, Music, Briefcase, Home, Phone, Cpu, Layers, Settings, Shield, ShieldCheck, Hand, Youtube, Facebook, Twitter, Instagram, Mail, Send, MapPin, Headphones, Sliders, Zap, MessageCircle, LayoutGrid, CheckCircle, FileText, ExternalLink, Leaf, Flag, AudioWaveform, Calendar, Globe, Plus, Trash, Bell, Users, AlertTriangle, Play, Video, GitCompare, Minus, Scale }),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: CustomTranslateLoader
        }
      })
    )
  ]
};


