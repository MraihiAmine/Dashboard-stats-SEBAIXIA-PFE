import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private subscription: Subscription | null = null;

  constructor(
    private translationService: TranslationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  transform(key: string): string {
    // Get the current translation
    const result = this.translationService.translate(key);
    
    // Subscribe to language changes to force updates
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    this.subscription = this.translationService.currentLanguage$.subscribe(() => {
      // Force change detection when language changes
      this.changeDetector.markForCheck();
    });

    return result || key; // Return the key if no translation found
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