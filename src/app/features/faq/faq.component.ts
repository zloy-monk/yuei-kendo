import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '../../core/services/translate.service';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

type FaqSegment =
  | { type: 'p';  key: string }
  | { type: 'ul'; keys: string[] };

interface FaqItem {
  q: string;
  segments: FaqSegment[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  readonly ChevronDownIcon = ChevronDown;

  openIndex = signal<number | null>(null);

  toggle(i: number) {
    const opening = this.openIndex() !== i;
    this.openIndex.set(opening ? i : null);
    if (opening && isPlatformBrowser(this.platformId)) {
      // Схлопывание предыдущего открытого пункта меняет DOM синхронно после этого клика,
      // но Angular перерисовывает разметку только в следующем тике — ждём его, иначе
      // scrollIntoView считает позицию по старой высоте разметки.
      setTimeout(() => {
        document.getElementById('faq-item-' + i)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  readonly items: FaqItem[] = [
    {
      q: 'faq.q1',
      segments: [
        { type: 'p', key: 'faq.a1_p1' },
        { type: 'p', key: 'faq.a1_p2' },
      ],
    },
    {
      q: 'faq.q2',
      segments: [
        { type: 'p', key: 'faq.a2_intro' },
        { type: 'ul', keys: ['faq.a2_b1', 'faq.a2_b2', 'faq.a2_b3', 'faq.a2_b4', 'faq.a2_b5', 'faq.a2_b6', 'faq.a2_b7'] },
      ],
    },
    {
      q: 'faq.q3',
      segments: [{ type: 'p', key: 'faq.a3_p1' }],
    },
    {
      q: 'faq.q4',
      segments: [
        { type: 'p', key: 'faq.a4_intro' },
        { type: 'ul', keys: ['faq.a4_b1', 'faq.a4_b2', 'faq.a4_b3', 'faq.a4_b4', 'faq.a4_b5', 'faq.a4_b6'] },
      ],
    },
    {
      q: 'faq.q5',
      segments: [{ type: 'p', key: 'faq.a5_p1' }],
    },
    {
      q: 'faq.q6',
      segments: [{ type: 'p', key: 'faq.a6_p1' }],
    },
    {
      q: 'faq.q7',
      segments: [
        { type: 'p', key: 'faq.a7_p1' },
        { type: 'p', key: 'faq.a7_p2' },
      ],
    },
    {
      q: 'faq.q8',
      segments: [
        { type: 'p', key: 'faq.a8_intro' },
        { type: 'ul', keys: ['faq.a8_b1', 'faq.a8_b2', 'faq.a8_b3', 'faq.a8_b4'] },
      ],
    },
    {
      q: 'faq.q9',
      segments: [{ type: 'p', key: 'faq.a9_p1' }],
    },
    {
      q: 'faq.q10',
      segments: [{ type: 'p', key: 'faq.a10_p1' }],
    },
  ];
}
