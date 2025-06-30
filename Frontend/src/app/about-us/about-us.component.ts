import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../pipes/translate.pipe';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor(
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    // Ensure the translation service is properly initialized
    const currentLang = localStorage.getItem('language') || 'en';
    this.translationService.loadLanguage(currentLang);
  }

  testLanguage(lang: string): void {
    console.log('Testing language switch to:', lang);
    this.translationService.loadLanguage(lang);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
} 