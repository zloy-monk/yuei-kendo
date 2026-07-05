import { Injectable, Signal, computed, signal } from '@angular/core';

// Статичные импорты — без HTTP-запросов, работает одинаково на сервере и клиенте
import vi from '../../../assets/i18n/vi.json';
import en from '../../../assets/i18n/en.json';
import ru from '../../../assets/i18n/ru.json';
import ja from '../../../assets/i18n/ja.json';

type Translations = Record<string, Record<string, string>>;

const DICTIONARY: Record<string, Translations> = { vi, en, ru, ja };

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private translations = signal<Translations>(vi);

  // Текущий язык — реактивный сигнал (нужен SEO и любым подписчикам)
  readonly lang = signal<string>('vi');

  // Вызывается при смене языка — просто меняем сигнал
  load(lang: string): void {
    this.translations.set(DICTIONARY[lang] ?? vi);
    this.lang.set(DICTIONARY[lang] ? lang : 'vi');
  }

  // t('nav.home') → 'Trang chủ'
  t(key: string): string {
    const [section, field] = key.split('.');
    return this.translations()[section]?.[field] ?? key;
  }

  // Сигнал для реактивного использования внутри computed()
  select(key: string): Signal<string> {
    return computed(() => this.t(key));
  }
}
