<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../db.php';

// Form-data ile gelen metinsel verileri al
$title = $_POST['title'] ?? '';
$summary = $_POST['summary'] ?? '';
$content = $_POST['content'] ?? '';
$category = $_POST['category'] ?? 'Duyuru';
$news_date = $_POST['news_date'] ?? '';

if (empty($title) || empty($summary) || empty($content)) {
    echo json_encode(["success" => false, "message" => "Lütfen tüm zorunlu alanları doldurun."]);
    exit;
}

if (empty($news_date)) {
    $news_date = date('Y-m-d H:i:s');
}

$image_path = '';

// Dosya yükleme işlemi (Görsel dosyası)
if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] == UPLOAD_ERR_OK) {
    $file_tmp_path = $_FILES['image_file']['tmp_name'];
    $file_name = $_FILES['image_file']['name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($file_ext, $allowed_exts)) {
        echo json_encode(["success" => false, "message" => "Sadece JPG, JPEG, PNG, GIF ve WEBP formatları yüklenebilir."]);
        exit;
    }
    
    $upload_dir = '../uploads/news/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    $unique_file_name = time() . '_' . uniqid() . '.' . $file_ext;
    $dest_path = $upload_dir . $unique_file_name;

    if (move_uploaded_file($file_tmp_path, $dest_path)) {
        $image_path = 'uploads/news/' . $unique_file_name; 
    } else {
        echo json_encode(["success" => false, "message" => "Dosya yüklenirken bir hata oluştu."]);
        exit;
    }
}

try {
    $insert = "INSERT INTO news (title, summary, content, category, image, news_date) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($insert);
    $stmt->execute([
        $title,
        $summary,
        $content,
        $category,
        $image_path,
        $news_date
    ]);
    echo json_encode(["success" => true, "message" => "Haber başarıyla eklendi."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
