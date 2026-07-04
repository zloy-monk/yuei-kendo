import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../../core/services/translate.service';
import { SeoService } from '../../core/services/seo.service';
import { GOOGLE_FORM_URL, SITE_URL } from '../../core/constants';
import { FAQ_TEASER_ITEMS } from '../../core/faq-data';
import { FaqAccordionComponent } from '../../shared/components/faq-accordion/faq-accordion.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { CountUpDirective } from '../../shared/directives/count-up.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FaqAccordionComponent, RevealDirective, CountUpDirective],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  translate = inject(TranslateService);
  private seo = inject(SeoService);

  readonly formUrl = GOOGLE_FORM_URL;
  readonly faqTeaser = FAQ_TEASER_ITEMS;
  readonly lang = this.translate.lang;

  // Ключи 'about.*' переиспользуются намеренно — секция инструктора
  // отражает контент страницы About, отдельного дубля в i18n не заводим.
  readonly gallery = [
    { src: 'assets/img/gallery-1.jpg', altKey: 'about.gallery_alt_1' },
    { src: 'assets/img/gallery-2.jpg', altKey: 'about.gallery_alt_2' },
    { src: 'assets/img/gallery-3.jpg', altKey: 'about.gallery_alt_3' },
    { src: 'assets/img/gallery-4.jpg', altKey: 'about.gallery_alt_4' },
    { src: 'assets/img/gallery-5.jpg', altKey: 'about.gallery_alt_5' },
    { src: 'assets/img/gallery-6.jpg', altKey: 'about.gallery_alt_6' },
  ];

  readonly stats = [
    { key: 'about.stat_founded', value: '2019' },
    { key: 'about.stat_locations', value: '2' },
    { key: 'about.stat_dan', value: '5段' },
    { key: 'about.stat_members', value: '100+' },
  ];

  // Тизер расписания — те же i18n-ключи, что и в футере (DRY)
  readonly schedule = [
    { name: 'Yuei Honbu', hoursKey: 'footer.honbu_hours', addressKey: 'footer.honbu_address' },
    { name: 'Yuei Cầu Giấy', hoursKey: 'footer.caugiay_hours', addressKey: 'footer.caugiay_address' },
    { name: 'Yuei Đống Đa', hoursKey: 'footer.dongda_hours', addressKey: 'footer.dongda_address' },
  ];

  readonly instructor = {
    photo: 'assets/img/instructor.png',
    nameKey: 'about.instructor_name',
    dan: '5段 (Godan)',
    credKeys: [
      'about.instructor_kendo',
      'about.instructor_teaching',
      'about.instructor_competitions',
    ],
  };

  constructor() {
    // effect — SEO-теги обновляются и при смене языка (компонент не пересоздаётся)
    effect(() => {
      const lang = this.translate.lang();
      this.seo.setPage({
        title: this.translate.t('home.seo_title'),
        description: this.translate.t('home.seo_desc'),
        canonical: `${SITE_URL}/${lang}`,
        lang,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'SportsActivityLocation',
          name: 'Yuei Kendo Community',
          sport: 'Kendo',
          telephone: '+84936486896',
          foundingDate: '2019',
          address: {
            '@type': 'PostalAddress',
            streetAddress: this.translate.t('footer.honbu_address'),
            addressLocality: 'Hanoi',
            addressCountry: 'VN',
          },
          url: `${SITE_URL}/${lang}`,
        },
      });
    });
  }
}
