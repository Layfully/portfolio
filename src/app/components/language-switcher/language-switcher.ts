import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

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
  imports: [RouterLink],
  template: `
    @for (lang of otherLanguages(); track lang.code) {
      <a
        [routerLink]="lang.path"
        [title]="'Switch to ' + lang.name"
        class="hover:scale-125 cursor-pointer fixed bottom-6 left-6 w-12 h-12
               bg-white dark:bg-neutral-900
               hover:bg-gray-100 dark:hover:bg-neutral-800
               dark:border dark:border-purple-600/50
               rounded-full shadow-lg
               flex items-center justify-center
               duration-150"
      >
        <img [src]="lang.flag" [alt]="lang.name + ' flag'" class="w-6 h-auto rounded-sm">
      </a>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcher {
  currentLang = signal('en');
  otherLanguages = signal<Language[]>([]);

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
    this.currentLang.set(url.startsWith('/pl') ? 'pl' : 'en');
    this.otherLanguages.set(this.allLanguages.filter(lang => lang.code !== this.currentLang()));
  }
}
