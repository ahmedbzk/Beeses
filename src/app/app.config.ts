import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Hash, Edit, ImagePlus, Link, Image, Info, Check, Clock, RefreshCw, LogOut, MessageSquare, Box, Loader, Lock, User, ChevronLeft, Search, SearchX, ChevronRight, Award, Speaker, ChevronUp, Mail, Send, Instagram, Facebook, Twitter, Youtube, Hand, ShieldCheck, Cpu, Layers, Settings, Shield, Phone, Music, Briefcase, Home, X, ArrowRight, Menu, ChevronDown, LucideAngularModule, MapPin, Headphones, Sliders, Zap, MessageCircle, LayoutGrid, CheckCircle, FileText, ExternalLink, Leaf, Flag, AudioWaveform, Calendar, Globe, Plus, Trash, Bell, Users } from 'lucide-angular';
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
      LucideAngularModule.pick({ Hash, Edit, ImagePlus, Link, Image, Info, Check, Clock, RefreshCw, LogOut, MessageSquare, Box, Loader, Lock, User, ChevronLeft, Search, SearchX, ChevronRight, Award, Speaker, ChevronDown, ChevronUp, Menu, ArrowRight, X, Music, Briefcase, Home, Phone, Cpu, Layers, Settings, Shield, ShieldCheck, Hand, Youtube, Facebook, Twitter, Instagram, Mail, Send, MapPin, Headphones, Sliders, Zap, MessageCircle, LayoutGrid, CheckCircle, FileText, ExternalLink, Leaf, Flag, AudioWaveform, Calendar, Globe, Plus, Trash, Bell, Users })
    )
  ]
};

