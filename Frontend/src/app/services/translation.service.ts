import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TranslationData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<string>('en');
  private translations = new BehaviorSubject<TranslationData>({});
  
  public currentLanguage$ = this.currentLanguage.asObservable();
  public translations$ = this.translations.asObservable();

  constructor(private http: HttpClient) {
    this.loadLanguage(localStorage.getItem('language') || 'en');
  }

  loadLanguage(lang: string): void {
    console.log(`Loading language: ${lang}`);
    this.http.get<TranslationData>(`/assets/i18n/${lang}.json`)
      .subscribe({
        next: (translations) => {
          console.log(`Loaded translations for ${lang}:`, translations);
          this.translations.next(translations);
          this.currentLanguage.next(lang);
          localStorage.setItem('language', lang);
          console.log(`Language ${lang} loaded and set successfully`);
        },
        error: (error) => {
          console.error(`Failed to load translations for ${lang}:`, error);
          // Fallback to English
          if (lang !== 'en') {
            console.log('Falling back to English');
            this.loadLanguage('en');
          }
        }
      });
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  translate(key: string): string {
    const translations = this.translations.value;
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  translateAsync(key: string): Observable<string> {
    return this.translations$.pipe(
      map(translations => {
        const keys = key.split('.');
        let value: any = translations;
        
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return key; // Return the key if translation not found
          }
        }
        
        return typeof value === 'string' ? value : key;
      })
    );
  }

  getAvailableLanguages(): { code: string; name: string; nativeName: string }[] {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' }
    ];
  }
} 