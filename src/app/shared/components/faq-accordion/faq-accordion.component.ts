import { Component, Injector, afterNextRender, inject, input, signal } from '@angular/core';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';
import { TranslateService } from '../../../core/services/translate.service';
import { FaqItem } from '../../../core/faq-data';

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './faq-accordion.component.html',
})
export class FaqAccordionComponent {
  translate = inject(TranslateService);
  private injector = inject(Injector);
  readonly ChevronDownIcon = ChevronDown;

  items = input.required<FaqItem[]>();
  // Префикс для id пунктов — чтобы аккордеон на Главной и на /faq не конфликтовали
  idPrefix = input<string>('faq-item');

  openIndex = signal<number | null>(null);

  toggle(i: number) {
    const opening = this.openIndex() !== i;
    this.openIndex.set(opening ? i : null);
    if (opening) {
      // Ждём перерисовку: схлопывание предыдущего пункта меняет высоту разметки,
      // скроллить нужно по актуальной геометрии. afterNextRender не выполняется на сервере.
      afterNextRender(
        () => {
          document
            .getElementById(this.idPrefix() + '-' + i)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        { injector: this.injector },
      );
    }
  }
}
