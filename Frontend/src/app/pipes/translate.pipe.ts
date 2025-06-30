import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription | null = null;
  private lastKey: string = '';
  private lastValue: string = '';

  constructor(private translationService: TranslationService) {}

  transform(key: string): string {
    // Always get the current translation
    const result = this.translationService.translate(key);
    console.log(`Translate pipe: ${key} -> ${result}`);
    
    // Subscribe to language changes to force updates
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    this.subscription = this.translationService.currentLanguage$.subscribe(() => {
      // This will trigger the pipe to re-evaluate
      console.log(`Language changed, pipe should update for key: ${key}`);
    });

    return result;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

@Pipe({
  name: 'translateAsync',
  standalone: true
})
export class TranslateAsyncPipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: string): Observable<string> {
    return this.translationService.translateAsync(key);
  }
} 