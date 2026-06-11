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

$id = $_POST['id'] ?? '';
$title = $_POST['title'] ?? '';
$title_en = $_POST['title_en'] ?? '';
$subtitle = $_POST['subtitle'] ?? '';
$subtitle_en = $_POST['subtitle_en'] ?? '';
$description = $_POST['description'] ?? '';
$description_en = $_POST['description_en'] ?? '';
$status = $_POST['status'] ?? '';
$status_en = $_POST['status_en'] ?? '';
$launchDate = $_POST['launchDate'] ?? '';
$features = $_POST['features'] ?? '[]';
$features_en = $_POST['features_en'] ?? '[]';
$specs = $_POST['specs'] ?? '[]';
$specs_en = $_POST['specs_en'] ?? '[]';

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Eksik veri gönderildi. (ID gerekli)"]);
    exit;
}

try {
    // Fetch the existing record to get current image
    $stmt = $pdo->prepare("SELECT image FROM innovations WHERE id = :id");
    $stmt->execute([':id' => $id]);
    $existing = $stmt->fetch();
    
    if (!$existing) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Güncellenecek inovasyon projesi bulunamadı."]);
        exit;
    }

    $image_path = $existing['image'];
    $old_image = $existing['image'];

    // Handle Image Upload
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] == UPLOAD_ERR_OK) {
        $upload_dir = '../uploads/innovations/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }

        $file_tmp_path = $_FILES['image_file']['tmp_name'];
        $file_name = $_FILES['image_file']['name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (in_array($file_ext, $allowed_exts)) {
            $unique_file_name = time() . '_' . uniqid() . '.' . $file_ext;
            $dest_path = $upload_dir . $unique_file_name;
            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                $image_path = 'uploads/innovations/' . $unique_file_name;
                
                // Delete old image file if it exists and is stored in uploads/innovations
                if (!empty($old_image) && strpos($old_image, 'uploads/innovations/') === 0) {
                    $old_file_path = '../' . $old_image;
                    if (file_exists($old_file_path)) {
                        unlink($old_file_path);
                    }
                }
            }
        }
    } else {
        // If image file wasn't uploaded, check if image was kept or cleared
        if (isset($_POST['image'])) {
            $image_path = $_POST['image'];
            // If the image was cleared (empty string), delete old image if existed
            if (empty($image_path) && !empty($old_image) && strpos($old_image, 'uploads/innovations/') === 0) {
                $old_file_path = '../' . $old_image;
                if (file_exists($old_file_path)) {
                    unlink($old_file_path);
                }
            }
        }
    }

    $sql = "UPDATE innovations SET 
                title = :title, 
                title_en = :title_en, 
                subtitle = :subtitle, 
                subtitle_en = :subtitle_en, 
                description = :description, 
                description_en = :description_en, 
                status = :status, 
                status_en = :status_en, 
                launchDate = :launchDate, 
                features = :features, 
                features_en = :features_en, 
                specs = :specs, 
                specs_en = :specs_en, 
                image = :image
            WHERE id = :id";
    
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
        ':id' => $id,
        ':title' => $title,
        ':title_en' => $title_en,
        ':subtitle' => $subtitle,
        ':subtitle_en' => $subtitle_en,
        ':description' => $description,
        ':description_en' => $description_en,
        ':status' => $status,
        ':status_en' => $status_en,
        ':launchDate' => $launchDate,
        ':features' => $features,
        ':features_en' => $features_en,
        ':specs' => $specs,
        ':specs_en' => $specs_en,
        ':image' => $image_path
    ]);

    echo json_encode([
        "success" => true,
        "message" => "İnovasyon projesi başarıyla güncellendi."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Veritabanı hatası: " . $e->getMessage()
    ]);
}
?>
