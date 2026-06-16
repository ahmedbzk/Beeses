<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}



// Ensure title_en, summary_en, sections_en, video_url columns exist in news table
try {
    $columns = $pdo->query("SHOW COLUMNS FROM news")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('title_en', $columns)) {
        $pdo->exec("ALTER TABLE news ADD COLUMN title_en VARCHAR(255) DEFAULT NULL AFTER title");
    }
    if (!in_array('summary_en', $columns)) {
        $pdo->exec("ALTER TABLE news ADD COLUMN summary_en TEXT DEFAULT NULL AFTER summary");
    }
    if (!in_array('sections_en', $columns)) {
        $pdo->exec("ALTER TABLE news ADD COLUMN sections_en TEXT DEFAULT NULL AFTER sections");
    }
    if (!in_array('video_url', $columns)) {
        $pdo->exec("ALTER TABLE news ADD COLUMN video_url VARCHAR(500) DEFAULT NULL AFTER image");
    }
} catch (Exception $e) {
    // Ignore if table doesn't exist yet
}

// Form-data ile gelen verileri al
$id = $_POST['id'] ?? '';
$title = $_POST['title'] ?? '';
$summary = $_POST['summary'] ?? '';
$title_en = $_POST['title_en'] ?? '';
$summary_en = $_POST['summary_en'] ?? '';
$category = $_POST['category'] ?? 'Duyuru';
$video_url = $_POST['video_url'] ?? null;
$existing_image = $_POST['image'] ?? '';

if (empty($id) || empty($title) || empty($summary)) {
    echo json_encode(["success" => false, "message" => "Lütfen tüm zorunlu alanları doldurun."]);
    exit;
}

try {
    // 1. Mevcut kaydı çek
    $stmt = $pdo->prepare("SELECT * FROM news WHERE id = ?");
    $stmt->execute([$id]);
    $current = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$current) {
        echo json_encode(["success" => false, "message" => "Haber bulunamadı."]);
        exit;
    }

    $upload_dir = '../uploads/news/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $image_path = $existing_image;

    // Ana görsel değiştiyse
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] == UPLOAD_ERR_OK) {
        $file_tmp_path = $_FILES['image_file']['tmp_name'];
        $file_name = $_FILES['image_file']['name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (in_array($file_ext, $allowed_exts)) {
            $unique_file_name = time() . '_main_' . uniqid() . '.' . $file_ext;
            $dest_path = $upload_dir . $unique_file_name;
            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                // Eski ana resmi sil
                if (!empty($current['image']) && strpos($current['image'], 'uploads/news/') === 0 && file_exists('../' . $current['image'])) {
                    unlink('../' . $current['image']);
                }
                $image_path = 'uploads/news/' . $unique_file_name;
            }
        }
    }

    // Aşamaları/Bölümleri İşle (En fazla 4 aşama)
    $new_sections = [];
    $new_sections_en = [];
    $uploaded_section_images = [];

    for ($i = 0; $i < 4; $i++) {
        $sec_title = $_POST['section_title_' . $i] ?? '';
        $sec_text = $_POST['section_text_' . $i] ?? '';
        $sec_title_en = $_POST['section_title_en_' . $i] ?? '';
        $sec_text_en = $_POST['section_text_en_' . $i] ?? '';
        $existing_sec_image = $_POST['section_existing_image_' . $i] ?? '';
        $sec_image_path = $existing_sec_image;

        // Yeni bir aşama resmi yüklenmiş mi?
        $key = 'section_image_file_' . $i;
        if (isset($_FILES[$key]) && $_FILES[$key]['error'] == UPLOAD_ERR_OK) {
            $file_tmp_path = $_FILES[$key]['tmp_name'];
            $file_name = $_FILES[$key]['name'];
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

            if (in_array($file_ext, $allowed_exts)) {
                $unique_file_name = time() . '_sec_' . $i . '_' . uniqid() . '.' . $file_ext;
                $dest_path = $upload_dir . $unique_file_name;
                if (move_uploaded_file($file_tmp_path, $dest_path)) {
                    // Eğer eski resim varsa ve yenisi yüklendiyse eskisini sil
                    if (!empty($existing_sec_image) && strpos($existing_sec_image, 'uploads/news/') === 0 && file_exists('../' . $existing_sec_image)) {
                        unlink('../' . $existing_sec_image);
                    }
                    $sec_image_path = 'uploads/news/' . $unique_file_name;
                }
            }
        }

        // Eğer başlık, metin veya resim varsa aşamayı ekle
        if (!empty($sec_title) || !empty($sec_text) || !empty($sec_image_path)) {
            $new_sections[] = [
                'title' => $sec_title,
                'text' => $sec_text,
                'image' => $sec_image_path
            ];
            $new_sections_en[] = [
                'title' => $sec_title_en,
                'text' => $sec_text_en
            ];
            if (!empty($sec_image_path)) {
                $uploaded_section_images[] = $sec_image_path;
            }
        }
    }

    // Eski aşamalarda olup yeni aşamalarda referans verilmeyen resimleri sunucudan sil
    $old_sections = json_decode($current['sections'] ?? '[]', true);
    if (is_array($old_sections)) {
        foreach ($old_sections as $old_sec) {
            if (!empty($old_sec['image'])) {
                if (!in_array($old_sec['image'], $uploaded_section_images) && strpos($old_sec['image'], 'uploads/news/') === 0 && file_exists('../' . $old_sec['image'])) {
                    unlink('../' . $old_sec['image']);
                }
            }
        }
    }

    $update = "UPDATE news SET title = ?, title_en = ?, summary = ?, summary_en = ?, category = ?, image = ?, video_url = ?, sections = ?, sections_en = ? WHERE id = ?";
    $stmt = $pdo->prepare($update);
    $stmt->execute([
        $title,
        $title_en,
        $summary,
        $summary_en,
        $category,
        $image_path,
        $video_url,
        json_encode($new_sections),
        json_encode($new_sections_en),
        $id
    ]);
        writeAdminLog('news', 'Güncelleme', "Haber güncellendi: " . $title);
    echo json_encode(["success" => true, "message" => "Haber başarıyla güncellendi."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
