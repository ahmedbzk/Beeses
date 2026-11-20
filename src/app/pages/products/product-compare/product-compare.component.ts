import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, PLATFORM_ID, Pipe, PipeTransform, SimpleChanges, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslateService } from '@ngx-translate/core';
import { translations } from '../../../i18n/translations';
import { Product, ProductSpec } from '../../../services/product.service';
import { environment } from '../../../../environments/environment';
import { SiteLang, currentSiteLang } from '../../../i18n/site-lang';

interface CompareRow {
  key: string;
  label: string;
  values: string[];
  differs: boolean;
}

/**
 * Spec adları veritabanında tutarsız (bazı ürünlerde TR, bazılarında EN, yazım farkları var).
 * Aynı özelliği tek satırda toplamak için hepsini ortak bir anahtara eşliyoruz.
 */
const SPEC_ALIASES: Record<string, string> = {
  'class': 'class', 'çalışma sınıfı': 'class', 'operating class': 'class', 'sınıf': 'class',
  'channel': 'channel', 'kanal': 'channel',
  'power': 'power', 'çıkış gücü': 'power', 'output power': 'power', 'güç': 'power',
  'frequancy range': 'freq', 'frequency range': 'freq', 'frekans yanıtı': 'freq', 'frequency response': 'freq', 'frekans aralığı': 'freq',
  'thd+n': 'thd',
  's/n ratio': 'snr', 'sinyal/gürültü oranı': 'snr', 'signal/noise ratio': 'snr', 'signal-to-noise ratio': 'snr',
  'damping': 'damping',
  'crossover': 'crossover',
  'input sensitivity': 'inputSens', 'giriş hassasiyeti': 'inputSens',
  'input empedance': 'inputImp', 'input impedance': 'inputImp', 'giriş empedansı': 'inputImp',
  'yük empedansı': 'loadImp', 'load impedance': 'loadImp',
  'input technology': 'inputTech', 'giriş teknolojisi': 'inputTech',
  'output technology': 'outputTech', 'çıkış teknolojisi': 'outputTech',
  'pwm technology': 'pwm', 'pwm teknolojisi': 'pwm',
  'maximum current': 'maxCurrent', 'maksimum akım': 'maxCurrent',
  'iddle current': 'idleCurrent', 'idle current': 'idleCurrent', 'boşta akım': 'idleCurrent',
  'voltage range': 'voltage', 'voltaj aralığı': 'voltage',
  'güç kaynağı': 'supply', 'power supply': 'supply',
  'güç tüketimi': 'consumption', 'power consumption': 'consumption',
  'weight': 'weight', 'ağırlık': 'weight',
  'dimensions (hxwxd)': 'dims', 'dimensions': 'dims', 'boyutlar': 'dims',
  'producing country': 'country', 'üretim ülkesi': 'country', 'country of origin': 'country',
};

const SPEC_LABELS: Record<string, { tr: string; en: string }> = {
  class: { tr: 'Sınıf', en: 'Class' },
  channel: { tr: 'Kanal', en: 'Channel' },
  power: { tr: 'Güç', en: 'Power' },
  freq: { tr: 'Frekans Aralığı', en: 'Frequency Range' },
  thd: { tr: 'THD+N', en: 'THD+N' },
  snr: { tr: 'Sinyal/Gürültü Oranı', en: 'S/N Ratio' },
  damping: { tr: 'Damping Faktörü', en: 'Damping Factor' },
  crossover: { tr: 'Crossover', en: 'Crossover' },
  inputSens: { tr: 'Giriş Hassasiyeti', en: 'Input Sensitivity' },
  inputImp: { tr: 'Giriş Empedansı', en: 'Input Impedance' },
  loadImp: { tr: 'Yük Empedansı', en: 'Load Impedance' },
  inputTech: { tr: 'Giriş Teknolojisi', en: 'Input Technology' },
  outputTech: { tr: 'Çıkış Teknolojisi', en: 'Output Technology' },
  pwm: { tr: 'PWM Teknolojisi', en: 'PWM Technology' },
  maxCurrent: { tr: 'Maksimum Akım', en: 'Maximum Current' },
  idleCurrent: { tr: 'Boşta Akım', en: 'Idle Current' },
  voltage: { tr: 'Voltaj Aralığı', en: 'Voltage Range' },
  supply: { tr: 'Güç Kaynağı', en: 'Power Supply' },
  consumption: { tr: 'Güç Tüketimi', en: 'Power Consumption' },
  weight: { tr: 'Ağırlık', en: 'Weight' },
  dims: { tr: 'Boyutlar (YxGxD)', en: 'Dimensions (HxWxD)' },
  country: { tr: 'Üretim Ülkesi', en: 'Country of Origin' },
};

const SPEC_ORDER = Object.keys(SPEC_LABELS);
const SERIES_ORDER = ['PETEK SERİSİ', 'OF SERİSİ', 'SQL SERİSİ'];
const seriesIndex = (cat: string) => {
  const i = SERIES_ORDER.indexOf(cat);
  return i === -1 ? 999 : i;
};

