import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ContactService } from '../../services/contact.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private alertService: AlertService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.alertService.showError('Lütfen tüm alanları geçerli bir şekilde doldurun.');
      return;
    }

    this.isSubmitting = true;
    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.alertService.showSuccess('Mesajınız başarıyla gönderildi.');
        this.contactForm.reset();
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || 'Mesaj gönderilirken bir hata oluştu.';
        this.alertService.showError(msg);
      }
    });
  }
}
