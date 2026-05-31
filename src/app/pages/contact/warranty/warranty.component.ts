import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../../environments/environment';

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

  productPrefixes: { [key: string]: { prefix: string, maxLength: number } } = {
    'SQL-4400': { prefix: '4400', maxLength: 12 },
    'SQL-4200': { prefix: '4200', maxLength: 12 },
    'OF-1': { prefix: '6101', maxLength: 12 },
    'OF-2': { prefix: '6102', maxLength: 12 },
    'OF-4': { prefix: '6104', maxLength: 12 },
    'PETEK STEREO': { prefix: 'P220', maxLength: 10 },
    'PETEK MONO BLOCK': { prefix: 'P120', maxLength: 10 }
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

  onPhoneInput(event: any) {
    const input = event.target;
    // Sadece rakamlar, artı (+) ve boşluk karakterine izin ver
    const sanitized = input.value.replace(/[^0-9+\s]/g, '');
    if (sanitized !== input.value) {
      this.warrantyForm.patchValue({ phone: sanitized }, { emitEvent: false });
      input.value = sanitized;
    }
  }

  onProductChange(event: any) {
    const productName = event.target.value;
    const rules = this.productPrefixes[productName];
    const serialControl = this.warrantyForm.get('serial_number');
    if (rules && serialControl) {
      serialControl.setValidators([
        Validators.required,
        Validators.minLength(rules.maxLength),
        Validators.maxLength(rules.maxLength)
      ]);
      this.warrantyForm.patchValue({ serial_number: rules.prefix });
    } else if (serialControl) {
      serialControl.setValidators([Validators.required]);
      this.warrantyForm.patchValue({ serial_number: '' });
    }
    serialControl?.updateValueAndValidity();
  }

  onSerialNumberInput(event: any) {
    const input = event.target;
    const productName = this.warrantyForm.get('product_name')?.value;
    const rules = this.productPrefixes[productName];
    
    let val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (rules) {
      if (val.length < rules.prefix.length || !val.startsWith(rules.prefix)) {
        val = rules.prefix;
      } else if (val.length > rules.maxLength) {
        val = val.substring(0, rules.maxLength);
      }
    }
    
    if (val !== input.value) {
      this.warrantyForm.patchValue({ serial_number: val }, { emitEvent: false });
      input.value = val;
    }
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
          const serialControl = this.warrantyForm.get('serial_number');
          if (serialControl) {
            serialControl.setValidators([Validators.required]);
            serialControl.updateValueAndValidity();
          }
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

  getExpectedLength(): number {
    const productName = this.warrantyForm.get('product_name')?.value;
    const rules = this.productPrefixes[productName];
    return rules ? rules.maxLength : 0;
  }
}
