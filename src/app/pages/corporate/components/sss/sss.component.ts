import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterLink } from '@angular/router';

export interface FAQ {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-sss',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './sss.component.html',
  styleUrl: './sss.component.scss'
})
export class SssComponent {
  faqs: FAQ[] = [
    {
      question: 'Beeses nedir?',
      answer: 'Beeses, yüksek kaliteli ve yenilikçi amfi üretimi yapan bir Türk markasıdır. Hem profesyonel müzisyenler hem de amatör kullanıcılar için tasarlanan ürünlerimiz, üstün ses kalitesi ve dayanıklılık sunar.',
      isOpen: true
    },
    {
      question: 'Beeses amfileri hangi tür müzikler için uygundur?',
      answer: 'Beeses amfileri, rock, jazz, blues, metal ve akustik gibi çeşitli müzik türleri için mükemmel performans sağlar. Farklı modellerimiz, farklı ses ihtiyaçlarını karşılamak üzere tasarlanmıştır.',
      isOpen: false
    },
    {
      question: 'Ürünlerinizi nereden satın alabilirim?',
      answer: 'Beeses ürünlerini resmi web sitemizden veya yetkili satış noktalarımızdan satın alabilirsiniz. Web sitemizdeki “Satış Noktaları” bölümünden size en yakın mağazayı bulabilirsiniz.',
      isOpen: false
    },
    {
      question: 'Amfilerinizin garanti süresi nedir?',
      answer: 'Beeses amfilerimiz 2 yıl üretici garantisi ile sunulmaktadır. Garanti kapsamında ürünlerimizdeki üretim hataları ücretsiz olarak tamir edilir veya değiştirilir.',
      isOpen: false
    },
    {
      question: 'Teknik destek alabilir miyim?',
      answer: 'Evet, Beeses teknik destek ekibi, ürünlerinizle ilgili her türlü soru ve sorun için hizmetinizdedir. Teknik destek almak için web sitemizdeki “Destek” bölümünü ziyaret edebilir veya e-posta yoluyla bize ulaşabilirsiniz.',
      isOpen: false
    },
    {
      question: 'Amfileriniz özelleştirilebilir mi?',
      answer: 'Bazı Beeses modelleri, kullanıcıların ihtiyaçlarına göre özelleştirilebilir. Özel tasarım talepleriniz için bizimle iletişime geçebilirsiniz.',
      isOpen: false
    },
    {
      question: 'Kurulum hizmeti sunuyor musunuz?',
      answer: 'Profesyonel ses sistemleri projeleriniz için keşif ve kurulum hizmeti sağlamaktayız. Detaylı bilgi için teknik ekibimizle iletişime geçebilirsiniz.',
      isOpen: false
    },
    {
      question: 'Uluslararası gönderim yapıyor musunuz?',
      answer: 'Evet, dünyanın birçok noktasına güvenli kargo seçeneklerimizle ürün gönderimi sağlamaktayız. Kargo ücretleri bölgeye göre değişiklik göstermektedir.',
      isOpen: false
    },
    {
      question: 'İade ve değişim şartlarınız nelerdir?',
      answer: 'Satın aldığınız ürünleri, kullanılmamış ve ambalajı bozulmamış olması şartıyla 14 gün içerisinde iade edebilir veya değiştirebilirsiniz.',
      isOpen: false
    },
    {
      question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
      answer: 'Kredi kartı, banka havalesi, EFT ve güvenli online ödeme sistemlerini kabul ediyoruz. Ayrıca yetkili satıcılarımızda elden taksit imkanları da bulunabilmektedir.',
      isOpen: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
