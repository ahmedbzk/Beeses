import { Component, Input, Output, EventEmitter, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pdf-viewer-modal',
  standalone: true,
  imports: [CommonModule, PdfViewerModule, TranslateModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-sm animate-fade-in"
         (click)="closeModal()">
      
      <!-- Header -->
      <div class="flex items-center justify-between p-4 sm:p-6 bg-black/50 border-b border-white/10" (click)="$event.stopPropagation()">
        <h3 class="text-white font-bold text-sm sm:text-lg tracking-wider uppercase">{{ title }}</h3>
        <div class="flex items-center gap-4">
          <!-- Orijinal sistemdeki İNDİR butonu (Yeni sekmede açar) -->
          <a [href]="pdfUrl" target="_blank" download class="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-beeses-gold text-black hover:bg-white hover:text-beeses-dark font-bold text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span class="hidden sm:inline">{{ 'DOWNLOAD' | translate }}</span>
          </a>
          <!-- Kapat butonu -->
          <button (click)="closeModal()" class="text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 sm:p-3 rounded-full backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- PDF Viewer Body -->
      <div class="flex-1 overflow-auto flex justify-center p-2 sm:p-4" (click)="$event.stopPropagation()">
        <!-- A wrapper to force the viewer to fill the area properly -->
        <div class="relative w-full max-w-5xl h-full bg-white shadow-2xl rounded-lg overflow-hidden">
          @defer (when isOpen) {
            <pdf-viewer [src]="pdfUrl"
                        [render-text]="true"
                        [original-size]="false"
                        [fit-to-page]="true"
                        style="width: 100%; height: 100%; display: block;">
            </pdf-viewer>
          }
        </div>
      </div>
    </div>
  `
})
export class PdfViewerModalComponent implements OnInit, OnDestroy {
  @Input() isOpen: boolean = false;
  @Input() pdfUrl: string = '';
  @Input() title: string = '';

  @Output() close = new EventEmitter<void>();

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    // Sabit pozisyonlamayı (fixed) garanti altına almak için modalı body'ye taşıyoruz
    if (typeof document !== 'undefined') {
      this.renderer.appendChild(document.body, this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined' && this.el.nativeElement.parentElement) {
      this.renderer.removeChild(document.body, this.el.nativeElement);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
