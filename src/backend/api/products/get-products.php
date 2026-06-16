<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");



try {
    $stmt = $pdo->query("SELECT * FROM products ORDER BY id ASC");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode JSON fields
    foreach ($products as &$prod) {
        $prod['images'] = json_decode($prod['images'] ?? '[]', true);
        $prod['specs'] = json_decode($prod['specs'] ?? '[]', true);
        $prod['features'] = json_decode($prod['features'] ?? '[]', true);
        $prod['specs_en'] = json_decode($prod['specs_en'] ?? '[]', true);
        $prod['features_en'] = json_decode($prod['features_en'] ?? '[]', true);
    }

    echo json_encode(["success" => true, "data" => $products]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
