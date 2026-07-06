import { Component, inject } from '@angular/core';
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

  readonly currentYear = new Date().getFullYear();

  readonly PhoneIcon = Phone;
  readonly MapPinIcon = MapPin;
  readonly ClockIcon = Clock;

  readonly socials = [
    { icon: Facebook, href: 'https://facebook.com/yueikendo', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/yueikendo', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com/@yueikendo', label: 'YouTube' },
    { icon: null, href: 'https://tiktok.com/@ditapkendokhong', label: 'TikTok' },
    // { icon: Facebook, href: '#', label: 'Facebook' },
    // { icon: Instagram, href: '#', label: 'Instagram' },
    // { icon: Youtube, href: '#', label: 'YouTube' },
    // { icon: null, href: '#', label: 'TikTok' },
  ];

  // Локации: часы/адрес — из i18n, адрес кликабелен и ведёт на Google Maps
  readonly locations = [
    {
      name: 'Yuei Honbu',
      hoursKey: 'footer.honbu_hours',
      addressKey: 'footer.honbu_address',
      mapLink: 'https://maps.google.com/?q=9+Ô+Chợ+Dừa,+Đống+Đa,+Hà+Nội',
    },
    {
      name: 'Yuei Cầu Giấy',
      hoursKey: 'footer.caugiay_hours',
      addressKey: 'footer.caugiay_address',
      mapLink: 'https://maps.google.com/?q=2+Ng.+181+Đ.+Xuân+Thủy,+Cầu+Giấy,+Hà+Nội',
    },
    {
      name: 'Yuei Đống Đa',
      hoursKey: 'footer.dongda_hours',
      addressKey: 'footer.dongda_address',
      mapLink: 'https://maps.google.com/?q=9+Ô+Chợ+Dừa,+Đống+Đa,+Hà+Nội',
    },
  ];
}
