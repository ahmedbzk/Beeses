<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

require_once '../db.php';

try {
    // Create certificates table
    $pdo->exec("CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(50) DEFAULT 'award',
        file_path VARCHAR(255) DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

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

        $insertCert = $pdo->prepare("INSERT INTO certificates (name, description, icon, file_path) VALUES (?, ?, ?, '')");
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