/** Ürünleri seri sırasına (Petek → OF → SQL), sonra slug'a göre sıralar. Ürünler sayfasıyla aynı düzen. */
export function sortProductsBySeries(products: Product[]): Product[] {
  return [...products].sort((a, b) =>
    seriesIndex(a.category) - seriesIndex(b.category) || a.slug.localeCompare(b.slug));
}

const MAX_SELECTION = 3;
const CLOSE_ANIMATION_MS = 280;

/**
 * Karşılaştırma ekranına özel çeviri: dili parametre olarak alır, sitenin genel dilini kullanmaz.
 * Saf (pure) pipe olduğu için sadece anahtar/dil/parametre değişince yeniden hesaplanır.
 * Kullanım: {{ 'COMPARE_TITLE' | ct: lang }}  /  {{ 'COMPARE_SELECTED_COUNT' | ct: lang : { count: 2 } }}
 */
@Pipe({ name: 'ct', standalone: true })
export class CompareTranslatePipe implements PipeTransform {
  transform(key: string, lang: SiteLang, params?: Record<string, unknown>): string {
    const dict = translations[lang] as Record<string, string>;
    let text = dict[key] ?? (translations.tr as Record<string, string>)[key] ?? key;
    if (params) {
      text = text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name) => (params[name] ?? '') + '');
    }
    return text;
  }
}

