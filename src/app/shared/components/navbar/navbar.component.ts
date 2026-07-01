import { Component, HostListener, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { LucideAngularModule, Menu, X, ChevronDown } from 'lucide-angular';
import { TranslateService } from '../../../core/services/translate.service';
import { GOOGLE_FORM_URL } from '../../../core/constants';

interface NavLink {
  key: string;
  path: string;
  external: boolean;
}

const SUPPORTED_LANGS = ['vi', 'en', 'ru', 'ja'];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
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

  readonly MenuIcon = Menu;
  readonly XIcon = X;
  readonly ChevronDownIcon = ChevronDown;

  readonly links: NavLink[] = [
    { key: 'nav.home', path: '', external: false },
    { key: 'nav.about', path: 'about', external: false },
    { key: 'nav.faq', path: 'faq', external: false },
    { key: 'nav.register', path: GOOGLE_FORM_URL, external: true },
  ];

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 50);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
    this.isLangOpen.set(false);
  }

  ngOnInit() {
    this.updateLang(this.router.url);

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.updateLang((e as NavigationEnd).urlAfterRedirects);
      this.closeMenu();
    });
  }

  private updateLang(url: string) {
    const segment = url.split('/')[1];
    const lang = SUPPORTED_LANGS.includes(segment) ? segment : 'vi';
    this.lang.set(lang);
    this.translate.load(lang);
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
