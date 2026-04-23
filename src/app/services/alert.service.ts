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

  showSuccess(message: string) {
    this.alertSubject.next({ type: 'success', message });
    this.clearAfterDelay();
  }

  showError(message: string) {
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
