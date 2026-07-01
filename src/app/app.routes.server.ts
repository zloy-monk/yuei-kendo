import { RenderMode, ServerRoute } from '@angular/ssr';

const LANGS = ['vi', 'en', 'ru', 'ja'];
const langParams = async () => LANGS.map(lang => ({ lang }));

export const serverRoutes: ServerRoute[] = [
  // Корень и wildcard — Server (редиректы, не рендерят HTML)
  { path: '',   renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },

  // Статичные страницы — prerender при билде (быстро, SEO-дружественно)
  { path: ':lang',          renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/about',    renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/faq',      renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/schedule', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/events',   renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/glossary', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/contact',  renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/blog',     renderMode: RenderMode.Prerender, getPrerenderParams: langParams },

  // Посты — SSR по запросу (slug динамический)
  { path: ':lang/blog/:slug', renderMode: RenderMode.Server },
];
