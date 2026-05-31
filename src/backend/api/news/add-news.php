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
$category = $_POST['category'] ?? 'Duyuru';
$news_date = date('Y-m-d H:i:s'); // Yayın tarihi otomatik olarak şu anki zaman ayarlanır

if (empty($title) || empty($summary)) {
    echo json_encode(["success" => false, "message" => "Lütfen tüm zorunlu alanları doldurun."]);
    exit;
}

$upload_dir = '../uploads/news/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

// Ana Kapak Görseli yükleme işlemi
$image_path = '';
if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] == UPLOAD_ERR_OK) {
    $file_tmp_path = $_FILES['image_file']['tmp_name'];
    $file_name = $_FILES['image_file']['name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    if (!in_array($file_ext, $allowed_exts)) {
        echo json_encode(["success" => false, "message" => "Sadece JPG, JPEG, PNG, GIF ve WEBP formatları yüklenebilir."]);
        exit;
    }
    
    $unique_file_name = time() . '_main_' . uniqid() . '.' . $file_ext;
    $dest_path = $upload_dir . $unique_file_name;

    if (move_uploaded_file($file_tmp_path, $dest_path)) {
        $image_path = 'uploads/news/' . $unique_file_name; 
    } else {
        echo json_encode(["success" => false, "message" => "Ana görsel yüklenirken bir hata oluştu."]);
        exit;
    }
}

// Haber aşamalarını/bölümlerini oluştur (En fazla 4 aşama)
$sections = [];
for ($i = 0; $i < 4; $i++) {
    $title = $_POST['section_title_' . $i] ?? '';
    $text = $_POST['section_text_' . $i] ?? '';
    $section_image_path = '';

    // Bu aşama için resim yüklenmiş mi kontrol et
    $key = 'section_image_file_' . $i;
    if (isset($_FILES[$key]) && $_FILES[$key]['error'] == UPLOAD_ERR_OK) {
        $file_tmp_path = $_FILES[$key]['tmp_name'];
        $file_name = $_FILES[$key]['name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (in_array($file_ext, $allowed_exts)) {
            $unique_file_name = time() . '_sec_' . $i . '_' . uniqid() . '.' . $file_ext;
            $dest_path = $upload_dir . $unique_file_name;
            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                $section_image_path = 'uploads/news/' . $unique_file_name;
            }
        }
    }

    // Eğer aşamada başlık, metin veya resim varsa ekle
    if (!empty($title) || !empty($text) || !empty($section_image_path)) {
        $sections[] = [
            'title' => $title,
            'text' => $text,
            'image' => $section_image_path
        ];
    }
}

try {
    $insert = "INSERT INTO news (title, summary, content, category, image, sections, news_date) VALUES (?, ?, '', ?, ?, ?, ?)";
    $stmt = $pdo->prepare($insert);
    $stmt->execute([
        $title,
        $summary,
        $category,
        $image_path,
        json_encode($sections),
        $news_date
    ]);
    echo json_encode(["success" => true, "message" => "Haber başarıyla eklendi."]);
} catch (PDOException $e) {
    // Hata durumunda yüklenen resimleri sil
    if (!empty($image_path) && file_exists('../' . $image_path)) unlink('../' . $image_path);
    foreach ($sections as $sec) {
        if (!empty($sec['image']) && file_exists('../' . $sec['image'])) {
            unlink('../' . $sec['image']);
        }
    }
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
