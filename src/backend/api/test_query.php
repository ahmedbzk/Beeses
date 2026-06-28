<?php
require_once 'db.php';
header("Content-Type: application/json; charset=UTF-8");

try {
    $stmt = $pdo->query("SELECT id, name, name_en, category, pdfUrl, pdfUrl_en, manualUrl, manualUrl_en, specs, specs_en FROM products");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $products
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Hata: " . $e->getMessage()
    ]);
}
?>
