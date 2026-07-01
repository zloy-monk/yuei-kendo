import { Component, inject } from '@angular/core';
import { TranslateService } from '../../core/services/translate.service';
import { GOOGLE_FORM_URL } from '../../core/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
})
export class HomeComponent {
  translate = inject(TranslateService);
  readonly formUrl = GOOGLE_FORM_URL;

  // Ключи 'about.*' переиспользуются намеренно — секция инструктора
  // отражает контент страницы About, отдельного дубля в i18n не заводим.
  readonly gallery = [
    'assets/img/gallery-1.jpg',
    'assets/img/gallery-2.jpg',
    'assets/img/gallery-3.jpg',
    'assets/img/gallery-4.jpg',
    'assets/img/gallery-5.jpg',
    'assets/img/gallery-6.jpg',
  ];

  readonly stats = [
    { key: 'about.stat_founded', value: '2019' },
    { key: 'about.stat_locations', value: '2' },
    { key: 'about.stat_dan', value: '5段' },
    { key: 'about.stat_members', value: '100+' },
  ];

  readonly instructor = {
    photo: 'assets/img/instructor.png',
    name: 'Nguyễn Mạnh Hưng',
    dan: '5段 (Godan)',
    credKeys: [
      'about.instructor_kendo',
      'about.instructor_teaching',
      'about.instructor_competitions',
    ],
  };
}
