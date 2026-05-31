<?php
// get-warranty-emails.php - Garanti başvurusuna gönderilen e-postaları getiren API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once '../db.php';

$warranty_id = $_GET['warranty_id'] ?? null;

if (!$warranty_id) {
    echo json_encode(["success" => false, "message" => "Garanti ID bilgisi eksik."]);
    exit;
}

try {
    // Mail kayıt tablosunu otomatik oluştur (Her ihtimale karşı)
    $pdo->exec("CREATE TABLE IF NOT EXISTS warranty_emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        warranty_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // E-postaları tarihe göre azalan sırada çek
    $sql = "SELECT * FROM warranty_emails WHERE warranty_id = ? ORDER BY sent_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$warranty_id]);
    
    $emails = $stmt->fetchAll();
    
    echo json_encode(["success" => true, "data" => $emails]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
