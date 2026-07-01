import { RenderMode, ServerRoute } from '@angular/ssr';

const LANGS = ['vi', 'en', 'ru', 'ja'];
const langParams = async () => LANGS.map((lang) => ({ lang }));

export const serverRoutes: ServerRoute[] = [
  // Корень и wildcard — Client (редирект на /vi выполняет Angular Router в браузере,
  // статический хостинг типа GitHub Pages не умеет делать server-side редиректы)
  { path: '', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },

  // Статичные страницы — prerender при билде (быстро, SEO-дружественно)
  { path: ':lang', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/faq', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
];
