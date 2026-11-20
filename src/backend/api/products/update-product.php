<?php
require_once '../db.php';
require_once __DIR__ . '/../auth_helper.php';
requireAdmin('products'); // düzenleme yetkisi: products
require_once __DIR__ . '/product_helpers.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

productCheckPostSize();

$id = $_POST['id'] ?? null;
$slug = trim($_POST['slug'] ?? '');
$name = trim($_POST['name'] ?? '');
$name_en = trim($_POST['name_en'] ?? '');
$category = trim($_POST['category'] ?? '');
$shortDescription = $_POST['shortDescription'] ?? '';
$description = $_POST['description'] ?? '';
$shortDescription_en = $_POST['shortDescription_en'] ?? '';
$description_en = $_POST['description_en'] ?? '';
$specs = $_POST['specs'] ?? '[]';
$features = $_POST['features'] ?? '[]';
$specs_en = $_POST['specs_en'] ?? '[]';
$features_en = $_POST['features_en'] ?? '[]';
$existing_images_json = $_POST['existing_images'] ?? '[]';

if (empty($id) || $slug === '' || $name === '' || $category === '' || $name_en === '') {
    productFail(400,
        "Lütfen Türkçe ve İngilizce ürün adı, slug ve kategori dahil tüm zorunlu alanları doldurun.",
        "Please fill in all required fields, including the Turkish and English product names, slug and category.");
}

try {
    ensureProductFileColumns($pdo);
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $current = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    [$tr, $en] = productDbError($e);
    productFail(500, $tr, $en);
}

if (!$current) {
    productFail(404, "Ürün bulunamadı.", "Product not found.");
}

$uploaded = [];   // bu istekte yüklenen yeni dosyalar (hata olursa silinir)
$toDelete = [];   // kayıt başarılı olursa silinecek eski dosyalar

// ---- Görseller ----
$preserved_images = json_decode($existing_images_json, true);
if (!is_array($preserved_images)) {
    $preserved_images = [];
}
$preserved_images = array_values(array_filter($preserved_images, 'is_string'));

$image_path = $current['image'];
$new_main = productHandleUpload('image_file', 'image', 'main', 'Ana görsel', 'Main image', $uploaded);
if ($new_main) {
    $image_path = $new_main;
} elseif (!empty($preserved_images[0]) && $preserved_images[0] !== $current['image']) {
    // Yeni görsel yok ama panelde bir galeri görseli "ana görsel" yapıldı
    $image_path = $preserved_images[0];
}

$new_gallery = [$image_path];
foreach ($preserved_images as $p_img) {
    if ($p_img === '' || $p_img === $image_path) continue;
    if ($new_main && $p_img === $current['image']) continue; // yerine yenisi yüklenen eski ana görsel
    $new_gallery[] = $p_img;
}
for ($i = 0; $i < 4; $i++) {
    $g = productHandleUpload('gallery_file_' . $i, 'image', 'gal_' . $i, 'Galeri görseli ' . ($i + 1), 'Gallery image ' . ($i + 1), $uploaded);
    if ($g) $new_gallery[] = $g;
}
$new_gallery = array_slice(array_values(array_unique($new_gallery)), 0, 5);

$old_gallery = json_decode($current['images'] ?? '[]', true);
$old_files = is_array($old_gallery) ? $old_gallery : [];
$old_files[] = $current['image'];
foreach ($old_files as $old_img) {
    if (is_string($old_img) && !in_array($old_img, $new_gallery, true)) {
        $toDelete[] = $old_img;
    }
}

// ---- Dökümanlar: yeni dosya > silme isteği > mevcut dosya ----
$docFields = [
    // sütun       form alanı      silme bayrağı     önek      etiket TR              etiket EN
    ['pdfUrl',    'pdf_file',    'delete_pdf',    'doc',    'Broşür (TR)',        'Brochure (TR)'],
    ['pdfUrl_en', 'pdf_file_en', 'delete_pdf_en', 'doc_en', 'Broşür (EN)',        'Brochure (EN)'],
    ['manualUrl', 'manual_file', 'delete_manual', 'manual', 'Kullanım kılavuzu',  'User manual'],
];
$docs = [];
foreach ($docFields as [$col, $field, $deleteFlag, $prefix, $labelTr, $labelEn]) {
    $currentPath = $current[$col] ?? '';
    $newPath = productHandleUpload($field, 'pdf', $prefix, $labelTr, $labelEn, $uploaded);
    if ($newPath) {
        $docs[$col] = $newPath;
        if ($currentPath) $toDelete[] = $currentPath;
    } elseif (($_POST[$deleteFlag] ?? '') === 'true') {
        $docs[$col] = '';
        if ($currentPath) $toDelete[] = $currentPath;
    } else {
        $docs[$col] = $currentPath ?? '';
    }
}

// ---- Kayıt ----
try {
    $query = "UPDATE products
              SET slug = ?, name = ?, name_en = ?, category = ?, shortDescription = ?, description = ?, shortDescription_en = ?, description_en = ?,
                  image = ?, images = ?, pdfUrl = ?, pdfUrl_en = ?, manualUrl = ?, specs = ?, features = ?, specs_en = ?, features_en = ?
              WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        $slug,
        $name,
        $name_en,
        $category,
        $shortDescription,
        $description,
        $shortDescription_en,
        $description_en,
        $image_path,
        json_encode($new_gallery),
        $docs['pdfUrl'],
        $docs['pdfUrl_en'],
        $docs['manualUrl'],
        $specs,
        $features,
        $specs_en,
        $features_en,
        $id
    ]);
} catch (PDOException $e) {
    productDeleteFiles($uploaded); // eski dosyalara dokunulmadı, ürün eski haliyle kalır
    [$tr, $en] = productDbError($e);
    productFail(500, $tr, $en);
}

// Kayıt başarılı: artık kullanılmayan eski dosyaları sil
productDeleteFiles(array_diff($toDelete, $new_gallery, array_values($docs)));

writeAdminLog('products', 'Güncelleme', "Ürün güncellendi: " . $name);
echo json_encode(["success" => true, "message" => "Ürün başarıyla güncellendi.", "message_en" => "Product updated successfully."]);
?>
