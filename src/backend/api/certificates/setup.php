<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");



try {
    // Create certificates table
    $pdo->exec("CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) DEFAULT NULL,
        description TEXT,
        description_en TEXT DEFAULT NULL,
        icon VARCHAR(50) DEFAULT 'award',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Ensure name_en and description_en columns exist if table was already created without them
    $columns = $pdo->query("SHOW COLUMNS FROM certificates")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('name_en', $columns)) {
        $pdo->exec("ALTER TABLE certificates ADD COLUMN name_en VARCHAR(255) DEFAULT NULL AFTER name");
    }
    if (!in_array('description_en', $columns)) {
        $pdo->exec("ALTER TABLE certificates ADD COLUMN description_en TEXT DEFAULT NULL AFTER description");
    }

    // Seed certificates table if empty
    $stmtCert = $pdo->query("SELECT COUNT(*) FROM certificates");
    $certCount = $stmtCert->fetchColumn();
    $certSeeded = false;

    if ($certCount == 0) {
        $certs = [
            [
                'name' => 'ISO 9001:2015',
                'description' => 'Kalite Yönetim Sistemi Sertifikası',
                'icon' => 'shield-check'
            ],
            [
                'name' => 'ISO 14001:2015',
                'description' => 'Çevre Yönetim Sistemi Sertifikası',
                'icon' => 'leaf'
            ],
            [
                'name' => 'CE Belgesi',
                'description' => 'Avrupa Standartlarına Uygunluk Beyanı',
                'icon' => 'award'
            ],
            [
                'name' => 'Yerli Üretim Belgesi',
                'description' => 'Türkiye Cumhuriyeti Sanayi ve Teknoloji Bakanlığı Onaylı',
                'icon' => 'flag'
            ],
            [
                'name' => 'TSE Standart Uygunluk',
                'description' => 'Türk Standartları Enstitüsü Onaylı Üretim Kalitesi',
                'icon' => 'check-circle'
            ],
            [
                'name' => 'Hizmet Yeterlilik Belgesi',
                'description' => 'Satış Sonrası Destek ve Teknik Servis Standartları',
                'icon' => 'settings'
            ]
        ];

        $insertCert = $pdo->prepare("INSERT INTO certificates (name, description, icon) VALUES (?, ?, ?)");
        foreach ($certs as $cert) {
            $insertCert->execute([$cert['name'], $cert['description'], $cert['icon']]);
        }
        $certSeeded = true;
    }

    echo json_encode([
        "success" => true,
        "message" => "Certificates tablosu basariyla kontrol edildi ve olusturuldu.",
        "seeded" => $certSeeded
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Veritabani kurulum hatasi: " . $e->getMessage()
    ]);
}
?>
