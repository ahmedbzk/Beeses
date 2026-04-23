import { Injectable } from '@angular/core';

export interface ProductSpec {
  name: string;
  value: string;
}

export interface ProductFeature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  image: string;
  images?: string[];
  pdfUrl?: string;
  specs: ProductSpec[];
  features: ProductFeature[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products: Product[] = [
    {
      id: 'sql-4400',
      name: 'SQL-4400',
      category: 'SQL SERİSİ',
      shortDescription: 'Özenle tasarlanmış Class-AB besleme yapısı ile doğal, yüksek çözünürlüklü ve uzun ömürlü bir ses performansı sunar.',
      image: 'assets/products/SQL 4400 Serisi-1.png',
      images: ['assets/products/SQL 4400 Serisi-1.png', 'assets/products/SQL 4400 Serisi-1.png', 'assets/products/SQL 4400 Serisi-1.png', 'assets/products/SQL 4400 Serisi-1.png', 'assets/products/SQL 4400 Serisi-1.png'],
      pdfUrl: 'assets/docs/Beeses-SQL-4400.pdf',
      specs: [
        { name: 'Producing Country', value: 'Türkiye' },
        { name: 'Weight', value: '5900 gr' },
        { name: 'Dimensions (HxWxD)', value: '62x216x435 mm' },
        { name: 'Crossover', value: 'Low pass-Band pass-High pass (32Hz-4Khz)' },
        { name: 'PWM Technology', value: 'IR mosfet, Cosmo toroidal' },
        { name: 'Output Technology', value: 'Infineon mosfet' },
        { name: 'Input Technology', value: 'Jfet' },
        { name: 'Input Empedance', value: '22 KΩ' },
        { name: 'Input Sensitivity', value: '0.3-8 volt' },
        { name: 'Frequancy Range', value: '8-54.000 Hz' },
        { name: 'THD+N', value: '% 0.033 (% 90 power), % 0.025 (10 W)' },
        { name: 'Damping', value: '400' },
        { name: 'S/N Ratio', value: '105' },
        { name: 'Power', value: '4x464 watt @ 2Ω, 4x256 watt @ 4Ω' },
        { name: 'Maximum Current', value: '148 amper' },
        { name: 'Iddle current', value: '1.56 amper' },
        { name: 'Voltage Range', value: '10.5-18 volt' },
        { name: 'Class', value: 'Class-AB' },
        { name: 'Channel', value: '4' }
      ],
      features: [
        { title: 'Geniş Frekans Tepkisi', description: '8 Hz\'den 54.000 Hz\'e uzanan geniş frekans bandı.' },
        { title: 'Eşleştirilmiş Transistör ile Hassas Sinyal İşleme', description: 'Kanal içi doğrusallığı ve simetriyi artırır. Distorsiyon düşer, sinyal işleme hassasiyeti artar.' },
        { title: 'Sınıf AB Amplifikatör Mimarisi', description: 'Sınıf A\'nın doğallığı ile Sınıf B\'nin verimliliğini birleştirir.' },
        { title: 'Güçlü PWM ile Hassas Voltaj Kontrolü', description: 'Güç katında kullanılan güçlü PWM yapısı, araç elektrik sistemindeki dalgalanmalara rağmen besleme voltajını hassas şekilde kontrol eder.' },
        { title: 'Hassas Gain Kontrolü', description: 'Hoparlör ve kaynak cihaz kombinasyonunuza uygun hassas seviye ayarı yapabilir.' },
        { title: 'Altın Kaplamalı RCA Terminalleri', description: 'Düşük temas direnci ve yüksek iletkenlik sağlayarak sinyal kaybını minimize eder.' },
        { title: 'Çok Düşük Distorsiyon', description: 'Orta ve yüksek ses seviyelerinde bile temiz, pürüzsüz ve yorucu olmayan bir dinleme deneyimi sunar.' },
        { title: 'Kompakt Gövde Tasarımı', description: 'CNC ile hassas işlenmiş kompakt alüminyum gövde, araç içinde minimum yer kaplayacak şekilde tasarlanmıştır.' }
      ]
    },
    {
      id: 'sql-4200',
      name: 'SQL-4200',
      category: 'SQL SERİSİ',
      shortDescription: 'Güçlü ve dinamik ses arayanlar için yüksek performanslı Class-AB amplifikatör.',
      image: 'assets/products/SQL 4200 Serisi-1.png',
      images: ['assets/products/SQL 4200 Serisi-1.png', 'assets/products/SQL 4200 Serisi-1.png', 'assets/products/SQL 4200 Serisi-1.png', 'assets/products/SQL 4200 Serisi-1.png', 'assets/products/SQL 4200 Serisi-1.png'],
      pdfUrl: 'assets/docs/Beeses-SQL-4200.pdf',
      specs: [
        { name: 'Producing Country', value: 'Türkiye' },
        { name: 'Weight', value: '4500 gr' },
        { name: 'Dimensions (HxWxD)', value: '62x216x380 mm' },
        { name: 'Crossover', value: 'Low pass-Band pass-High pass (32Hz-4Khz)' },
        { name: 'PWM Technology', value: 'IR mosfet, Cosmo toroidal' },
        { name: 'Output Technology', value: 'Infineon mosfet' },
        { name: 'Input Technology', value: 'Jfet' },
        { name: 'Input Empedance', value: '22 KΩ' },
        { name: 'Input Sensitivity', value: '0.3-8 volt' },
        { name: 'Frequancy Range', value: '10-50.000 Hz' },
        { name: 'THD+N', value: '% 0.040' },
        { name: 'Damping', value: '350' },
        { name: 'S/N Ratio', value: '100' },
        { name: 'Power', value: '4x300 watt @ 2Ω, 4x150 watt @ 4Ω' },
        { name: 'Maximum Current', value: '100 amper' },
        { name: 'Iddle current', value: '1.20 amper' },
        { name: 'Voltage Range', value: '10.5-16.5 volt' },
        { name: 'Class', value: 'Class-AB' },
        { name: 'Channel', value: '4' }
      ],
      features: [
        { title: 'Üstün Ses Performansı', description: 'Yüksek çözünürlüklü bileşenler kullanılarak tasarlanmıştır.' },
        { title: 'Kompakt Gövde Tasarımı', description: 'Isı dağılımını optimize eden alüminyum soğutucu yüzey.' },
        { title: 'Altın Kaplamalı RCA Terminalleri', description: 'Oksitlenmeye karşı dayanıklı uzun ömürlü yapı.' }
      ]
    },
    {
      id: 'of-1',
      name: 'OF-1',
      category: 'OF SERİSİ',
      shortDescription: 'Yüksek kaliteli pasif ve yarı iletken bileşenlerle tasarlanmış üstün subwoofer performansı.',
      image: 'assets/products/OF-1 ve BS-O 101.PNG',
      images: ['assets/products/OF-1 ve BS-O 101.PNG', 'assets/products/OF-1 ve BS-O 101.PNG', 'assets/products/OF-1 ve BS-O 101.PNG', 'assets/products/OF-1 ve BS-O 101.PNG', 'assets/products/OF-1 ve BS-O 101.PNG'],
      pdfUrl: 'assets/docs/Beeses-OF-1.pdf',
      specs: [
        { name: 'Producing Country', value: 'Türkiye' },
        { name: 'Weight', value: '3420 gr' },
        { name: 'Dimensions (HxWxD)', value: '56x165x320 mm' },
        { name: 'Crossover', value: 'none or optional 4-320 Hz low pass' },
        { name: 'PWM Technology', value: 'IR mosfet, Cosmo toroidal' },
        { name: 'Output Technology', value: 'Sanken bipolar transistor' },
        { name: 'Input Technology', value: 'OP series Jfet' },
        { name: 'Input Empedance', value: '22 KΩ' },
        { name: 'Input Sensitivity', value: '0.3-8 volt' },
        { name: 'Frequancy Range', value: '4-24.000 Hz' },
        { name: 'THD+N', value: '% 0.06 (% 90 power), % 0.003 (10 W)' },
        { name: 'Damping', value: '400' },
        { name: 'S/N Ratio', value: '110' },
        { name: 'Power', value: '1x860 watt @ 2Ω, 1x552 watt @ 4Ω' },
        { name: 'Maximum Current', value: '100 amper' },
        { name: 'Iddle current', value: '1.32 amper' },
        { name: 'Voltage Range', value: '10.5-16.5 volt' },
        { name: 'Class', value: 'Class-AB (bias A)' },
        { name: 'Channel', value: 'mono' }
      ],
      features: [
        { title: 'JFET Giriş ve Tampon Katı', description: 'Yüksek giriş empedansı ve düşük gürültü ile kaynak üniteden gelen sinyalin saflığını korur.' },
        { title: 'Geniş Empedans Uyumluluğu', description: 'Minimum 2 Ohm, maksimum 8 Ohm hoparlör empedansı desteği.' },
        { title: 'Sınıf AB (Bias A) Amplifikatör', description: 'Sınıf A\'nın doğallığı ile Sınıf B\'nin verimliliğini birleştiren mimari.' },
        { title: 'Çok Düşük Distorsiyon', description: 'Son derece düşük toplam harmonik bozulma oranı.' },
        { title: 'Kompakt Gövde Tasarımı', description: 'Araç içinde minimum yer kaplayacak estetik CNC alüminyum tasarım.' }
      ]
    },
    {
      id: 'of-2',
      name: 'OF-2',
      category: 'OF SERİSİ',
      shortDescription: 'Kusursuz tonal denge ve yüksek güç aktarımı için özel olarak geliştirilmiş stereo amplifikatör.',
      image: 'assets/products/OF-2 ve BS-O 102.PNG',
      images: ['assets/products/OF-2 ve BS-O 102.PNG', 'assets/products/OF-2 ve BS-O 102.PNG', 'assets/products/OF-2 ve BS-O 102.PNG', 'assets/products/OF-2 ve BS-O 102.PNG', 'assets/products/OF-2 ve BS-O 102.PNG'],
      pdfUrl: 'assets/docs/Beeses-OF-2.pdf',
      specs: [
        { name: 'Producing Country', value: 'Türkiye' },
        { name: 'Weight', value: '3420 gr' },
        { name: 'Dimensions (HxWxD)', value: '56x165x320 mm' },
        { name: 'Crossover', value: 'none or optional' },
        { name: 'PWM Technology', value: 'IR mosfet, Cosmo toroidal' },
        { name: 'Output Technology', value: 'Sanken bipolar transistor' },
        { name: 'Input Technology', value: 'OP series Jfet' },
        { name: 'Input Empedance', value: '22 KΩ' },
        { name: 'Input Sensitivity', value: '0.3-8 volt' },
        { name: 'Frequancy Range', value: '10-30.000 Hz' },
        { name: 'THD+N', value: '% 0.05' },
        { name: 'Damping', value: '350' },
        { name: 'S/N Ratio', value: '105' },
        { name: 'Power', value: '2x400 watt @ 2Ω, 2x250 watt @ 4Ω' },
        { name: 'Maximum Current', value: '80 amper' },
        { name: 'Iddle current', value: '1.20 amper' },
        { name: 'Voltage Range', value: '10.5-16.5 volt' },
        { name: 'Class', value: 'Class-AB' },
        { name: 'Channel', value: '2' }
      ],
      features: [
        { title: 'JFET Giriş Teknolojisi', description: 'Kusursuz sinyal aktarımı için saf ses.' },
        { title: 'Geniş Frekans Tepkisi', description: '10 Hz - 30.000 Hz arası geniş frekans aralığı.' },
        { title: 'Gelişmiş Soğutma', description: 'Uzun süreli kullanımlarda optimum performans.' }
      ]
    },
    {
      id: 'petek-stereo',
      name: 'PETEK STEREO',
      category: 'PETEK SERİSİ',
      shortDescription: 'Geniş frekans aralığı ve düşük distorsiyon değerleriyle Hi-Res Audio standardına uygun şaheser.',
      image: 'assets/products/Petek Stereo.png',
      images: ['assets/products/Petek Stereo.png', 'assets/products/Petek Stereo.png', 'assets/products/Petek Stereo.png', 'assets/products/Petek Stereo.png', 'assets/products/Petek Stereo.png'],
      pdfUrl: 'assets/docs/Beeses-Petek-Stereo.pdf',
      specs: [
        { name: 'Producing Country', value: 'Türkiye' },
        { name: 'Weight', value: '1770 gr' },
        { name: 'Dimensions (HxWxD)', value: '48x225x151 mm' },
        { name: 'Crossover', value: 'none' },
        { name: 'PWM Technology', value: 'IR mosfet, Magnetics toroidal' },
        { name: 'Output Technology', value: 'Sanken bipolar transistor' },
        { name: 'Input Technology', value: 'OPA series bipolar' },
        { name: 'Input Empedance', value: '22 KΩ' },
        { name: 'Input Sensitivity', value: '0.3-8 volt' },
        { name: 'Frequancy Range', value: '8-54.000 Hz' },
        { name: 'THD+N', value: '% 0.08 (% 90 power), % 0.005 (10 W)' },
        { name: 'Damping', value: '200' },
        { name: 'S/N Ratio', value: '110' },
        { name: 'Power', value: '2x164 watt @ 2Ω, 2x92 watt @ 4Ω' },
        { name: 'Maximum Current', value: '44 amper' },
        { name: 'Iddle current', value: '0.72 amper' },
        { name: 'Voltage Range', value: '10.5-16.5 volt' },
        { name: 'Class', value: 'Class-AB (bias A)' },
        { name: 'Channel', value: '2' }
      ],
      features: [
        { title: 'Hi-Res Audio Standardına Uygun Tasarım', description: 'Geniş frekans aralığı ve düşük distorsiyon.' },
        { title: 'İzole Preamfi ve Amfi Mimarisi', description: 'Besleme ünitesinden izole edilmiştir, manyetik alan etkisini ve parazitleri en aza indirir.' },
        { title: 'Altın Kaplama PCB', description: 'Sinyal yollarında kullanılan altın kaplama yüzeyleri oksitlenmeyi azaltır.' },
        { title: 'Gücü Optimize Eden Altın Kaplama Terminaller', description: 'Güç giriş terminalleri ve sigorta yuvalarında kullanılan altın kaplama kontaklar.' },
        { title: 'Kompakt Gövde Tasarımı', description: 'CNC ile hassas işlenmiş araç içi estetik uyumlu gövde.' }
      ]
    },
    {
      id: 'petek-mono-block',
      name: 'PETEK MONO BLOCK',
      category: 'PETEK SERİSİ',
      shortDescription: 'Hi-Res bas kontrolü ve saf güç. Odyofiller için tasarlanmış Mono Block amplifikatör.',
      image: 'assets/products/Petek Mono Block.png',
      images: ['assets/products/Petek Mono Block.png', 'assets/products/Petek Mono Block.png', 'assets/products/Petek Mono Block.png', 'assets/products/Petek Mono Block.png', 'assets/products/Petek Mono Block.png'],
      pdfUrl: 'assets/docs/Beeses-Petek-Mono-Block.pdf',
      specs: [
        { name: 'Producing Country', value: 'Türkiye' },
        { name: 'Weight', value: '1850 gr' },
        { name: 'Dimensions (HxWxD)', value: '48x225x151 mm' },
        { name: 'Crossover', value: 'none or optional' },
        { name: 'PWM Technology', value: 'IR mosfet, Magnetics toroidal' },
        { name: 'Output Technology', value: 'Sanken bipolar transistor' },
        { name: 'Input Technology', value: 'OPA series bipolar' },
        { name: 'Input Empedance', value: '22 KΩ' },
        { name: 'Input Sensitivity', value: '0.3-8 volt' },
        { name: 'Frequancy Range', value: '8-50.000 Hz' },
        { name: 'THD+N', value: '% 0.05' },
        { name: 'Damping', value: '300' },
        { name: 'S/N Ratio', value: '108' },
        { name: 'Power', value: '1x400 watt @ 2Ω, 1x250 watt @ 4Ω' },
        { name: 'Maximum Current', value: '60 amper' },
        { name: 'Iddle current', value: '0.80 amper' },
        { name: 'Voltage Range', value: '10.5-16.5 volt' },
        { name: 'Class', value: 'Class-AB (bias A)' },
        { name: 'Channel', value: 'mono' }
      ],
      features: [
        { title: 'İzole Preamfi ve Amfi Mimarisi', description: 'Daha sessiz bir arka plan ve saf güç çıkışı.' },
        { title: 'Altın Kaplama PCB', description: 'Kayıpları minimize eden sinyal iletimi.' },
        { title: 'Gelişmiş Subwoofer Kontrolü', description: 'Damping faktörü sayesinde kusursuz bas tepkisi.' }
      ]
    }
  ];

  constructor() { }

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getCategories(): string[] {
    const categories = new Set(this.products.map(p => p.category));
    return Array.from(categories);
  }
}
