import { environment } from '../../environments/environment';
import { Product } from './product.service';

/**
 * Veritabanındaki döküman yolunu (ör. "uploads/products/123_doc_x.pdf") tarayıcıda açılabilir
 * serve-pdf.php adresine çevirir. Eski kayıtlardaki tam URL'ler de desteklenir.
 */
export function resolveDocumentUrl(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const value = raw.trim();
  if (!value || value === 'null' || value === 'undefined') return undefined;

  let relativePath = value;
  if (value.includes('backend/api/')) {
    relativePath = value.split('backend/api/')[1];
  } else if (value.includes('beeses_api/')) {
    relativePath = value.split('beeses_api/')[1];
  } else if (/^https?:\/\//.test(value)) {
    return value;
  }

  if (!relativePath || !relativePath.trim()) return undefined;
  return `${environment.apiUrl}/serve-pdf.php?path=${encodeURIComponent(relativePath)}`;
}

/**
 * Broşür dile göre seçilir: o dilin dosyası varsa o, yoksa diğer dilin dosyası.
 * (Sadece TR ya da sadece EN yüklenmişse iki dilde de aynı dosya görünür.)
 */
export function brochureUrl(product: Product | undefined, lang: string | undefined): string | undefined {
  if (!product) return undefined;
  const tr = resolveDocumentUrl(product.pdfUrl);
  const en = resolveDocumentUrl(product.pdfUrl_en);
  return lang === 'en' ? (en ?? tr) : (tr ?? en);
}

/** Kullanım kılavuzu: iki dil için tek PDF. */
export function manualUrl(product: Product | undefined): string | undefined {
  return product ? resolveDocumentUrl(product.manualUrl) : undefined;
}
