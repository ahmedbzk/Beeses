import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  type: 'success' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert | null>();
  alert$ = this.alertSubject.asObservable();

  private lastErrorMessage = '';
  private lastErrorTime = 0;

  showSuccess(message: string) {
    this.alertSubject.next({ type: 'success', message });
    this.clearAfterDelay();
  }

  showError(message: string) {
    const now = Date.now();
    
    const isGeneric = message.includes('hata oluştu') || message.includes('hatası') || message.includes('başarısız') || message.includes('Hata');
    const isRecentAuthError = (this.lastErrorMessage.includes('yetkiniz') || this.lastErrorMessage.includes('Yetkisiz')) && (now - this.lastErrorTime < 800);
    
    if (isGeneric && isRecentAuthError) {
      return;
    }

    this.lastErrorMessage = message;
    this.lastErrorTime = now;

    this.alertSubject.next({ type: 'error', message });
    this.clearAfterDelay();
  }

  clear() {
    this.alertSubject.next(null);
  }

  private clearAfterDelay() {
    setTimeout(() => {
      this.clear();
    }, 4000);
  }
}
