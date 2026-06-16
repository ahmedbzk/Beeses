<?php
require_once '../db.php';
// send-mail.php - Garanti admin panelinden kullanıcıya mail gönderme
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}


require_once '../mail_helper.php';

// Gelen JSON verisini oku
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->to) &&
    !empty($data->subject) &&
    !empty($data->message) &&
    !empty($data->warranty_id)
) {
    $to = $data->to;
    $subject = $data->subject;
    $message = $data->message;
    $warranty_id = $data->warranty_id;

    // Mail gönderme fonksiyonu
    try {
        // Mail kayıt tablosunu otomatik oluştur (Her ihtimale karşı)
        $pdo->exec("CREATE TABLE IF NOT EXISTS warranty_emails (
            id INT AUTO_INCREMENT PRIMARY KEY,
            warranty_id INT NOT NULL,
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

        $mail_sent = sendMailSMTP($to, $subject, $message, false);
        if ($mail_sent) {
            // Gönderilen e-postayı veritabanına kaydet
            $insert = $pdo->prepare("INSERT INTO warranty_emails (warranty_id, subject, message) VALUES (?, ?, ?)");
            $insert->execute([$warranty_id, $subject, $message]);

                        writeAdminLog('warranties', 'E-posta Gönderimi', "Kullanıcıya mail gönderildi (Alıcı: " . $to . ", Konu: " . $subject . ", Garanti ID: " . $warranty_id . ")");
            echo json_encode([
                "success" => true,
                "message" => "E-posta başarıyla gönderildi ve kaydedildi."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Sunucu mail göndermeyi reddetti. PHP mail() fonksiyonu veya sunucu SMTP ayarları yapılandırılmamış olabilir."
            ]);
        }
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "message" => "E-posta gönderim hatası: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "E-posta gönderimi başarısız. Lütfen tüm alanları doldurun."
    ]);
}
?>
