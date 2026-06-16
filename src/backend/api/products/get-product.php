<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");



$slug = $_GET['slug'] ?? $_GET['id'] ?? '';

if (empty($slug)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Urun slug veya kimligi zorunludur."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE slug = ? OR id = ?");
    $stmt->execute([$slug, $slug]);
    $prod = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($prod) {
        $prod['images'] = json_decode($prod['images'] ?? '[]', true);
        $prod['specs'] = json_decode($prod['specs'] ?? '[]', true);
        $prod['features'] = json_decode($prod['features'] ?? '[]', true);
        echo json_encode(["success" => true, "data" => $prod]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Urun bulunamadi."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
