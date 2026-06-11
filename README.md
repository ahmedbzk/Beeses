# 🔊 Beeses Audio - Premium Ses Teknolojileri Portalı

Beeses Audio, yüksek kaliteli ve modern ses donanımları sunan premium bir ses çözümleri portalıdır. Proje, hem son kullanıcılara hitap eden şık bir vitrin (client) arayüzüne, hem de içerik ve sistem yönetimini sağlayan kapsamlı bir Yönetim Paneline (admin) sahiptir.

---

## 🚀 Teknolojik Altyapı

*   **Framework:** [Angular v17 (SSR - Server Side Rendering Aktif)](https://angular.dev/)
*   **Stil Yönetimi:** [Tailwind CSS v3](https://tailwindcss.com/) & SCSS (Modüler Tasarım)
*   **İkon Kütüphanesi:** [Lucide Angular](https://lucide.dev/guide/angular)
*   **Backend Entegrasyonu:** PHP Tabanlı Rest API (`beeses_api`)
*   **Sunucu Tarafı:** Express Engine & Angular SSR

---

## ✨ Öne Çıkan Özellikler

### 1. Dinamik Tasarım Laboratuvarı (Header Demo)
*   Farklı başlık (header) varyasyonlarının gerçek zamanlı olarak test edilebildiği interaktif kontrol paneli.
*   Logo boyutu, rengi, gölgelendirmesi, menü yazı boyutu, header kalınlığı, iletişim butonu ve yazı renklerinin gerçek zamanlı ayarlanabilmesi.

### 2. Garanti Sorgulama & Başvuru Sistemi
*   Müşterilerin satın aldıkları ses ekipmanlarının garanti durumunu çevrimiçi olarak sorgulayabildikleri sistem.
*   Yeni garanti başvuruları için form oluşturma ve bunu veri tabanına kaydetme altyapısı.

### 3. Bülten (Newsletter) & Haber Yönetimi
*   Kullanıcıların e-bültene abone olabildiği abonelik sistemi.
*   Yönetim panelinden tüm aboneleri görme ve bülten mailleri gönderme modülü.

### 4. Gelişmiş Admin Yönetim Paneli (Yetki Korumalı)
*   **Dashboard:** Genel istatistikler ve hızlı özet ekranı.
*   **Ürün Yönetimi:** SQL, OF ve Petek serisi ürünlerin eklenmesi, düzenlenmesi ve listelenmesi.
*   **Distribütör Yönetimi:** Resmi satış noktaları ve distribütör bilgileri yönetimi.
*   **Haber & Duyuru Yönetimi:** Kurumsal haber ve blog yazılarının zengin içerikle paylaşılması.
*   **Garanti İşlemleri:** Gelen garanti taleplerinin onay/ret süreçleri.
*   **S.S.S & Sertifikalar:** Sıkça sorulan soruların ve kurumsal kalite sertifikalarının dinamik yönetimi.

---

## 📂 Klasör Yapısı

```bash
beeses-audio/
├── src/
│   ├── app/
│   │   ├── admin/                    # Yetkilendirilmiş Yönetici Paneli Modülleri
│   │   │   ├── guards/               # Auth ve Guest koruma mekanizmaları
│   │   │   ├── layout/               # Yönetici ekran yerleşimi (Layout)
│   │   │   └── pages/                # Haber, Ürün, Garanti vb. admin sayfaları
│   │   ├── components/               # Tekrar kullanılabilir ortak bileşenler (Header, Footer, vb.)
│   │   │   └── header/variants/      # V1, V2... VTEST Header Varyasyonları
│   │   ├── pages/                    # Kullanıcı dostu ön yüz sayfaları (Home, Products, Contact...)
│   │   │   └── header-demo/          # Canlı Tasarım & Özelleştirme Laboratuvarı
│   │   ├── services/                 # API haberleşmesini sağlayan Angular Servisleri
│   │   ├── app.routes.ts             # İstemci ve Yönetici rotalama tanımları
│   │   └── app.config.ts             # Uygulama yapılandırmaları ve provider tanımları
│   ├── assets/                       # Logolar, bayraklar ve statik dosyalar
│   └── environments/                 # API url ve ortam değişkenleri
├── angular.json                      # Angular CLI yapılandırması
├── tailwind.config.js                # Tailwind CSS tasarım sistemi tokenleri
├── package.json                      # Proje bağımlılıkları ve scriptleri
└── server.ts                         # SSR (Server Side Rendering) sunucu dosyası
```

---

## 🛠️ Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin
Proje dizininde terminali açarak gerekli paketleri yükleyin:
```bash
npm install
```

### 2. Ortam Değişkenlerini Yapılandırın
[src/environments/environment.ts](file:///c:/Users/ahmed/Desktop/beeses-audio/src/environments/environment.ts) dosyasından API adresini kendi yerel veya sunucu API adresinize göre düzenleyin:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost/beeses_api' // Yerel PHP sunucu API adresiniz
};
```

### 3. Geliştirme Sunucusunu Başlatın
Yerel geliştirme sunucusunu (default: `http://localhost:4200`) ayağa kaldırmak için:
```bash
npm start
```
veya
```bash
ng serve
```

### 4. Üretim (Production) Derlemesi
Projeyi SSR (Server-Side Rendering) destekli olarak canlı ortama hazırlamak için derleyin:
```bash
npm run build
```

Derleme sonrasında SSR sunucusunu yerelde çalıştırmak için:
```bash
npm run serve:ssr:beeses-audio
```

---

## 🤝 Katkıda Bulunma
Herhangi bir hata bildirimi veya özellik talebi için lütfen bir **Issue** açın ya da değişikliklerinizi içeren bir **Pull Request** gönderin.
