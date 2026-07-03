// Данные FAQ — общие для страницы /faq (все вопросы) и тизера на Главной (топ-3)

export type FaqSegment =
  | { type: 'p'; key: string }
  | { type: 'ul'; keys: string[] };

export interface FaqItem {
  q: string;
  segments: FaqSegment[];
}

export const FAQ_ITEMS: FaqItem[] = [
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
      {
        type: 'ul',
        keys: ['faq.a2_b1', 'faq.a2_b2', 'faq.a2_b3', 'faq.a2_b4', 'faq.a2_b5', 'faq.a2_b6', 'faq.a2_b7'],
      },
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

// Топ-3 самых конверсионных вопроса для тизера на Главной:
// пробное занятие (q6), что взять с собой (q7), цена (q9)
export const FAQ_TEASER_ITEMS: FaqItem[] = [FAQ_ITEMS[5], FAQ_ITEMS[6], FAQ_ITEMS[8]];
