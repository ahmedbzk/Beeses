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

if ($slug === '' || $name === '' || $category === '' || $name_en === '') {
    productFail(400,
        "Lütfen Türkçe ve İngilizce ürün adı, slug ve kategori dahil tüm zorunlu alanları doldurun.",
        "Please fill in all required fields, including the Turkish and English product names, slug and category.");
}

try {
    ensureProductFileColumns($pdo);
} catch (PDOException $e) {
    productFail(500, "Ürün tablosu hazırlanamadı: " . $e->getMessage(), "The product table could not be prepared: " . $e->getMessage());
}

$uploaded = []; // bu istekte yüklenen dosyalar (hata olursa silinir)

$image_path = productHandleUpload('image_file', 'image', 'main', 'Ana görsel', 'Main image', $uploaded);
if (!$image_path) {
    productFail(400, "Yeni ürün için ana görsel yüklenmelidir.", "A main image is required for a new product.");
}

$gallery_images = [$image_path];
for ($i = 0; $i < 4; $i++) {
    $g = productHandleUpload('gallery_file_' . $i, 'image', 'gal_' . $i, 'Galeri görseli ' . ($i + 1), 'Gallery image ' . ($i + 1), $uploaded);
    if ($g) $gallery_images[] = $g;
}

$pdf_path    = productHandleUpload('pdf_file', 'pdf', 'doc', 'Broşür (TR)', 'Brochure (TR)', $uploaded) ?? '';
$pdf_path_en = productHandleUpload('pdf_file_en', 'pdf', 'doc_en', 'Broşür (EN)', 'Brochure (EN)', $uploaded) ?? '';
$manual_path = productHandleUpload('manual_file', 'pdf', 'manual', 'Kullanım kılavuzu', 'User manual', $uploaded) ?? '';

try {
    $query = "INSERT INTO products (slug, name, name_en, category, shortDescription, description, shortDescription_en, description_en, image, images, pdfUrl, pdfUrl_en, manualUrl, specs, features, specs_en, features_en)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        json_encode($gallery_images),
        $pdf_path,
        $pdf_path_en,
        $manual_path,
        $specs,
        $features,
        $specs_en,
        $features_en
    ]);

    $newId = $pdo->lastInsertId();
    writeAdminLog('products', 'Ekleme', "Ürün eklendi: " . $name);
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Ürün başarıyla eklendi.", "message_en" => "Product added successfully.", "id" => $newId]);
} catch (PDOException $e) {
    // Kayıt başarısızsa bu istekte yüklenen tüm dosyaları temizle
    productDeleteFiles($uploaded);
    [$tr, $en] = productDbError($e);
    productFail(500, $tr, $en);
}
?>
