import { Component, effect, inject } from '@angular/core';
import { TranslateService } from '../../core/services/translate.service';
import { SeoService } from '../../core/services/seo.service';
import { SITE_URL } from '../../core/constants';
import { FAQ_ITEMS } from '../../core/faq-data';
import { FaqAccordionComponent } from '../../shared/components/faq-accordion/faq-accordion.component';
import { TrialCtaComponent } from '../../shared/components/trial-cta/trial-cta.component';
import { DitherBgComponent } from '../../shared/components/dither-bg/dither-bg.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [FaqAccordionComponent, TrialCtaComponent, DitherBgComponent],
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  translate = inject(TranslateService);
  private seo = inject(SeoService);

  readonly items = FAQ_ITEMS;

  constructor() {
    // effect — SEO-теги обновляются и при смене языка (роут остаётся тем же компонентом)
    effect(() => {
      const lang = this.translate.lang();
      this.seo.setPage({
        title: this.translate.t('faq.seo_title'),
        description: this.translate.t('faq.seo_desc'),
        canonical: `${SITE_URL}/${lang}/faq`,
        lang,
        jsonLd: this.buildFaqJsonLd(),
      });
    });
  }

  // FAQPage schema — rich snippets в Google (вопросы прямо в выдаче)
  private buildFaqJsonLd(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: this.items.map((item) => ({
        '@type': 'Question',
        name: this.translate.t(item.q),
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.segments
            .map((seg) =>
              seg.type === 'p'
                ? this.translate.t(seg.key)
                : seg.keys.map((k) => this.translate.t(k)).join(' '),
            )
            .join(' '),
        },
      })),
    };
  }
}
