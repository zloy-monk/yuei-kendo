import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RedirectCommand, Router, Routes } from '@angular/router';
import { SUPPORTED_LANGS } from './core/constants';

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
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/faq/faq.component').then((m) => m.FaqComponent),
      },
    ],
  },

  // Всё остальное — редирект на главную
  {
    path: '**',
    redirectTo: 'vi',
  },
];
