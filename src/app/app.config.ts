import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';

const storyblokImageLoader = (config: ImageLoaderConfig) => {
  const width = config.width || 256;
  return `${config.src}/m/${width}x0/filters:format(webp)`;
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('service-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately'
    }),
    {
      provide: IMAGE_LOADER,
      useValue: storyblokImageLoader,
    },
  ]
};
