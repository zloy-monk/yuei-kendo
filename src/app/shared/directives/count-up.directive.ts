import { Directive, ElementRef, OnDestroy, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const DURATION_MS = 1200;

// Анимированный счётчик: '2019' → отсчёт 0→2019, '100+' → 0→100 с суффиксом '+', '5段' → 0→5 + '段'.
// Запускается один раз при попадании в viewport. На сервере не трогает текст —
// в пререндеренном HTML остаются финальные значения (SEO / работа без JS).
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;
  private rafId?: number;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const node = this.el.nativeElement;
      const original = node.textContent?.trim() ?? '';
      const match = original.match(/^(\d+)(.*)$/);
      if (!match) return; // нечисловое значение — оставляем как есть

      const target = parseInt(match[1], 10);
      const suffix = match[2];

      this.observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          this.observer?.disconnect();

          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / DURATION_MS, 1);
            // ease-out cubic — быстро в начале, плавное торможение в конце
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) this.rafId = requestAnimationFrame(tick);
          };
          this.rafId = requestAnimationFrame(tick);
        },
        { threshold: 0.5 },
      );
      this.observer.observe(node);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    if (this.rafId !== undefined) cancelAnimationFrame(this.rafId);
  }
}
