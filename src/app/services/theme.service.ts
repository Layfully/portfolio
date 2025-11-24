import { Injectable, signal, effect, computed, PLATFORM_ID, OnDestroy, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly localStorageKey = 'theme';
  private readonly themeCycle: Theme[] = ['system', 'light', 'dark'];
  private readonly isBrowser: boolean;
  private readonly mediaQuery?: MediaQueryList;

  private systemPrefersDark = signal(false);
  public theme = signal<Theme>('system');

  public isDark = computed(() =>
    this.theme() === 'system' ? this.systemPrefersDark() : this.theme() === 'dark'
  );

  constructor() {
    const platformId = inject(PLATFORM_ID);

    this.isBrowser = isPlatformBrowser(platformId);

    if (!this.isBrowser) return;

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPrefersDark.set(this.mediaQuery.matches);
    this.mediaQuery.addEventListener('change', this.handleMediaChange);
    this.loadSavedTheme();

    effect(() => {
      document.documentElement.classList.toggle('dark', this.isDark());
      localStorage.setItem(this.localStorageKey, this.theme());
    });
  }

  ngOnDestroy = (): void => this.mediaQuery?.removeEventListener('change', this.handleMediaChange);

  public toggleTheme = (): void => this.theme.set(this.themeCycle[(this.themeCycle.indexOf(this.theme()) + 1) % this.themeCycle.length]);

  private handleMediaChange = (e: MediaQueryListEvent) => this.systemPrefersDark.set(e.matches);

  private loadSavedTheme = (): void => {
    const theme = localStorage.getItem(this.localStorageKey) as Theme;
    theme && this.theme.set(theme);
  }
}