@Component({
  selector: 'app-product-compare',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, CompareTranslatePipe],
  templateUrl: './product-compare.component.html',
  styleUrl: './product-compare.component.scss'
})
export class ProductCompareComponent implements OnChanges, OnDestroy {
  @Input() products: Product[] = [];
  @Input() categories: string[] = [];
  @Input() open = false;
  /** Açılışta seçili gelecek ürünler (ör. ürün detayında o ürün). Boşsa hiçbir ürün seçili gelmez. */
  @Input() initialSlugs: string[] = [];
  @Output() closed = new EventEmitter<void>();

  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);

  readonly maxSelection = MAX_SELECTION;
  readonly labelColWidth = 200;
  selectedSlugs: string[] = [];
  pickerCategory: string | null = null;
  onlyDifferences = false;
  rows: CompareRow[] = [];
  featureRow: string[][] = [];
  limitWarning = false;
  isClosing = false;
  /** Ekranın kendi dili. Her açılışta sitenin diliyle başlar; ekrandaki TR/EN düğmesi sadece bunu değiştirir. */
  lang: SiteLang = this.siteLang();

  private siteLang(): SiteLang {
    const current = this.translate.currentLang;
    return current === 'en' || current === 'tr' ? current : currentSiteLang();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.lang = this.siteLang();
    }
    if (changes['products'] && this.categories.length === 0) {
      this.categories = Array.from(new Set(this.products.map(p => p.category)))
        .sort((a, b) => seriesIndex(a) - seriesIndex(b));
    }
    // Ön seçim değişti (ör. ürün detayında başka bir ürüne geçildi) → seçimi yeni ürünle baştan kur
    if (changes['initialSlugs'] && !changes['initialSlugs'].firstChange) {
      this.selectedSlugs = [];
    }
    if (changes['open'] || changes['products'] || changes['initialSlugs']) {
      // Varsayılan seçim yok: kullanıcı kendisi seçer. Sadece ürün detayından açılınca o ürün seçili gelir.
      if (this.open && this.selectedSlugs.length === 0 && this.products.length > 0) {
        this.selectedSlugs = this.initialSlugs.filter(s => this.products.some(p => p.slug === s)).slice(0, MAX_SELECTION);
      }
      this.setBodyScrollLock(this.open);
      // Kapanırken tabloyu yeniden kurmaya gerek yok (ekran zaten kaldırılıyor)
      if (this.open) this.buildRows();
    }
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) this.close();
  }

  /**
   * Kapanış animasyonu (scss: .is-closing) bittikten sonra ekranı kaldır.
   */
  close(): void {
    if (this.isClosing) return;
    this.isClosing = true;
    setTimeout(() => {
      this.isClosing = false;
      this.closed.emit();
    }, CLOSE_ANIMATION_MS);
  }

  readonly langs: { code: SiteLang; label: string; flag: string }[] = [
    { code: 'tr', label: 'TR', flag: 'assets/flags/turkey.png' },
    { code: 'en', label: 'EN', flag: 'assets/flags/england.png' },
  ];

  get activeLang(): SiteLang {
    return this.lang;
  }

  /**
   * Ekran içi anlık dil değişimi. Sitenin genel dili (translate.use) DEĞİŞMEZ: sadece bu ekranın metinleri
   * ve tablo yeniden hesaplanır. Böylece arkadaki sayfa (header, ürün listesi, footer) baştan çizilmez,
   * kapanırken de sayfa kendi dilinde olduğu için ek bir dil değişimi/takılma olmaz.
   */
  switchLang(lang: SiteLang): void {
    if (lang === this.lang) return;
    this.lang = lang;
    this.buildRows();
  }


  // Getter yerine alan: getter'lar her değişiklik algılamasında yeni dizi üretip
  // tabloyu gereksiz yere yeniden işletiyordu. Sadece seçim/filtre değişince hesaplıyoruz.
  pickerProducts: Product[] = [];
  selectedProducts: Product[] = [];
  visibleRows: CompareRow[] = [];
  /** Mobil düzende ürün sütunları: seçili ürün sayısı kadar eşit sütun */
  gridColumns = 'repeat(1, minmax(0, 1fr))';

  setPickerCategory(cat: string | null): void {
    this.pickerCategory = cat;
    this.pickerProducts = cat ? this.products.filter(p => p.category === cat) : this.products;
  }

  toggleOnlyDifferences(): void {
    this.onlyDifferences = !this.onlyDifferences;
    this.visibleRows = this.onlyDifferences ? this.rows.filter(r => r.differs) : this.rows;
  }

  isSelected(p: Product): boolean {
    return this.selectedSlugs.includes(p.slug);
  }

  toggleProduct(p: Product): void {
    this.limitWarning = false;
    if (this.isSelected(p)) {
      this.selectedSlugs = this.selectedSlugs.filter(s => s !== p.slug);
    } else if (this.selectedSlugs.length < MAX_SELECTION) {
      this.selectedSlugs = [...this.selectedSlugs, p.slug];
    } else {
      this.limitWarning = true;
      return;
    }
    this.buildRows();
  }

  clearSelection(): void {
    this.selectedSlugs = [];
    this.limitWarning = false;
    this.buildRows();
  }

  private isEn(): boolean {
    return this.lang === 'en';
  }

  productName(p: Product): string {
    return this.isEn() && p.name_en ? p.name_en : p.name;
  }

  productShortDesc(p: Product): string {
    return this.isEn() && p.shortDescription_en ? p.shortDescription_en : p.shortDescription;
  }

  categoryKey(cat: string): string {
    switch (cat) {
      case 'SQL SERİSİ': return 'HEADER_SQL_SERIES';
      case 'OF SERİSİ': return 'HEADER_OF_SERIES';
      case 'PETEK SERİSİ': return 'HEADER_PETEK_SERIES';
      default: return cat;
    }
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '';
    if (/^https?:\/\//.test(imagePath) || imagePath.startsWith('assets/')) return imagePath;
    return `${environment.apiUrl}/${imagePath}`;
  }

  /** Ürün detay sayfasıyla aynı kural: EN'de specs_en doluysa onu, değilse specs'i kullan. */
  private specsFor(p: Product): ProductSpec[] {
    if (this.isEn() && p.specs_en && p.specs_en.length > 0) return p.specs_en;
    return p.specs || [];
  }

  private normalizeKey(name: string): string {
    const n = (name || '').trim().toLocaleLowerCase('tr');
    return SPEC_ALIASES[n] ?? `raw:${name.trim()}`;
  }

  private labelFor(key: string): string {
    if (key.startsWith('raw:')) return key.slice(4);
    const l = SPEC_LABELS[key];
    return l ? (this.isEn() ? l.en : l.tr) : key;
  }

  private buildRows(): void {
    this.setPickerCategory(this.pickerCategory);
    this.selectedProducts = this.selectedSlugs
      .map(slug => this.products.find(p => p.slug === slug))
      .filter((p): p is Product => !!p);
    const products = this.selectedProducts;
    this.gridColumns = `repeat(${Math.max(products.length, 1)}, minmax(0, 1fr))`;
    const maps = products.map(p => {
      const m = new Map<string, string>();
      for (const s of this.specsFor(p)) {
        const k = this.normalizeKey(s.name);
        if (!m.has(k) && s.value?.trim()) m.set(k, s.value.trim());
      }
      return m;
    });

    const allKeys = new Set<string>();
    maps.forEach(m => m.forEach((_, k) => allKeys.add(k)));
    const ordered = [
      ...SPEC_ORDER.filter(k => allKeys.has(k)),
      ...Array.from(allKeys).filter(k => !SPEC_ORDER.includes(k)),
    ];

    this.rows = ordered.map(key => {
      const values = maps.map(m => m.get(key) ?? '');
      const normalized = values.map(v => v.toLocaleLowerCase('tr').replace(/\s+/g, ''));
      return {
        key,
        label: this.labelFor(key),
        values,
        differs: new Set(normalized).size > 1,
      };
    });

    this.visibleRows = this.onlyDifferences ? this.rows.filter(r => r.differs) : this.rows;

    this.featureRow = products.map(p => {
      const feats = this.isEn() && p.features_en && p.features_en.length > 0 ? p.features_en : (p.features || []);
      return feats.map(f => f.title).filter(Boolean);
    });
  }

  trackBySlug = (_: number, p: Product) => p.slug;
  trackByKey = (_: number, r: CompareRow) => r.key;

  private setBodyScrollLock(lock: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Kaydırma çubuğu <html> üzerinde; yalnızca body'yi kilitlemek sayfa barını gizlemiyor.
    const value = lock ? 'hidden' : '';
    document.documentElement.style.overflow = value;
    document.body.style.overflow = value;
  }
}
