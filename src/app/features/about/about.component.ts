import { Component, inject } from '@angular/core';
import { TranslateService } from '../../core/services/translate.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
})
export class AboutComponent {
  translate = inject(TranslateService);

  readonly gallery = [
    '/assets/img/gallery-1.jpg',
    '/assets/img/gallery-2.jpg',
    '/assets/img/gallery-3.jpg',
    '/assets/img/gallery-4.jpg',
    '/assets/img/gallery-5.jpg',
    '/assets/img/gallery-6.jpg',
  ];
}
