<?php
/**
 * Ürün ekleme/güncelleme/silme için ortak yardımcılar.
 *
 * Dosya alanları (products tablosu):
 *   image / images  : ana görsel + galeri
 *   pdfUrl          : Broşür (TR)   — mevcut canlı veriler bu sütunda, TR broşür olarak kabul edilir
 *   pdfUrl_en       : Broşür (EN)   — yoksa ilk kullanımda otomatik eklenir
 *   manualUrl       : Kullanım kılavuzu (tek PDF, iki dil için ortak)
 */

const PRODUCT_UPLOAD_DIR = __DIR__ . '/../uploads/products/';
const PRODUCT_UPLOAD_REL = 'uploads/products/';
const PRODUCT_IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

/** JSON hata yanıtı (TR + EN) verip betiği sonlandırır. */
function productFail(int $status, string $tr, string $en): void
{
    http_response_code($status);
    echo json_encode(["success" => false, "message" => $tr, "message_en" => $en]);
    exit;
}

/**
 * Dosyalar post_max_size'ı aşınca PHP $_POST ve $_FILES'ı tamamen boşaltır; bu durumda
 * "zorunlu alanları doldurun" gibi yanıltıcı bir hata yerine gerçek nedeni bildir.
 */
function productCheckPostSize(): void
{
    $len = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($len > 0 && empty($_POST) && empty($_FILES)) {
        $limit = ini_get('post_max_size');
        productFail(413,
            "Yüklenen dosyaların toplam boyutu sunucu limitini aşıyor (limit: $limit). Daha küçük dosyalar deneyin.",
            "The total size of the uploaded files exceeds the server limit (limit: $limit). Please try smaller files.");
    }
}

/** products tablosunda pdfUrl_en ve manualUrl sütunlarını garanti eder (canlıda elle SQL gerekmez). */
function ensureProductFileColumns(PDO $pdo): void
{
    $cols = $pdo->query("SHOW COLUMNS FROM products")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('manualUrl', $cols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN manualUrl VARCHAR(255) DEFAULT '' AFTER pdfUrl");
    }
    if (!in_array('pdfUrl_en', $cols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN pdfUrl_en VARCHAR(255) DEFAULT '' AFTER pdfUrl");
    }
}

function productUploadErrorText(int $code): array
{
    $max = ini_get('upload_max_filesize');
    switch ($code) {
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            return ["dosya boyutu sunucu limitini aşıyor (limit: $max)", "the file exceeds the server size limit (limit: $max)"];
        case UPLOAD_ERR_PARTIAL:
            return ["dosya kısmen yüklendi, lütfen tekrar deneyin", "the file was only partially uploaded, please try again"];
        case UPLOAD_ERR_NO_TMP_DIR:
            return ["sunucuda geçici klasör bulunamadı", "the server's temporary folder is missing"];
        case UPLOAD_ERR_CANT_WRITE:
            return ["sunucu diske yazamadı", "the server could not write to disk"];
        case UPLOAD_ERR_EXTENSION:
            return ["bir PHP eklentisi yüklemeyi durdurdu", "a PHP extension stopped the upload"];
        default:
            return ["bilinmeyen yükleme hatası (kod: $code)", "unknown upload error (code: $code)"];
    }
}

function productEnsureUploadDir(): void
{
    if (!is_dir(PRODUCT_UPLOAD_DIR) && !mkdir(PRODUCT_UPLOAD_DIR, 0755, true)) {
        productFail(500, "Yükleme klasörü oluşturulamadı.", "The upload folder could not be created.");
    }
}

/**
 * Tek bir dosya alanını işler. Dosya gönderilmemişse null döner.
 * Hata durumunda daha önce bu istekte yüklenen dosyaları ($uploaded) silip TR/EN hata verir.
 *
 * @param string $kind 'image' | 'pdf'
 */
function productHandleUpload(string $field, string $kind, string $prefix, string $labelTr, string $labelEn, array &$uploaded): ?string
{
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    $fail = function (int $status, string $tr, string $en) use (&$uploaded) {
        productDeleteFiles($uploaded);
        productFail($status, $tr, $en);
    };

    $file = $_FILES[$field];
    if ($file['error'] !== UPLOAD_ERR_OK) {
        [$tr, $en] = productUploadErrorText((int)$file['error']);
        $fail(400, "$labelTr yüklenemedi: $tr.", "$labelEn could not be uploaded: $en.");
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if ($kind === 'pdf') {
        // Uzantı + içerik kontrolü: serve-pdf.php her dosyayı PDF olarak sunduğu için sadece gerçek PDF kabul edilir
        $head = @file_get_contents($file['tmp_name'], false, null, 0, 1024);
        if ($ext !== 'pdf' || $head === false || strpos($head, '%PDF-') === false) {
            $fail(400, "$labelTr için yalnızca PDF dosyası yüklenebilir.", "Only PDF files can be uploaded for $labelEn.");
        }
    } else {
        if (!in_array($ext, PRODUCT_IMAGE_EXTS, true) || @getimagesize($file['tmp_name']) === false) {
            $fail(400, "$labelTr için geçersiz görsel formatı (JPG, PNG, GIF veya WEBP olmalı).", "Invalid image format for $labelEn (must be JPG, PNG, GIF or WEBP).");
        }
    }

    productEnsureUploadDir();
    $name = time() . '_' . $prefix . '_' . uniqid() . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], PRODUCT_UPLOAD_DIR . $name)) {
        $fail(500, "$labelTr sunucuya kaydedilemedi. Klasör izinlerini kontrol edin.", "$labelEn could not be saved on the server. Check folder permissions.");
    }

    $rel = PRODUCT_UPLOAD_REL . $name;
    $uploaded[] = $rel;
    return $rel;
}

/** Sadece uploads/ altındaki dosyaları siler (assets/ gibi paketle gelen dosyalara dokunmaz). */
function productDeleteFiles(array $paths): void
{
    foreach (array_unique(array_filter($paths)) as $path) {
        if (!is_string($path) || strpos($path, 'uploads/') !== 0 || strpos($path, '..') !== false) continue;
        $full = __DIR__ . '/../' . $path;
        if (is_file($full)) {
            @unlink($full);
        }
    }
}

/** Veritabanı hatasını kullanıcıya anlaşılır TR/EN mesaja çevirir. */
function productDbError(PDOException $e): array
{
    if ($e->getCode() === '23000' && stripos($e->getMessage(), 'slug') !== false) {
        return ["Bu slug (rota linki) başka bir ürün tarafından kullanılıyor. Farklı bir slug girin.",
                "This slug (route link) is already used by another product. Please enter a different slug."];
    }
    return ["Veritabanı hatası: " . $e->getMessage(), "Database error: " . $e->getMessage()];
}
