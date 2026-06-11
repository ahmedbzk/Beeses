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

if (empty($title)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Baslik alani zorunludur."]);
    exit;
}

$upload_dir = '../uploads/innovations/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$image_path = '';

// Handle Image Upload
if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] == UPLOAD_ERR_OK) {
    $file_tmp_path = $_FILES['image_file']['tmp_name'];
    $file_name = $_FILES['image_file']['name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (in_array($file_ext, $allowed_exts)) {
        $unique_file_name = time() . '_' . uniqid() . '.' . $file_ext;
        $dest_path = $upload_dir . $unique_file_name;
        if (move_uploaded_file($file_tmp_path, $dest_path)) {
            $image_path = 'uploads/innovations/' . $unique_file_name;
        }
    }
}

try {
    $sql = "INSERT INTO innovations (title, title_en, subtitle, subtitle_en, description, description_en, status, status_en, launchDate, features, features_en, specs, specs_en, image) 
            VALUES (:title, :title_en, :subtitle, :subtitle_en, :description, :description_en, :status, :status_en, :launchDate, :features, :features_en, :specs, :specs_en, :image)";
    
    $stmt = $pdo->prepare($sql);
    
    $stmt->execute([
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

    $id = $pdo->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "İnovasyon projesi başarıyla eklendi.",
        "id" => $id
    ]);

} catch (PDOException $e) {
    if (!empty($image_path) && file_exists('../' . $image_path)) {
        unlink('../' . $image_path);
    }
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Veritabanı hatası: " . $e->getMessage()
    ]);
}
?>
