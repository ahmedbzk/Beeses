<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");



try {
    // Create table
    $pdo->exec("CREATE TABLE IF NOT EXISTS distributors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        country VARCHAR(100),
        representative VARCHAR(100),
        company_name VARCHAR(150),
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(100),
        website VARCHAR(255),
        instagram VARCHAR(255),
        facebook VARCHAR(255),
        youtube VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Check if empty
    $stmt = $pdo->query("SELECT COUNT(*) FROM distributors");
    if ($stmt->fetchColumn() == 0) {
        $insert = "INSERT INTO distributors (country, representative, company_name, address, phone, email, website, instagram, facebook, youtube) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmtInsert = $pdo->prepare($insert);
        
        $distributors = [
            [
                'USA (West Coast)', 
                'Mr. Keith Smith', 
                'Custom Works Performance Products', 
                '740 Bruce Ln Chico Ca 95928 USA', 
                '001 530 864-5846', 
                'ks71z28@live.com', 
                'http://www.customworksperformance.net', 
                'https://instagram.com/custom_works_performance', 
                'https://www.facebook.com/CustomWorksPerformance', 
                'https://www.youtube.com/@Hi-Fire-do'
            ],
            [
                'USA (East Coast)', 
                'Mr. Miguel Ayala', 
                'Elite Audio LLC', 
                '15354 Northumberland HWY, Burgess va 22432, USA', 
                '001 831 262 7779', 
                'califgold1@hotmail.com', 
                'https://www.eliteaudiostore.net/pages/contact', 
                '', 
                '', 
                ''
            ],
            [
                'Taiwan', 
                'Ms. Lulu and Mr. Bevis Huang', 
                'SHANG GUI TRADING CO., LTD.', 
                'No. 39, Yichang Rd., Taiping Dist., Taichung City 411035, Taiwan (R.O.C.)', 
                '+886 422778677', 
                'cw.taiwan.audio@gmail.com', 
                '', 
                '', 
                '', 
                ''
            ]
        ];

        foreach ($distributors as $dist) {
            $stmtInsert->execute($dist);
        }
        echo json_encode(["success" => true, "message" => "Tablo oluşturuldu ve veriler eklendi."]);
    } else {
        echo json_encode(["success" => true, "message" => "Tablo mevcut ve içinde veriler var."]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
