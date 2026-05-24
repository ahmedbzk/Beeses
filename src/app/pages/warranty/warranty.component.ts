import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-warranty',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './warranty.component.html',
  styleUrl: './warranty.component.scss'
})
export class WarrantyComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  warrantyForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting = false;
  errorMessage = '';
  showSuccessModal = false;
  
  countries = ['Tayvan', 'Amerika', 'Almanya', 'İran', 'Türkiye'];
  countryCodes: { [key: string]: string } = {
    'Türkiye': '+90',
    'Almanya': '+49',
    'Amerika': '+1',
    'İran': '+98',
    'Tayvan': '+886'
  };

  constructor() {
    this.warrantyForm = this.fb.group({
      product_name: ['', Validators.required],
      serial_number: ['', Validators.required],
      country: ['', Validators.required],
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onCountryChange(event: any) {
    const selectedCountry = event.target.value;
    const prefix = this.countryCodes[selectedCountry];
    if (prefix) {
      this.warrantyForm.patchValue({ phone: prefix + ' ' });
    }
  }

  onSubmit() {
    if (this.warrantyForm.invalid || !this.selectedFile) {
      this.warrantyForm.markAllAsTouched();
      this.errorMessage = 'Lütfen tüm zorunlu alanları doldurun ve faturanızı yükleyin.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    Object.keys(this.warrantyForm.controls).forEach(key => {
      formData.append(key, this.warrantyForm.get(key)?.value);
    });
    
    if (this.selectedFile) {
      formData.append('invoice_image', this.selectedFile);
    }

    // Backend dosyanı XAMPP htdocs/beeses_api klasörüne koyduğumuzda çalışacak adres
    const apiUrl = `${environment.apiUrl}/warranty/submit-warranty.php`;

    this.http.post(apiUrl, formData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response.success) {
          this.showSuccessModal = true;
          this.warrantyForm.reset();
          this.selectedFile = null;
        } else {
          this.errorMessage = response.message || 'Bir hata oluştu.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Sunucuya bağlanılamadı. Lütfen XAMPP sunucusunun açık olduğundan emin olun.';
        console.error(err);
      }
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}
