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

// Fetch multipart/form-data fields
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$icon = $_POST['icon'] ?? 'award';

if (empty($name)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Sertifika adı zorunludur."]);
    exit;
}

$file_path = '';

// Handle file upload
if (isset($_FILES['certificate_file']) && $_FILES['certificate_file']['error'] == UPLOAD_ERR_OK) {
    $file_tmp_path = $_FILES['certificate_file']['tmp_name'];
    $file_name = $_FILES['certificate_file']['name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    $allowed_exts = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($file_ext, $allowed_exts)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Sadece PDF, JPG, JPEG, PNG, GIF ve WEBP formatları yüklenebilir."]);
        exit;
    }
    
    $upload_dir = '../uploads/certificates/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $unique_file_name = time() . '_' . uniqid() . '.' . $file_ext;
    $dest_path = $upload_dir . $unique_file_name;

    if (move_uploaded_file($file_tmp_path, $dest_path)) {
        $file_path = 'uploads/certificates/' . $unique_file_name; 
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Dosya yüklenirken bir hata oluştu."]);
        exit;
    }
}

try {
    $insert = "INSERT INTO certificates (name, description, icon, file_path) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($insert);
    $stmt->execute([$name, $description, $icon, $file_path]);
    
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Sertifika başarıyla eklendi.", "id" => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
