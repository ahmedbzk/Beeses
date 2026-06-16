import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

export interface WarrantyDetails {
  product_name: string;
  serial_number: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'passive';
  product_image: string;
}

@Component({
  selector: 'app-warranty-query',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule, TranslateModule],
  templateUrl: './warranty-query.component.html',
  styleUrl: './warranty-query.component.scss'
})
export class WarrantyQueryComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  public translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);

  queryForm!: FormGroup;
  captchaCode = '';
  isSubmitting = false;
  errorMessage = '';
  infoMessage = '';
  queryStatus: 'pending' | 'rejected' | null = null;
  result: WarrantyDetails | null = null;
  apiUrl = environment.apiUrl;

  ngOnInit() {
    this.generateCaptcha();
    this.queryForm = this.fb.group({
      serial_number: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]],
      captcha_input: ['', [Validators.required]]
    });
  }

  generateCaptcha() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.captchaCode = code;
  }

  onSerialNumberInput(event: any) {
    const input = event.target;
    let val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length > 12) {
      val = val.substring(0, 12);
    }
    if (val !== input.value) {
      this.queryForm.patchValue({ serial_number: val }, { emitEvent: false });
      input.value = val;
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.infoMessage = '';
    this.queryStatus = null;
    this.result = null;

    if (this.queryForm.invalid) {
      this.queryForm.markAllAsTouched();
      this.errorMessage = this.translate.instant('ALERT_ERROR') || 'Lütfen tüm alanları doldurun.';
      return;
    }

    const serial_number = (this.queryForm.value.serial_number || '').trim();
    const captcha_input = (this.queryForm.value.captcha_input || '').trim();

    if (captcha_input.toUpperCase() !== this.captchaCode) {
      this.errorMessage = this.translate.instant('ALERT_ERROR') || 'Güvenlik kodu eşleşmedi. Lütfen tekrar deneyin.';
      this.generateCaptcha();
      this.queryForm.patchValue({ captcha_input: '' });
      return;
    }

    this.isSubmitting = true;

    this.http.get<any>(`${this.apiUrl}/warranty/query-warranty.php?serial_number=${serial_number}`).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.success) {
          this.result = res.data;
          this.queryForm.reset({
            serial_number: serial_number,
            captcha_input: ''
          });
          this.generateCaptcha();
        } else {
          if (res.status === 'pending' || res.status === 'rejected') {
            this.infoMessage = res.message;
            this.queryStatus = res.status;
          } else {
            this.errorMessage = res.message || this.translate.instant('WARRANTY_QUERY_NOT_FOUND');
            this.queryStatus = null;
          }
          this.generateCaptcha();
          this.queryForm.patchValue({ captcha_input: '' });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = this.translate.instant('ERROR_CONNECTION');
        this.generateCaptcha();
        this.cdr.detectChanges();
      }
    });
  }

  getRemainingDays(endDateStr: string): number {
    const end = new Date(endDateStr).getTime();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = end - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getWarrantyProgress(startDateStr: string, endDateStr: string): number {
    const start = new Date(startDateStr).getTime();
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

  getImageForProduct(productName: string): string {
    const defaultImg = 'assets/logo.png';
    if (!productName) return defaultImg;
    
    const name = productName.toUpperCase();
    if (name.includes('PETEK STEREO')) return 'assets/products/Petek Stereo.png';
    if (name.includes('PETEK MONO')) return 'assets/products/Petek Mono Block.png';
    if (name.includes('4200')) return 'assets/products/sql42001.2.png';
    if (name.includes('4400')) return 'assets/products/sql44001.2.png';
    if (name.includes('OF-1')) return 'assets/products/OF-1 ve BS-O 101.PNG';
    if (name.includes('OF-2')) return 'assets/products/OF-2 ve BS-O 102.PNG';
    
    return defaultImg;
  }
}
