<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");



try {
    $stmt = $pdo->query("SELECT * FROM innovations ORDER BY id DESC");
    $innovations = $stmt->fetchAll();

    // Decode JSON fields
    foreach ($innovations as &$item) {
        $item['features'] = $item['features'] ? json_decode($item['features']) : [];
        $item['features_en'] = $item['features_en'] ? json_decode($item['features_en']) : [];
        $item['specs'] = $item['specs'] ? json_decode($item['specs']) : [];
        $item['specs_en'] = $item['specs_en'] ? json_decode($item['specs_en']) : [];
        
        // ensure types are correct if missing
        if (!is_array($item['features'])) $item['features'] = [];
        if (!is_array($item['features_en'])) $item['features_en'] = [];
        if (!is_array($item['specs'])) $item['specs'] = [];
        if (!is_array($item['specs_en'])) $item['specs_en'] = [];
    }

    echo json_encode([
        "success" => true,
        "data" => $innovations
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Veri çekilirken hata oluştu: " . $e->getMessage()
    ]);
}
?>
