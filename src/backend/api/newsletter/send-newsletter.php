<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->subject) || empty($data->body)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Konu ve içerik zorunludur."]);
    exit();
}

try {
    // Aktif aboneleri getir
    $stmt = $pdo->query("SELECT email FROM newsletter_subscribers WHERE is_active = 1");
    $subscribers = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (empty($subscribers)) {
        echo json_encode(["success" => false, "message" => "Aktif abone bulunamadı."]);
        exit();
    }

    $subject = $data->subject;
    $body    = $data->body;
    $fromEmail = "noreply@beeses.com";
    $fromName  = "Beeses Audio";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $fromName <$fromEmail>\r\n";
    $headers .= "Reply-To: $fromEmail\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // HTML mail şablonu
    $htmlTemplate = '<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>' . htmlspecialchars($subject) . '</title>
<style>
  body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
  .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .header { background-color: #1a1a2e; padding: 32px; text-align: center; }
  .header img { height: 40px; }
  .header h1 { color: #b58131; font-size: 13px; letter-spacing: 4px; text-transform: uppercase; margin: 12px 0 0; }
  .content { padding: 40px 32px; color: #333; line-height: 1.7; font-size: 15px; }
  .content h2 { color: #1a1a2e; font-size: 22px; margin-bottom: 16px; }
  .footer { background-color: #f8f8f8; padding: 24px 32px; text-align: center; border-top: 1px solid #ebebeb; }
  .footer p { color: #999; font-size: 12px; margin: 4px 0; }
  .footer a { color: #b58131; text-decoration: none; }
  .divider { width: 60px; height: 3px; background-color: #b58131; margin: 0 auto 24px; border-radius: 2px; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>BEESES AUDIO</h1>
    </div>
    <div class="content">
      <h2>' . htmlspecialchars($subject) . '</h2>
      <div class="divider"></div>
      ' . nl2br(htmlspecialchars($body)) . '
    </div>
    <div class="footer">
      <p>Bu e-postayı aldınız çünkü Beeses Audio bültenine abonesiniz.</p>
      <p>© ' . date('Y') . ' Beeses Audio. Tüm hakları saklıdır.</p>
    </div>
  </div>
</body>
</html>';

    $sent = 0;
    $failed = 0;

    foreach ($subscribers as $email) {
        if (mail($email, $subject, $htmlTemplate, $headers)) {
            $sent++;
        } else {
            $failed++;
        }
    }

    // Mail gönderim kaydını logla
    $logStmt = $pdo->prepare("INSERT INTO newsletter_logs (subject, body, recipients_count, sent_count, failed_count) VALUES (:subject, :body, :recipients, :sent, :failed)");
    $logStmt->execute([
        ':subject'    => $subject,
        ':body'       => $body,
        ':recipients' => count($subscribers),
        ':sent'       => $sent,
        ':failed'     => $failed
    ]);

    echo json_encode([
        "success" => true,
        "message" => "$sent abone adresine e-posta başarıyla gönderildi.",
        "sent"    => $sent,
        "failed"  => $failed
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
