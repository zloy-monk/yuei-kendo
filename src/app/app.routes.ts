import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, Router, Routes } from '@angular/router';

const SUPPORTED_LANGS = ['vi', 'en', 'ru', 'ja'];

// Функциональный гард — проверяет что :lang поддерживается
// Если нет — редиректит на /vi/
const langGuard = (route: ActivatedRouteSnapshot) => {
  const lang = route.paramMap.get('lang') ?? '';
  if (SUPPORTED_LANGS.includes(lang)) return true;
  return new RedirectCommand(inject(Router).parseUrl('/vi'));
};

export const routes: Routes = [
  // Редирект с корня на вьетнамский (язык по умолчанию)
  {
    path: '',
    redirectTo: 'vi',
    pathMatch: 'full',
  },

  // Все страницы вложены под /:lang/
  {
    path: ':lang',
    canActivate: [langGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/about/about.component').then(m => m.AboutComponent),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./features/schedule/schedule.component').then(m => m.ScheduleComponent),
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/blog/blog.component').then(m => m.BlogComponent),
      },
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./features/blog/post/post.component').then(m => m.PostComponent),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./features/events/events.component').then(m => m.EventsComponent),
      },
      {
        path: 'glossary',
        loadComponent: () =>
          import('./features/glossary/glossary.component').then(m => m.GlossaryComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact.component').then(m => m.ContactComponent),
      },
      {
        path: 'faq',
        loadComponent: () =>
          import('./features/faq/faq.component').then(m => m.FaqComponent),
      },
    ],
  },

  // Всё остальное — редирект на главную
  {
    path: '**',
    redirectTo: 'vi',
  },
];
