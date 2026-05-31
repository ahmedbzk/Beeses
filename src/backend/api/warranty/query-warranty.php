<?php
// query-warranty.php - Garanti sorgulama API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../db.php';

$serial_number = $_GET['serial_number'] ?? '';

if (empty($serial_number)) {
    echo json_encode(["success" => false, "message" => "Seri numarası girmelisiniz."]);
    exit;
}

try {
    // approved_warranties tablosunun varlığını doğrula/oluştur (ilk çalıştırmalar için güvenlik önlemi)
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

    // Onaylananlar tablosunda sorgula
    $sql = "SELECT aw.*, p.image as product_image 
            FROM approved_warranties aw 
            LEFT JOIN products p ON p.name = aw.product_name 
            WHERE aw.serial_number = ? 
            LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$serial_number]);
    $result = $stmt->fetch();

    if ($result) {
        // Tarih kontrolü yap ve durumu dinamik hesapla
        $current_date = date('Y-m-d');
        $is_active = ($current_date <= $result['end_date']);
        $computed_status = $is_active ? 'active' : 'passive';

        // Veritabanındaki durum güncelliğini yitirmişse güncelle
        if ($result['status'] !== $computed_status) {
            $updateStmt = $pdo->prepare("UPDATE approved_warranties SET status = ? WHERE id = ?");
            $updateStmt->execute([$computed_status, $result['id']]);
            $result['status'] = $computed_status;
        }

        echo json_encode([
            "success" => true,
            "status" => $result['status'],
            "data" => [
                "product_name" => $result['product_name'],
                "serial_number" => $result['serial_number'],
                "start_date" => $result['start_date'],
                "end_date" => $result['end_date'],
                "status" => $result['status'],
                "product_image" => $result['product_image'] ? $result['product_image'] : 'assets/logo.png'
            ]
        ]);
        exit;
    }

    // Onaylananlarda yoksa, ana garanti tablosunda durumunu kontrol edelim (pending/rejected bilgisi vermek için)
    $stmtMain = $pdo->prepare("SELECT status FROM warranties WHERE serial_number = ? LIMIT 1");
    $stmtMain->execute([$serial_number]);
    $mainResult = $stmtMain->fetch();

    if ($mainResult) {
        $status = $mainResult['status'];
        if ($status === 'pending') {
            echo json_encode([
                "success" => false,
                "status" => "pending",
                "message" => "Garanti kaydınız alındı ve onay bekliyor. Fatura üzerindeki satış tarihi baz alınarak en kısa sürede onaylanacaktır."
            ]);
        } elseif ($status === 'rejected') {
            echo json_encode([
                "success" => false,
                "status" => "rejected",
                "message" => "Garanti başvurunuz reddedilmiştir. Bilgilerin doğruluğunu kontrol edip yeniden başvurabilir veya destek için bizimle iletişime geçebilirsiniz."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "status" => "not_found",
                "message" => "Sistemde bu seri numarasına ait aktif bir garanti bulunamadı."
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "status" => "not_found",
            "message" => "Girilen seri numarasına ait bir garanti kaydı bulunamadı. Lütfen bilgilerinizi kontrol edin."
        ]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
