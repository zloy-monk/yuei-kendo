import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_URL, SUPPORTED_LANGS } from '../constants';

export interface SeoConfig {
  title: string;
  description: string;
  canonical: string;
  lang: string;
  image?: string;
  jsonLd?: object;
}

const SITE_NAME = 'YUEI KENDO';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  setPage(config: SeoConfig): void {
    const fullTitle = `${config.title} | ${SITE_NAME}`;

    // Заголовок вкладки
    this.title.setTitle(fullTitle);

    // Базовые мета-теги
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: config.canonical });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }

    // Язык страницы
    this.document.documentElement.lang = config.lang;

    // canonical + hreflang через <link> теги в <head>
    this.setLinkTags(config.canonical, config.lang);

    // JSON-LD структурированные данные
    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    }
  }

  private setLinkTags(canonical: string, currentLang: string): void {
    // Удаляем старые теги чтобы не дублировать при навигации
    this.document.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach(el => el.remove());

    // Получаем базовый путь страницы без языкового префикса
    // Например: /vi/blog → /blog
    const path = canonical.replace(SITE_URL, '').replace(`/${currentLang}`, '') || '/';

    // canonical — говорим гуглу какой URL считать основным
    this.appendLink({ rel: 'canonical', href: canonical });

    // hreflang для каждого языка
    SUPPORTED_LANGS.forEach(lang => {
      this.appendLink({
        rel: 'alternate',
        hreflang: lang,
        href: `${SITE_URL}/${lang}${path}`,
      });
    });

    // x-default — язык по умолчанию для пользователей без конкретного языка
    this.appendLink({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${SITE_URL}/vi${path}`,
    });
  }

  private setJsonLd(data: object): void {
    // Удаляем старый JSON-LD скрипт
    this.document.querySelector('script[type="application/ld+json"]')?.remove();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  private appendLink(attrs: Record<string, string>): void {
    const link = this.document.createElement('link');
    Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
    this.document.head.appendChild(link);
  }
}
