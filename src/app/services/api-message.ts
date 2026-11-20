/**
 * Backend yanıtındaki mesajı sayfanın diline göre seçer: "message" (TR) / "message_en" (EN).
 * EN sayfada İngilizce karşılığı yoksa boş döner; çağıran taraf kendi çevirisini (translate) gösterir —
 * böylece İngilizce sayfada Türkçe sunucu mesajı görünmez.
 */
export function apiMessage(body: unknown, lang: string | undefined): string {
  if (!body || typeof body !== 'object') return '';
  const b = body as { message?: unknown; message_en?: unknown };
  const value = lang === 'en' ? b.message_en : b.message;
  return typeof value === 'string' ? value : '';
}
