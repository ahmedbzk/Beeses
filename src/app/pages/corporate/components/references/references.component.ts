import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Testimonial {
  category: string;
  comment: string;
  author: string;
}

@Component({
  selector: 'app-references',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './references.component.html',
  styleUrl: './references.component.scss'
})
export class ReferencesComponent {
  testimonials: Testimonial[] = [
    {
      category: 'MÜZİK GRUPLARI & SANATÇILAR',
      comment: 'Yerel ve uluslararası sahnelerde performans sergileyen birçok sanatçı, BeeSes amfilerinin güçlü ve temiz ses kalitesini tercih ediyor. Yüksek ses gücü, ton dengesi ve dayanıklı yapısıyla sahnede kusursuz bir deneyim sunuyoruz.',
      author: 'Alya Özer'
    },
    {
      category: 'EĞİTİM KURUMLARI & KONSERVATUVARLAR',
      comment: 'Müzik eğitimi veren okullar, konservatuvarlar ve atölyeler, enstrüman eğitimlerinde BeeSes amfilerinden faydalanarak öğrencilere en iyi ses deneyimini sunuyor.',
      author: 'Mahmut Sani'
    },
    {
      category: 'PROFESYONEL KAYIT STÜDYOLARI',
      comment: 'Türkiye’nin önde gelen kayıt stüdyoları, miksaj ve mastering süreçlerinde BeeSes amfilerini kullanarak mükemmel ses üretimi sağlıyor. Stüdyo ortamında net ve kayıpsız ses aktarımı için BeeSes kalitesine güveniyorlar.',
      author: 'Burak Yurt'
    },
    {
      category: 'ETKİNLİK VE KONSER ORGANİZATÖRLERİ',
      comment: 'Açık hava konserlerinden kapalı salon etkinliklerine kadar her türlü organizasyonda BeeSes amfileri, güçlü performansıyla dinleyicilere unutulmaz anlar yaşatıyor. Profesyonel ses mühendislerinin vazgeçilmez tercihi.',
      author: 'Cemil Kaya'
    },
    {
      category: 'AKUSTİK DANIŞMANLAR',
      comment: 'Mekanların akustik tasarımlarını yapan danışmanlar, sesin doğru yayılımı ve yalıtımı için sistemlerimizde BeeSes teknolojisini baz alıyor. En zorlu akustik ortamlarda bile üstün başarı.',
      author: 'Sinem Aydın'
    },
    {
      category: 'BAĞIMSIZ MÜZİSYENLER',
      comment: 'Kendi müziğini üreten ve ev stüdyolarında çalışan bağımsız müzisyenler, BeeSes amfilerinin sıcak ve doğal tonlarıyla kayıtlarına profesyonel bir dokunuş katıyor. Her nota daha anlamlı.',
      author: 'Kemal Erdem'
    }
  ];
}
