import { Injectable, signal, effect, computed, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly localStorageKey = 'theme';
  private readonly themeCycle: Theme[] = ['system', 'light', 'dark'];
  private readonly isBrowser: boolean = false;
  private readonly mediaQuery?: MediaQueryList;

  private systemPrefersDark = signal<boolean>(false);
  public theme = signal<Theme>('system');

  public isDark = computed(() =>
    this.theme() === 'system' ? this.systemPrefersDark() : this.theme() === 'dark'
  );

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemPrefersDark.set(this.mediaQuery.matches);
      this.mediaQuery.addEventListener('change', this.handleMediaChange);

      this.loadSavedTheme();
    }

    effect(() => {
      if (!this.isBrowser) {
        return;
      }

      document.documentElement.classList.toggle('dark', this.isDark());
      localStorage.setItem(this.localStorageKey, this.theme());
    });
  }

  ngOnDestroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleMediaChange);
    }
  }

  public toggleTheme(): void {
    const index = (this.themeCycle.indexOf(this.theme()) + 1) % this.themeCycle.length;
    this.theme.set(this.themeCycle[index]);
  }

  private handleMediaChange = (e: MediaQueryListEvent) => {
    this.systemPrefersDark.set(e.matches);
  };

  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem(this.localStorageKey) as Theme | null;
    if (savedTheme) {
      this.theme.set(savedTheme);
    }
  }
}
