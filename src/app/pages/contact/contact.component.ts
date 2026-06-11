import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ContactService } from '../../services/contact.service';
import { AlertService } from '../../services/alert.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private alertService: AlertService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      subject: ['ses', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.alertService.showError(this.translate.instant('CONTACT_ERROR') || 'Lütfen tüm alanları geçerli bir şekilde doldurun.');
      return;
    }

    this.isSubmitting = true;
    
    // Map the short subject to its full text
    const subjectMap: Record<string, string> = {
      'ses': 'Ses Sistemleri',
      'garanti': 'Garanti Başvurusu',
      'genel': 'Genel Bilgi',
      'bayiler': 'Bayilerimiz',
      'teknik': 'Teknik Destek',
      'satis': 'Satış Ortaklığı'
    };

    const formData = { ...this.contactForm.value };
    if (subjectMap[formData.subject]) {
      formData.subject = subjectMap[formData.subject];
    }

    this.contactService.sendMessage(formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.alertService.showSuccess(this.translate.instant('CONTACT_SUCCESS'));
        this.contactForm.reset();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || this.translate.instant('ERROR_CONNECTION');
        this.alertService.showError(msg);
        this.cdr.detectChanges();
      }
    });
  }
}
