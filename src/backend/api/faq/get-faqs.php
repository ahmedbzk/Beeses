<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");



// Ensure question_en and answer_en columns exist in faqs table
try {
    $columns = $pdo->query("SHOW COLUMNS FROM faqs")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('question_en', $columns)) {
        $pdo->exec("ALTER TABLE faqs ADD COLUMN question_en TEXT DEFAULT NULL AFTER question");
    }
    if (!in_array('answer_en', $columns)) {
        $pdo->exec("ALTER TABLE faqs ADD COLUMN answer_en TEXT DEFAULT NULL AFTER answer");
    }
} catch (Exception $e) {
    // Ignore if table doesn't exist yet
}

try {
    $stmt = $pdo->query("SELECT * FROM faqs ORDER BY id ASC");
    $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $faqs]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
