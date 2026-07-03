import { Component, HostListener, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { LucideAngularModule, Menu, X, ChevronDown } from 'lucide-angular';
import { TranslateService } from '../../../core/services/translate.service';
import { GOOGLE_FORM_URL, SUPPORTED_LANGS } from '../../../core/constants';

interface NavLink {
  key: string;
  path: string;
  fragment?: string;
  external: boolean;
}
// id-шники секций на Главной, за которыми следит scroll-spy (те же, что fragment в links)
const SCROLL_SPY_IDS = ['about', 'sensei', 'faq'];
// высота навбара + запас — та же величина, что scroll-mt-28 (7rem = 112px) у секций
const SCROLL_SPY_OFFSET = 120;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  translate = inject(TranslateService);

  lang = signal<string>('vi');
  isMenuOpen = signal(false);
  isLangOpen = signal(false);
  isScrolled = signal(false);
  activeFragment = signal<string | null>(null);
  private currentPath = signal<string>('');

  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly ChevronDownIcon = ChevronDown;

  readonly langs = SUPPORTED_LANGS;

  readonly links: NavLink[] = [
    { key: 'nav.home', path: '', external: false },
    { key: 'nav.about', path: '', fragment: 'about', external: false },
    { key: 'nav.sensei', path: '', fragment: 'sensei', external: false },
    { key: 'nav.faq', path: '', fragment: 'faq', external: false },
    { key: 'nav.register', path: GOOGLE_FORM_URL, external: true },
  ];

  // rAF-throttle: scroll-события летят десятками в секунду, а getBoundingClientRect
  // форсирует reflow — считаем не чаще одного раза на кадр
  private scrollTicking = false;

  @HostListener('window:scroll')
  onScroll() {
    if (!isPlatformBrowser(this.platformId) || this.scrollTicking) return;
    this.scrollTicking = true;
    requestAnimationFrame(() => {
      this.isScrolled.set(window.scrollY > 50);
      this.updateActiveFragment();
      this.scrollTicking = false;
    });
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
    this.isLangOpen.set(false);
  }

  ngOnInit() {
    this.updateLang(this.router.url);
    this.updateActiveFragment();

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.updateLang((e as NavigationEnd).urlAfterRedirects);
      this.updateActiveFragment();
      this.closeMenu();
    });
  }

  private updateLang(url: string) {
    const clean = url.split('?')[0].split('#')[0];
    const segments = clean.split('/').filter(Boolean);
    const lang = SUPPORTED_LANGS.includes(segments[0]) ? segments[0] : 'vi';
    this.lang.set(lang);
    this.translate.load(lang);
    this.currentPath.set(segments.slice(1).join('/'));
  }

  // Scroll-spy: находим последнюю секцию (по порядку на странице), верхняя граница
  // которой уже выше линии SCROLL_SPY_OFFSET — она и есть "активная" в навбаре
  private updateActiveFragment() {
    if (!isPlatformBrowser(this.platformId)) return;
    let current: string | null = null;
    for (const id of SCROLL_SPY_IDS) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= SCROLL_SPY_OFFSET) {
        current = id;
      }
    }
    this.activeFragment.set(current);
  }

  isActive(link: NavLink): boolean {
    if (link.external || this.currentPath() !== link.path) return false;
    return link.fragment ? this.activeFragment() === link.fragment : this.activeFragment() === null;
  }

  buildLink(path: string): string[] {
    return path ? ['/', this.lang(), path] : ['/', this.lang()];
  }

  switchLang(newLang: string) {
    const path = this.router.url.split('?')[0];
    const segments = path.split('/').filter(Boolean);
    segments[0] = newLang;
    this.router.navigate(['/', ...segments]);
    this.isLangOpen.set(false);
  }

  toggleLang() {
    this.isLangOpen.update((v) => !v);
  }

  toggleMenu() {
    this.isMenuOpen.update((v) => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
