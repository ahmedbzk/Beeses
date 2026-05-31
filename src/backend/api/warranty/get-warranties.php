<?php
// get-warranties.php - Garanti kayıtlarını listeleyen API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once '../db.php';

try {
    // approved_warranties tablosunu otomatik oluştur
    $pdo->exec("CREATE TABLE IF NOT EXISTS approved_warranties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        warranty_id INT NOT NULL UNIQUE,
        serial_number VARCHAR(100) NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (warranty_id) REFERENCES warranties(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Mail kayıt tablosunu otomatik oluştur
    $pdo->exec("CREATE TABLE IF NOT EXISTS warranty_emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        warranty_id INT NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Tüm kayıtları çek (approved_warranties'ten başlangıç/bitiş tarihi ve durum bilgisiyle beraber)
    $sql = "SELECT w.*, 
                   aw.start_date, 
                   aw.end_date, 
                   aw.status as approved_status,
                   (SELECT COUNT(*) FROM warranty_emails WHERE warranty_id = w.id) as email_count 
            FROM warranties w 
            LEFT JOIN approved_warranties aw ON aw.warranty_id = w.id
            ORDER BY w.created_at DESC";
    $stmt = $pdo->query($sql);
    
    $warranties = $stmt->fetchAll();
    
    echo json_encode(["success" => true, "data" => $warranties]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
