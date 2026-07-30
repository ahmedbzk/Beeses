<?php
// setup.php - Distribütör başvuruları tablosunu oluşturur
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../db.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS distributor_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255) NOT NULL,
        group1_info TEXT,
        group2_info TEXT,
        group3_info TEXT,
        file_path VARCHAR(500),
        status ENUM('pending', 'reviewed', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";

    $pdo->exec($sql);
    
    echo json_encode([
        "success" => true,
        "message" => "distributor_applications tablosu başarıyla kontrol edildi/oluşturuldu."
    ]);
} catch(PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Tablo oluşturma hatası: " . $e->getMessage()
    ]);
}
?>
