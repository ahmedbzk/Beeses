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

    // E-posta gönderimi isteğe bağlı olarak kaldırıldı.
    // Başvurular doğrudan Admin paneline (veritabanına) kaydedilir.

    echo json_encode(["success" => true, "message" => "Başvurunuz alınmıştır."]);

} catch(Exception $e) {
    echo json_encode(["success" => false, "message" => "Bir hata oluştu: " . $e->getMessage()]);
}
?>

