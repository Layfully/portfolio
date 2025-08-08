import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Language {
  code: string;
  name: string;
  flag: string;
  path: string;
}

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex items-center space-x-3">
      @for (lang of otherLanguages; track lang.code) {
        <a [routerLink]="lang.path" [title]="'Switch to ' + lang.name" class="opacity-60 hover:opacity-100 transition-opacity">
          <img [src]="lang.flag" [alt]="lang.name + ' flag'" class="w-6 h-auto rounded-sm">
        </a>
      }
    </div>
  `,
})
export class LanguageSwitcher {
  currentLang: string = 'en';
  otherLanguages: Language[] = [];

  private allLanguages: Language[] = [
    { code: 'en', name: 'English', flag: '/assets/images/flags/us.svg', path: '/' },
    { code: 'pl', name: 'Polski', flag: '/assets/images/flags/pl.svg', path: '/pl' }
  ];

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateLanguages(event.urlAfterRedirects);
    });

    this.updateLanguages(this.router.url);
  }

  private updateLanguages(url: string): void {
    this.currentLang = url.startsWith('/pl') ? 'pl' : 'en';
    this.otherLanguages = this.allLanguages.filter(lang => lang.code !== this.currentLang);
  }
}
