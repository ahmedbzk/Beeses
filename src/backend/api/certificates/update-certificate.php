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

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$icon = $_POST['icon'] ?? 'award';

if (empty($id) || empty($name)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Kimlik (id) ve sertifika adı zorunludur."]);
    exit;
}

try {
    // Fetch the existing certificate to check for the old file
    $stmt = $pdo->prepare("SELECT file_path FROM certificates WHERE id = ?");
    $stmt->execute([$id]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$existing) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Sertifika bulunamadı."]);
        exit;
    }

    $file_path = $existing['file_path'];

    // Handle new file upload
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
            // Delete old file if it exists
            if (!empty($existing['file_path'])) {
                $old_file = '../' . $existing['file_path'];
                if (file_exists($old_file)) {
                    unlink($old_file);
                }
            }
            $file_path = 'uploads/certificates/' . $unique_file_name; 
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Dosya yüklenirken bir hata oluştu."]);
            exit;
        }
    }

    // Update DB
    $query = "UPDATE certificates SET name = ?, description = ?, icon = ?, file_path = ? WHERE id = ?";
    $updateStmt = $pdo->prepare($query);
    $updateStmt->execute([$name, $description, $icon, $file_path, $id]);

    echo json_encode(["success" => true, "message" => "Sertifika başarıyla güncellendi."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
