<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");



// Ensure name_en and description_en columns exist in certificates table
try {
    $columns = $pdo->query("SHOW COLUMNS FROM certificates")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('name_en', $columns)) {
        $pdo->exec("ALTER TABLE certificates ADD COLUMN name_en VARCHAR(255) DEFAULT NULL AFTER name");
    }
    if (!in_array('description_en', $columns)) {
        $pdo->exec("ALTER TABLE certificates ADD COLUMN description_en TEXT DEFAULT NULL AFTER description");
    }
} catch (Exception $e) {
    // Ignore if table doesn't exist yet
}

try {
    $stmt = $pdo->query("SELECT * FROM certificates ORDER BY id ASC");
    $certs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $certs]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
