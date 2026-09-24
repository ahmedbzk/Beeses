<?php
// apply.php - Handles distributor application form submissions
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
    $company_name = $_POST['company_name'] ?? '';
    $contact_email = $_POST['contact_email'] ?? '';
    $group1_info = $_POST['group1_info'] ?? '';
    $group2_info = $_POST['group2_info'] ?? '';
    $group3_info = $_POST['group3_info'] ?? '';

    if (empty($company_name) || empty($contact_email)) {
        echo json_encode(["success" => false, "message" => "Zorunlu alanları doldurunuz."]);
        exit;
    }

    $file_path = '';

    // Handle File Upload
    if (isset($_FILES['company_profile']) && $_FILES['company_profile']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/../uploads/applications/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $tmpName = $_FILES['company_profile']['tmp_name'];
        $originalName = $_FILES['company_profile']['name'];
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        $allowedExts = ['pdf', 'doc', 'docx'];
        if (!in_array($ext, $allowedExts)) {
            echo json_encode(["success" => false, "message" => "Geçersiz dosya formatı. Sadece PDF, DOC, DOCX."]);
            exit;
        }

        if ($_FILES['company_profile']['size'] > 5 * 1024 * 1024) {
            echo json_encode(["success" => false, "message" => "Dosya boyutu 5MB'den büyük olamaz."]);
            exit;
        }

        $newFileName = uniqid('app_') . '_' . time() . '.' . $ext;
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($tmpName, $destPath)) {
            $file_path = 'uploads/applications/' . $newFileName;
        } else {
            echo json_encode(["success" => false, "message" => "Dosya yüklenirken hata oluştu."]);
            exit;
        }
    }

    // Save to Database
    $sql = "INSERT INTO distributor_applications (
        company_name, contact_email, group1_info, group2_info, group3_info, file_path
    ) VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $company_name, $contact_email, $group1_info, $group2_info, $group3_info, $file_path
    ]);

    $appId = $pdo->lastInsertId();

    // Admin Bildirim E-postası
    try {
        $fileHtml = '';
        if (!empty($file_path)) {
            $fileUrl = 'https://beesesaudio.com/backend/api/' . $file_path;
            $fileHtml = '<p><strong>Şirket Profili Dosyası:</strong> <a href="' . $fileUrl . '" style="color: #0056b3;">Dosyayı İndir / Görüntüle</a></p>';
        }

        $htmlMessage = '
        <div style="font-family: Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.6;">
            <p><strong>Firma:</strong> '.htmlspecialchars($company_name).'<br>
            <strong>İletişim E-Posta:</strong> '.htmlspecialchars($contact_email).'</p>
            ' . $fileHtml . '
            <hr style="border: none; border-top: 1px solid #ccc; margin: 15px 0;">
            <p><strong>1. Firma ve Operasyonel Bilgiler:</strong><br>'.nl2br(htmlspecialchars($group1_info)).'</p><br>
            <p><strong>2. Pazar ve Müşteri:</strong><br>'.nl2br(htmlspecialchars($group2_info)).'</p><br>
            <p><strong>3. Pazarlama ve Deneyim:</strong><br>'.nl2br(htmlspecialchars($group3_info)).'</p>
        </div>';
        try {
            sendMailSMTP('info@beesesaudio.com', 'Yeni Distribütör Başvurusu: ' . $company_name, $htmlMessage, true, $contact_email, $company_name . ' (Distribütör)');
        } catch (Exception $e) {}
        try {
            sendMailSMTP('mahmut.lapoglu@iotek.com.tr', 'Yeni Distribütör Başvurusu: ' . $company_name, $htmlMessage, true, $contact_email, $company_name . ' (Distribütör)');
        } catch (Exception $e) {}
    } catch (Exception $mailEx) {
        // Mail gönderim hatası formu engellemesin
    }

    echo json_encode(["success" => true, "message" => "Başvurunuz alınmıştır."]);

} catch(Exception $e) {
    echo json_encode(["success" => false, "message" => "Bir hata oluştu: " . $e->getMessage()]);
}
?>

