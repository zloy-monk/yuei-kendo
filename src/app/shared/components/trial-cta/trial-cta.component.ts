import { Component, inject } from '@angular/core';
import { TranslateService } from '../../../core/services/translate.service';
import { GOOGLE_FORM_URL } from '../../../core/constants';
import { RevealDirective } from '../../directives/reveal.directive';

// CTA «Пробное занятие» — используется на Главной и в конце FAQ
@Component({
  selector: 'app-trial-cta',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './trial-cta.component.html',
})
export class TrialCtaComponent {
  translate = inject(TranslateService);
  readonly formUrl = GOOGLE_FORM_URL;
}
