<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


require_once '../mail_helper.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->status)) {
    try {
        $query = "UPDATE contacts SET status = :status, reply_message = IFNULL(:reply_message, reply_message) WHERE id = :id";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id', $data->id);
        
        $reply_message = isset($data->reply_message) ? $data->reply_message : null;
        $stmt->bindParam(':reply_message', $reply_message);

        if ($stmt->execute()) {
            // Eğer durum 'cevaplandi' olarak güncellendiyse ve bir cevap mesajı varsa e-posta gönder
            if ($data->status === 'cevaplandi' && !empty($reply_message)) {
                $stmtInfo = $pdo->prepare("SELECT email, first_name, last_name, subject FROM contacts WHERE id = ?");
                $stmtInfo->execute([$data->id]);
                $contactInfo = $stmtInfo->fetch(PDO::FETCH_ASSOC);

                if ($contactInfo && !empty($contactInfo['email'])) {
                    $to = $contactInfo['email'];
                    $fullName = $contactInfo['first_name'] . ' ' . $contactInfo['last_name'];
                    $subject = "Beeses Audio - " . ($contactInfo['subject'] ?: "Mesajınız Hakkında");

                    $htmlBody = '<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>' . htmlspecialchars($subject) . '</title>
<style>
  body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .header { background-color: #1a1a2e; padding: 32px; text-align: center; }
  .header h1 { color: #b58131; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
  .content { padding: 40px 32px; color: #333; line-height: 1.7; font-size: 15px; }
  .content h2 { color: #1a1a2e; font-size: 20px; margin-bottom: 16px; }
  .divider { width: 60px; height: 3px; background-color: #b58131; margin: 0 auto 24px; border-radius: 2px; }
  .footer { background-color: #f8f8f8; padding: 24px 32px; text-align: center; border-top: 1px solid #ebebeb; }
  .footer p { color: #999; font-size: 12px; margin: 4px 0; }
  .footer a { color: #b58131; text-decoration: none; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>BEESES AUDIO</h1>
    </div>
    <div class="content">
      <h2>Sayın ' . htmlspecialchars($fullName) . ',</h2>
      <div class="divider"></div>
      <p>' . nl2br(htmlspecialchars($reply_message)) . '</p>
    </div>
    <div class="footer">
      <p>Bu e-posta Beeses Audio ekibi tarafından gönderilmiştir.</p>
      <p><a href="https://beesesaudio.com">beesesaudio.com</a></p>
      <p>&copy; ' . date('Y') . ' Beeses Audio. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>';

                    sendMailSMTP($to, $subject, $htmlBody, true);
                }
            }

            http_response_code(200);
                        writeAdminLog('contacts', 'Güncelleme', "Mesaj durumu güncellendi (Durum: " . $data->status . ", ID: " . $data->id . ")");
            echo json_encode(array("success" => true, "message" => "Durum güncellendi ve cevap e-postası gönderildi."));
        } else {
            http_response_code(503);
            echo json_encode(array("success" => false, "message" => "Durum güncellenemedi."));
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "İşlem sırasında hata oluştu: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Eksik veri."));
}
?>
