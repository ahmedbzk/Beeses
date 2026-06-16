import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { InnovationService, Innovation } from '../../../services/innovation.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-innovations-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './innovations-admin.component.html',
  styleUrl: './innovations-admin.component.scss'
})
export class InnovationsAdminComponent implements OnInit {
  private innovationService = inject(InnovationService);
  private platformId = inject(PLATFORM_ID);

  innovations: Innovation[] = [];
  filteredInnovations: Innovation[] = [];
  
  searchTerm: string = '';
  selectedStatus: string = '';
  
  isModalOpen: boolean = false;
  activeTab: 'tr' | 'en' = 'tr';
  editingItem: Innovation | null = null;
  isSaving: boolean = false;

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  apiUrl = environment.apiUrl;

  notification: { type: 'success' | 'error', message: string } | null = null;

  hasEditPermission = false;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('admin_role') || 'admin';
      const permsRaw = localStorage.getItem('admin_permissions') || '{}';
      if (role === 'superadmin') {
        this.hasEditPermission = true;
      } else {
        try {
          const perms = JSON.parse(permsRaw);
          this.hasEditPermission = !!(perms['innovations'] && perms['innovations'].edit === true);
        } catch (e) {
          this.hasEditPermission = false;
        }
      }
    }
    this.loadInnovations();
  }

  loadInnovations() {
    this.innovationService.getInnovations().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.innovations = res.data;
          this.applyFilters();
        }
      },
      error: (err: any) => {
        this.showNotification('error', 'İnovasyon verileri yüklenirken bir hata oluştu.');
      }
    });
  }

  applyFilters() {
    this.filteredInnovations = this.innovations.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            item.subtitle.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus ? item.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  clearSelectedFile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreviewUrl = this.editingItem?.image ? this.getImageUrl(this.editingItem.image) : '';
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '';
    if (!isPlatformBrowser(this.platformId)) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    if (imagePath.startsWith('uploads/')) {
      return `${this.apiUrl}/${imagePath}`;
    }
    return '';
  }

  openModal(item?: Innovation) {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    if (item) {
      this.editingItem = JSON.parse(JSON.stringify(item)) as Innovation; // clone
      if (!this.editingItem!.specs) this.editingItem!.specs = [];
      if (!this.editingItem!.specs_en) this.editingItem!.specs_en = [];
      this.imagePreviewUrl = item.image ? this.getImageUrl(item.image) : '';
    } else {
      this.editingItem = {
        title: '',
        title_en: '',
        subtitle: '',
        subtitle_en: '',
        description: '',
        description_en: '',
        status: 'Geliştirme Aşamasında',
        status_en: 'In Development',
        launchDate: '',
        features: [],
        features_en: [],
        specs: [],
        specs_en: []
      };
    }
    this.isModalOpen = true;
    this.activeTab = 'tr';
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingItem = null;
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    document.body.style.overflow = '';
  }

  addSpecRow() {
    if (!this.editingItem) return;
    if (!this.editingItem.specs) this.editingItem.specs = [];
    if (!this.editingItem.specs_en) this.editingItem.specs_en = [];
    
    this.editingItem.specs.push({ name: '', value: '' });
    this.editingItem.specs_en.push({ name: '', value: '' });
  }

  removeSpecRow(index: number) {
    if (!this.editingItem) return;
    if (this.editingItem.specs) {
      this.editingItem.specs.splice(index, 1);
    }
    if (this.editingItem.specs_en && this.editingItem.specs_en[index] !== undefined) {
      this.editingItem.specs_en.splice(index, 1);
    }
  }

  saveItem() {
    if (!this.editingItem) return;
    this.isSaving = true;

    const payload = new FormData();
    if (this.editingItem.id) {
      payload.append('id', String(this.editingItem.id));
    }
    payload.append('title', this.editingItem.title || '');
    payload.append('title_en', this.editingItem.title_en || '');
    payload.append('subtitle', this.editingItem.subtitle || '');
    payload.append('subtitle_en', this.editingItem.subtitle_en || '');
    payload.append('description', this.editingItem.description || '');
    payload.append('description_en', this.editingItem.description_en || '');
    payload.append('status', this.editingItem.status || '');
    payload.append('status_en', this.editingItem.status_en || '');
    payload.append('launchDate', this.editingItem.launchDate || '');
    
    const features = this.editingItem.features || [];
    const features_en = this.editingItem.features_en || [];
    const specs = (this.editingItem.specs || []).filter(s => s.name && s.value && s.name.trim() !== '' && s.value.trim() !== '');
    const specs_en = (this.editingItem.specs_en || []).filter(s => s.name && s.value && s.name.trim() !== '' && s.value.trim() !== '');
    
    payload.append('features', JSON.stringify(features));
    payload.append('features_en', JSON.stringify(features_en));
    payload.append('specs', JSON.stringify(specs));
    payload.append('specs_en', JSON.stringify(specs_en));

    if (this.selectedFile) {
      payload.append('image_file', this.selectedFile);
    } else if (this.editingItem.image) {
      payload.append('image', this.editingItem.image);
    }

    const req = this.editingItem.id 
      ? this.innovationService.updateInnovation(payload)
      : this.innovationService.addInnovation(payload);

    req.subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res.success) {
          this.showNotification('success', 'Kayıt başarıyla kaydedildi.');
          this.loadInnovations();
          this.closeModal();
        } else {
          this.showNotification('error', res.message || 'Kayıt işlemi başarısız oldu.');
        }
      },
      error: (err: any) => {
        this.isSaving = false;
        this.showNotification('error', 'Sunucu ile bağlantı kurulamadı.');
      }
    });
  }

  deleteItem(id: number) {
    if (confirm('Bu projeyi silmek istediğinize emin misiniz?')) {
      this.innovationService.deleteInnovation(id).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.loadInnovations();
            this.showNotification('success', 'Kayıt başarıyla silindi.');
          } else {
            this.showNotification('error', res.message || 'Silme işlemi başarısız oldu.');
          }
        },
        error: (err: any) => {
          this.showNotification('error', 'Sunucu ile bağlantı kurulamadı.');
        }
      });
    }
  }

  get featuresText(): string {
    return this.editingItem?.features.join('\n') || '';
  }

  set featuresText(val: string) {
    if (this.editingItem) {
      this.editingItem.features = val.split('\n').filter(s => s.trim() !== '');
    }
  }

  get featuresText_en(): string {
    return this.editingItem?.features_en?.join('\n') || '';
  }

  set featuresText_en(val: string) {
    if (this.editingItem) {
      this.editingItem.features_en = val.split('\n').filter(s => s.trim() !== '');
    }
  }

  showNotification(type: 'success' | 'error', message: string) {
    this.notification = { type, message };
    setTimeout(() => this.notification = null, 3000);
  }
}

