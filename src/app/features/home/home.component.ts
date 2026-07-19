import { Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '../../core/services/translate.service';
import { SeoService } from '../../core/services/seo.service';
import { GOOGLE_FORM_URL, SITE_URL } from '../../core/constants';
import { FAQ_TEASER_ITEMS } from '../../core/faq-data';
import { FaqAccordionComponent } from '../../shared/components/faq-accordion/faq-accordion.component';
import { TrialCtaComponent } from '../../shared/components/trial-cta/trial-cta.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { CountUpDirective } from '../../shared/directives/count-up.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    FaqAccordionComponent,
    TrialCtaComponent,
    RevealDirective,
    CountUpDirective,
  ],
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
  // 6 фото галереи; раскладки ниже ссылаются на эти объекты (src/alt не дублируются)
  private readonly galleryImgs = [
    { src: 'assets/img/gallery-1.avif', altKey: 'about.gallery_alt_1' },
    { src: 'assets/img/gallery-2.avif', altKey: 'about.gallery_alt_2' },
    { src: 'assets/img/gallery-3.avif', altKey: 'about.gallery_alt_3' },
    { src: 'assets/img/gallery-4.avif', altKey: 'about.gallery_alt_4' },
    { src: 'assets/img/gallery-5.avif', altKey: 'about.gallery_alt_5' },
    { src: 'assets/img/gallery-6.avif', altKey: 'about.gallery_alt_6' },
  ];

  // Десктоп-коллаж: 3 колонки, боковые с одинаковым сдвигом вниз — симметрия вокруг центра
  readonly galleryCols = [
    {
      class: 'flex-1 pt-16',
      imgs: [
        { img: this.galleryImgs[0], aspect: 'aspect-[3/4]' },
        { img: this.galleryImgs[1], aspect: 'aspect-square' },
      ],
    },
    {
      class: 'flex-[1.7]',
      imgs: [
        { img: this.galleryImgs[2], aspect: 'aspect-[4/5]' },
        { img: this.galleryImgs[3], aspect: 'aspect-[16/9]' },
      ],
    },
    {
      class: 'flex-1 pt-16',
      imgs: [
        { img: this.galleryImgs[4], aspect: 'aspect-square' },
        { img: this.galleryImgs[5], aspect: 'aspect-[3/4]' },
      ],
    },
  ];

  // Мобильная раскладка: главное фото на всю ширину, потом 2×2, снизу широкое
  readonly galleryMobile = [
    { img: this.galleryImgs[2], class: 'col-span-2 aspect-[4/3]' },
    { img: this.galleryImgs[0], class: 'aspect-square' },
    { img: this.galleryImgs[4], class: 'aspect-square' },
    { img: this.galleryImgs[1], class: 'aspect-square' },
    { img: this.galleryImgs[5], class: 'aspect-square' },
    { img: this.galleryImgs[3], class: 'col-span-2 aspect-[16/9]' },
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
    {
      name: 'Yuei Cầu Giấy',
      hoursKey: 'footer.caugiay_hours',
      addressKey: 'footer.caugiay_address',
    },
    { name: 'Yuei Đống Đa', hoursKey: 'footer.dongda_hours', addressKey: 'footer.dongda_address' },
  ];

  readonly instructor = {
    photo: 'assets/img/instructor.avif',
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
