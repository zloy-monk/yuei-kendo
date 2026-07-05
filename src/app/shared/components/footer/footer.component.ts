import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  LucideAngularModule,
  Facebook,
  Instagram,
  Youtube,
  Phone,
  MapPin,
  Clock,
} from 'lucide-angular';
import { TranslateService } from '../../../core/services/translate.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  translate = inject(TranslateService);
  private sanitizer = inject(DomSanitizer);

  readonly currentYear = new Date().getFullYear();

  readonly PhoneIcon = Phone;
  readonly MapPinIcon = MapPin;
  readonly ClockIcon = Clock;

  // icon: null → TikTok, у него нет иконки в Lucide, в шаблоне inline SVG
  readonly socials = [
    // { icon: Facebook, href: 'https://facebook.com/yueikendo', label: 'Facebook' },
    // { icon: Instagram, href: 'https://instagram.com/yueikendo', label: 'Instagram' },
    // { icon: Youtube, href: 'https://youtube.com/@yueikendo', label: 'YouTube' },
    // { icon: null, href: 'https://tiktok.com/@ditapkendokhong', label: 'TikTok' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: null, href: '#', label: 'TikTok' },
  ];

  // Embed-карты Google Maps двух залов (Поделиться → Встроить карту → src)
  readonly locations: { name: string; mapSrc: SafeResourceUrl | ''; mapLink: string }[] = [
    {
      name: 'Yuei Đống Đa',
      mapSrc: this.safe(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.3496715478736!2d105.82386067888032!3d21.018690330679025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab78796efb43%3A0x1827ca57b892c6ad!2zOSBQLiDDlCBDaOG7oyBE4burYSwgxJDhu5FuZyDEkGEsIEjDoCBO4buZaSwg0JLRjNC10YLQvdCw0Lw!5e0!3m2!1sru!2s!4v1782850229177!5m2!1sru!2s',
      ),
      mapLink: 'https://maps.google.com/?q=9+Ô+Chợ+Dừa,+Đống+Đa,+Hà+Nội',
    },
    {
      name: 'Yuei Cầu Giấy',
      mapSrc: this.safe(
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.931875081393!2d105.78062757498103!3d21.035411680615585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4ac505bdd1%3A0xfdde85720f96c471!2zMiBOZy4gMTgxIMSQLiBYdcOibiBUaOG7p3ksIEPhuqd1IEdp4bqleSwgSMOgIE7hu5lpIDEwMDAwMCwg0JLRjNC10YLQvdCw0Lw!5e0!3m2!1sru!2s!4v1782850373992!5m2!1sru!2s',
      ),
      mapLink: 'https://maps.google.com/?q=181+Xuân+Thủy,+Cầu+Giấy,+Hà+Nội',
    },
  ];

  private safe(url: string): SafeResourceUrl | '' {
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : '';
  }
}
