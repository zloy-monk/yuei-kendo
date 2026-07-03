import { Directive, ElementRef, OnDestroy, PLATFORM_ID, inject, afterNextRender } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Scroll-reveal: элемент плавно появляется при попадании в viewport.
// SSR-безопасно: на сервере классы не вешаются вообще, поэтому в пререндеренном
// HTML контент полностью видим (важно для SEO и работы без JS).
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      const node = this.el.nativeElement;
      node.classList.add('reveal');
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            node.classList.add('reveal-in');
            this.observer?.disconnect();
          }
        },
        { threshold: 0.15 },
      );
      this.observer.observe(node);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
