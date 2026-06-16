<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


require_once '../mail_helper.php';

$data = json_decode(file_get_contents("php://input"));

if (
    empty($data->to) ||
    empty($data->subject) ||
    empty($data->message) ||
    empty($data->contact_id)
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Tüm alanları doldurun."]);
    exit();
}

$to         = filter_var($data->to, FILTER_SANITIZE_EMAIL);
$subject    = htmlspecialchars($data->subject);
$message    = $data->message;
$contact_id = intval($data->contact_id);

if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Geçersiz e-posta adresi."]);
    exit();
}

// HTML mail şablonu
$htmlBody = '<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>' . $subject . '</title>
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
      <h2>' . $subject . '</h2>
      <div class="divider"></div>
      ' . nl2br(htmlspecialchars($message)) . '
    </div>
    <div class="footer">
      <p>Bu e-posta Beeses Audio ekibi tarafından gönderilmiştir.</p>
      <p><a href="https://beesesaudio.com">beesesaudio.com</a></p>
      <p>&copy; ' . date('Y') . ' Beeses Audio. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>';

try {
    $mail_sent = sendMailSMTP($to, $subject, $htmlBody, true);

    if ($mail_sent) {
        // Cevap gönderildiğini veritabanına kaydet (contacts tablosunda status güncelle)
        $stmt = $pdo->prepare("UPDATE contacts SET status = 'replied' WHERE id = ?");
        $stmt->execute([$contact_id]);

                writeAdminLog('contacts', 'Güncelleme', "Kullanıcıya yanıt gönderildi (Alıcı: " . $to . ", Konu: " . $subject . ")");
        echo json_encode([
            "success" => true,
            "message" => "E-posta başarıyla gönderildi: $to"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Mail gönderilemedi. Sunucu SMTP ayarlarını kontrol edin."
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Hata: " . $e->getMessage()
    ]);
}
?>
