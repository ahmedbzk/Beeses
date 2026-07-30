<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Id, X-Admin-Username, X-Admin-Token");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../mail_helper.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    if(!isset($data->id) || !isset($data->status)) {
        echo json_encode(["success" => false, "message" => "Eksik ID veya durum."]);
        exit;
    }

    $id = $data->id;
    $status = $data->status;
    $reply_message = isset($data->reply_message) ? $data->reply_message : null;

    if ($reply_message) {
        $stmt = $pdo->prepare("UPDATE distributor_applications SET status = ?, reply_message = ? WHERE id = ?");
        $stmt->execute([$status, $reply_message, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE distributor_applications SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
    }

    if ($status === 'answered' && !empty($reply_message)) {
        $stmtInfo = $pdo->prepare("SELECT contact_email, company_name FROM distributor_applications WHERE id = ?");
        $stmtInfo->execute([$id]);
        $appInfo = $stmtInfo->fetch(PDO::FETCH_ASSOC);

        if ($appInfo && !empty($appInfo['contact_email'])) {
            $to = $appInfo['contact_email'];
            $companyName = $appInfo['company_name'];
            $subject = "Beeses Audio - Distributor Application Reply";

            $htmlBody = '<!DOCTYPE html>
<html lang="en">
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
      <h2>Dear ' . htmlspecialchars($companyName) . ' Team,</h2>
      <div class="divider"></div>
      <p>' . nl2br(htmlspecialchars($reply_message)) . '</p>
    </div>
    <div class="footer">
      <p>This email was sent by the Beeses Audio Team.</p>
      <p><a href="https://beesesaudio.com">beesesaudio.com</a></p>
      <p>&copy; ' . date('Y') . ' Beeses Audio. All rights reserved.</p>
    </div>
  </div>
</body>
</html>';

            sendMailSMTP($to, $subject, $htmlBody, true);
        }
    }

    writeAdminLog('distributor_applications', 'update_status', json_encode(['application_id' => $id, 'new_status' => $status]));

    echo json_encode(["success" => true, "message" => "Durum güncellendi."]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
