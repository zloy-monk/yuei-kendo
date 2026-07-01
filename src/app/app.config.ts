import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withFetch — использует браузерный fetch вместо XHR, работает и в Node.js (SSR)
    provideHttpClient(withFetch()),
    // withComponentInputBinding — позволяет получать route params напрямую через @Input()
    // Например: @Input() lang!: string; вместо inject(ActivatedRoute)
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    // withEventReplay — запоминает события пользователя во время гидратации и воспроизводит их
    provideClientHydration(withEventReplay()),
  ],
};
