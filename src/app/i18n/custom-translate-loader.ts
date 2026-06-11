import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { translations } from './translations';

export class CustomTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const key = lang.toLowerCase() === 'tr' ? 'tr' : 'en';
    return of(translations[key] || translations.tr);
  }
}
