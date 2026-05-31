<?php
// update-warranty.php - Garanti durumunu güncelleyen API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$ids = $data['ids'] ?? null;
$status = $data['status'] ?? null;
$start_date = $data['start_date'] ?? null;

if ((!$id && empty($ids)) || !$status) {
    echo json_encode(["success" => false, "message" => "Eksik bilgi gönderildi."]);
    exit;
}

// Sadece geçerli statülere izin ver
$valid_statuses = ['pending', 'approved', 'rejected'];
if (!in_array($status, $valid_statuses)) {
    echo json_encode(["success" => false, "message" => "Geçersiz durum bilgisi."]);
    exit;
}

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

    if ($status === 'approved') {
        if (!empty($ids)) {
            echo json_encode(["success" => false, "message" => "Toplu onaylama işlemi desteklenmemektedir. Lütfen başvuruları tek tek faturaya göre onaylayın."]);
            exit;
        }
        if (empty($start_date)) {
            echo json_encode(["success" => false, "message" => "Garanti başlangıç tarihi (satış tarihi) seçilmelidir."]);
            exit;
        }
    }

    if (!empty($ids) && is_array($ids)) {
        // Toplu Güncelleme (Reddetme veya Beklemeye alma)
        $in  = str_repeat('?,', count($ids) - 1) . '?';
        $sql = "UPDATE warranties SET status = ? WHERE id IN ($in)";
        $stmt = $pdo->prepare($sql);
        $params = array_merge([$status], $ids);
        $stmt->execute($params);

        // approved_warranties tablosundan kaldır
        $sqlDelete = "DELETE FROM approved_warranties WHERE warranty_id IN ($in)";
        $stmtDelete = $pdo->prepare($sqlDelete);
        $stmtDelete->execute($ids);
    } else {
        // Tekli Güncelleme
        $sql = "UPDATE warranties SET status = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$status, $id]);

        if ($status === 'approved') {
            // Bilgileri warranties tablosundan çek
            $stmtDetails = $pdo->prepare("SELECT product_name, serial_number, full_name, email FROM warranties WHERE id = ?");
            $stmtDetails->execute([$id]);
            $w = $stmtDetails->fetch();
            if (!$w) {
                echo json_encode(["success" => false, "message" => "Garanti başvurusu bulunamadı."]);
                exit;
            }

            // Bitiş tarihi ve aktif/pasif durumu hesapla (+2 yıl)
            $start_time = strtotime($start_date);
            $end_date = date('Y-m-d', strtotime('+2 years', $start_time));
            $current_date = date('Y-m-d');
            $approved_status = ($current_date <= $end_date) ? 'active' : 'passive';

            // approved_warranties tablosuna ekle / güncelle
            $stmtInsert = $pdo->prepare("INSERT INTO approved_warranties (warranty_id, serial_number, product_name, start_date, end_date, status) 
                                         VALUES (?, ?, ?, ?, ?, ?) 
                                         ON DUPLICATE KEY UPDATE serial_number = VALUES(serial_number), product_name = VALUES(product_name), start_date = VALUES(start_date), end_date = VALUES(end_date), status = VALUES(status)");
            $stmtInsert->execute([$id, $w['serial_number'], $w['product_name'], $start_date, $end_date, $approved_status]);

            // --- OTOMATİK E-POSTA GÖNDERİMİ VE KAYDI ---
            if (!empty($w['email'])) {
                $to = $w['email'];
                $subject = "Beeses Audio - Garanti Başvurusu Hakkında";
                
                $start_date_formatted = date('d.m.Y', strtotime($start_date));
                $end_date_formatted = date('d.m.Y', strtotime($end_date));
                
                $message = "Sayın " . $w['full_name'] . ",\n\n";
                $message .= "Garanti başvurunuz onaylanmıştır. Ürününüzün 2 yıllık garanti süreci başlatılmıştır.\n\n";
                $message .= "Ürün Bilgileri:\n";
                $message .= "Model: " . $w['product_name'] . "\n";
                $message .= "Seri Numarası: " . strtoupper($w['serial_number']) . "\n";
                $message .= "Garanti Başlangıç Tarihi: " . $start_date_formatted . "\n";
                $message .= "Garanti Bitiş Tarihi: " . $end_date_formatted . "\n\n";
                $message .= "Saygılarımızla,\n";
                $message .= "Beeses Audio Ekibi";

                $from = "info@beeses.com";
                
                $headers = "MIME-Version: 1.0" . "\r\n";
                $headers .= "Content-Type: text/plain; charset=UTF-8" . "\r\n";
                $headers .= "From: Beeses Audio <" . $from . ">" . "\r\n";
                $headers .= "Reply-To: " . $from . "\r\n";
                $headers .= "Bcc: " . $from . "\r\n";
                $headers .= "X-Mailer: PHP/" . phpversion();

                // Mail fonksiyonunu çalıştır (hatayı bastırmak için @ kullandık)
                @mail($to, $subject, $message, $headers);

                // Tablo yoksa oluştur
                $pdo->exec("CREATE TABLE IF NOT EXISTS warranty_emails (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    warranty_id INT NOT NULL,
                    subject VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

                // E-posta geçmişine kaydet
                $stmtEmailLog = $pdo->prepare("INSERT INTO warranty_emails (warranty_id, subject, message) VALUES (?, ?, ?)");
                $stmtEmailLog->execute([$id, $subject, $message]);
            }
            // ---------------------------------------------
        } else {
            //approved_warranties tablosundan sil
            $stmtDelete = $pdo->prepare("DELETE FROM approved_warranties WHERE warranty_id = ?");
            $stmtDelete->execute([$id]);
        }
    }
    
    echo json_encode(["success" => true, "message" => "Garanti durumu başarıyla güncellendi."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
