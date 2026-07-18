import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding — позволяет получать route params напрямую через @Input()
    // Например: @Input() lang!: string; вместо inject(ActivatedRoute)
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    // Anchor-скролл роутера игнорирует CSS scroll-margin — offset задаётся скроллеру
    // напрямую (высота фиксированного навбара + запас, как scroll-mt-28)
    provideAppInitializer(() => {
      inject(ViewportScroller).setOffset([0, 80]);
    }),
    // withEventReplay — запоминает события пользователя во время гидратации и воспроизводит их
    provideClientHydration(withEventReplay()),
  ],
};
