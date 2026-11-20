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

$id = $_GET['id'] ?? null;

if (!$id) {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        $data = $_POST;
    }
    $id = $data['id'] ?? null;
}

if (empty($id)) {
    productFail(400, "Ürün kimliği (id) zorunludur.", "Product id is required.");
}

try {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $prod = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$prod) {
        productFail(404, "Ürün bulunamadı.", "Product not found.");
    }

    $deleteStmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $deleteStmt->execute([$id]);
} catch (PDOException $e) {
    [$tr, $en] = productDbError($e);
    productFail(500, $tr, $en);
}

// Kayıt silindikten sonra tüm ilişkili dosyaları sil: görseller, TR/EN broşür ve kullanım kılavuzu
$gallery = json_decode($prod['images'] ?? '[]', true);
$files = is_array($gallery) ? $gallery : [];
$files[] = $prod['image'] ?? '';
$files[] = $prod['pdfUrl'] ?? '';
$files[] = $prod['pdfUrl_en'] ?? '';
$files[] = $prod['manualUrl'] ?? '';
productDeleteFiles($files);

writeAdminLog('products', 'Silme', "Ürün silindi: " . ($prod['name'] ?? '') . " (ID: " . $id . ")");
echo json_encode(["success" => true, "message" => "Ürün ve ilişkili tüm dosyalar silindi.", "message_en" => "The product and all related files were deleted."]);
?>
