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
  readonly galleryImgs = [
    { src: 'assets/img/gallery-1.avif', altKey: 'about.gallery_alt_1' },
    { src: 'assets/img/gallery-2.avif', altKey: 'about.gallery_alt_2' },
    { src: 'assets/img/gallery-3.avif', altKey: 'about.gallery_alt_3' },
    { src: 'assets/img/gallery-4.avif', altKey: 'about.gallery_alt_4' },
    { src: 'assets/img/gallery-5.avif', altKey: 'about.gallery_alt_5' },
    { src: 'assets/img/gallery-6.avif', altKey: 'about.gallery_alt_6' },
  ];

  // Freeform-коллаж (md+): холст aspect-[10/9], тайлы absolute, позиции/размеры — с референса.
  // Слои: z-30 центр, z-40 тайл поверх центра, z-10/20 — под ним. Два правых тайла ни на кого не наезжают.
  readonly galleryTiles = [
    // верх-право: парит отдельно; горизонталь
    {
      img: this.galleryImgs[0],
      class:
        'left-[75%] top-[4%] w-[35%] aspect-[4/3] z-10 float-x [animation-delay:2.1s] [animation-duration:7s]',
    },
    // верх-лево: центр наезжает на его правый нижний угол; дуга
    {
      img: this.galleryImgs[1],
      class: 'left-[-10%] top-0 w-[40%] aspect-[4/3] z-10 float-a [animation-delay:0.4s]',
    },
    // ЦЕНТР — главное экшн-фото, верхний слой (кроме тайла с z-40); вертикаль, медленно
    {
      img: this.galleryImgs[2],
      class: 'left-[27%] top-[8%] w-[45%] aspect-square z-30 float-y [animation-duration:7s]',
    },
    // лево-низ: подныривает ПОД центр; обратная дуга
    {
      img: this.galleryImgs[3],
      class: 'left-[4%] top-[42%] w-[35%] aspect-[3/4] z-20 float-b [animation-delay:1.5s]',
    },
    // право-середина: парит отдельно; дуга, самая медленная
    {
      img: this.galleryImgs[4],
      class:
        'left-[78%] top-[38%] w-[30%] aspect-[4/5] z-10 float-a [animation-delay:2.8s] [animation-duration:12s]',
    },
    // низ-право: лежит ПОВЕРХ угла центра; горизонталь
    {
      img: this.galleryImgs[5],
      class:
        'left-[47%] top-[60%] w-[45%] aspect-[4/3] z-40 float-x [animation-delay:1.1s] [animation-duration:9s]',
    },
  ];

  // Мобильная раскладка: главное фото на всю ширину, потом 2×2, снизу широкое
  // Мобильный freeform-коллаж: холст aspect-[4/5], та же логика слоёв, что на десктопе
  readonly galleryMobileTiles = [
    // верх-право: парит отдельно; горизонталь
    {
      img: this.galleryImgs[0],
      class:
        'left-[58%] top-[6%] w-[40%] aspect-square z-40 float-x [animation-delay:0.6s] [animation-duration:6s]',
    },
    // верх-лево: центр наезжает на его угол; обратная дуга
    {
      img: this.galleryImgs[1],
      class: 'left-0 top-0 w-[44%] aspect-[4/3] z-10 float-b [animation-delay:1.1s]',
    },
    // ЦЕНТР — главное экшн-фото; вертикаль, медленно
    {
      img: this.galleryImgs[2],
      class: 'left-[20%] top-[16%] w-[56%] aspect-[3/4] z-30 float-y [animation-duration:8s]',
    },
    // лево-низ: подныривает ПОД центр; дуга
    {
      img: this.galleryImgs[3],
      class: 'left-0 top-[48%] w-[34%] aspect-[3/4] z-20 float-a [animation-delay:2.6s]',
    },
    // право-середина: парит отдельно; вертикаль
    {
      img: this.galleryImgs[4],
      class:
        'left-[78%] top-[40%] w-[22%] aspect-[4/5] z-10 float-y [animation-delay:2.3s] [animation-duration:5s]',
    },
    // низ-право: ПОВЕРХ угла центра; обратная дуга, медленно
    {
      img: this.galleryImgs[5],
      class:
        'left-[40%] top-[70%] w-[60%] aspect-[4/3] z-40 float-b [animation-delay:1.8s] [animation-duration:13s]',
    },
  ];

  readonly stats = [
    { key: 'about.stat_founded', value: '2019' },
    { key: 'about.stat_locations', value: '2' },
    { key: 'about.stat_dan', value: '5段' },
    { key: 'about.stat_members', value: '100+' },
  ];

  // Тизер расписания — те же i18n-ключи, что и в футере (DRY);
  // animClass — разнобой фаз парения, как у карточек галереи
  readonly schedule = [
    {
      name: 'Yuei Honbu',
      hoursKey: 'footer.honbu_hours',
      addressKey: 'footer.honbu_address',
      animClass: '[animation-delay:0.7s]',
    },
    {
      name: 'Yuei Cầu Giấy',
      hoursKey: 'footer.caugiay_hours',
      addressKey: 'footer.caugiay_address',
      animClass: '[animation-delay:2.2s] [animation-duration:7s]',
    },
    {
      name: 'Yuei Đống Đa',
      hoursKey: 'footer.dongda_hours',
      addressKey: 'footer.dongda_address',
      animClass: '[animation-delay:1.4s] [animation-duration:5s]',
    },
  ];

  readonly instructor = {
    photo: 'assets/img/object.png',
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
