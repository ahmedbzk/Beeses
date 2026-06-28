<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$id = $_POST['id'] ?? null;
$slug = $_POST['slug'] ?? '';
$name = $_POST['name'] ?? '';
$category = $_POST['category'] ?? '';
$shortDescription = $_POST['shortDescription'] ?? '';
$description = $_POST['description'] ?? '';
$specs = $_POST['specs'] ?? '[]';
$features = $_POST['features'] ?? '[]';
$shortDescription_en = $_POST['shortDescription_en'] ?? '';
$description_en = $_POST['description_en'] ?? '';
$specs_en = $_POST['specs_en'] ?? '[]';
$features_en = $_POST['features_en'] ?? '[]';
$name_en = $_POST['name_en'] ?? '';
$existing_images_json = $_POST['existing_images'] ?? '[]';

if (empty($id) || empty($slug) || empty($name) || empty($category) || empty($name_en)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Lütfen Türkçe ve İngilizce isimler dahil tüm zorunlu alanları doldurun."]);
    exit;
}

// Upload error code => mesaj
function getUploadErrorMessage($code) {
    $errors = [
        UPLOAD_ERR_INI_SIZE   => 'Dosya boyutu sunucu limitini aşıyor (upload_max_filesize: ' . ini_get('upload_max_filesize') . ')',
        UPLOAD_ERR_FORM_SIZE  => 'Dosya boyutu form limitini aşıyor',
        UPLOAD_ERR_PARTIAL    => 'Dosya kısmen yüklendi, tekrar deneyin',
        UPLOAD_ERR_NO_TMP_DIR => 'Geçici klasör bulunamadı',
        UPLOAD_ERR_CANT_WRITE => 'Disk yazma hatası',
        UPLOAD_ERR_EXTENSION  => 'Bir PHP eklentisi yüklemeyi durdurdu',
    ];
    return $errors[$code] ?? 'Bilinmeyen upload hatası (kod: ' . $code . ')';
}

try {
    // 1. Mevcut ürünü getir
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $current = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$current) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Ürün bulunamadı."]);
        exit;
    }

    $upload_dir = '../uploads/products/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    $allowed_doc_exts = ['pdf', 'doc', 'docx'];

    $image_path = $current['image'];
    $pdf_path = $current['pdfUrl'];

    // Korunan galeri görsellerini parse et
    $preserved_images = json_decode($existing_images_json, true);
    if (!is_array($preserved_images)) {
        $preserved_images = [];
    }

    // Ana görsel yükleme
    $main_image_updated = false;
    $old_main_replaced = false;

    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] !== UPLOAD_ERR_NO_FILE) {
        if ($_FILES['image_file']['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Ana görsel yüklenemedi: " . getUploadErrorMessage($_FILES['image_file']['error'])]);
            exit;
        }

        $file_tmp_path = $_FILES['image_file']['tmp_name'];
        $file_name = $_FILES['image_file']['name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (in_array($file_ext, $allowed_exts)) {
            $unique_file_name = time() . '_main_' . uniqid() . '.' . $file_ext;
            $dest_path = $upload_dir . $unique_file_name;
            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                if (!empty($current['image']) && strpos($current['image'], 'uploads/') === 0 && file_exists('../' . $current['image'])) {
                    unlink('../' . $current['image']);
                }
                $image_path = 'uploads/products/' . $unique_file_name;
                $main_image_updated = true;
                $old_main_replaced = true;
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Ana görsel sunucuya taşınamadı. Klasör izinlerini kontrol edin."]);
                exit;
            }
        }
    } else {
        // Yeni görsel yüklenmemişse, UI'daki swap değişikliğini kontrol et
        if (!empty($preserved_images) && isset($preserved_images[0]) && $preserved_images[0] !== $current['image']) {
            $image_path = $preserved_images[0];
            $main_image_updated = true;
        }
    }

    // Yeni galeriyi oluştur
    $new_gallery = [];
    $new_gallery[] = $image_path;

    foreach ($preserved_images as $p_img) {
        if ($p_img !== $image_path && !empty($p_img)) {
            if ($old_main_replaced && $p_img === $current['image']) {
                continue;
            }
            $new_gallery[] = $p_img;
        }
    }

    // Yeni galeri dosyaları yükle
    for ($i = 0; $i < 4; $i++) {
        $key = 'gallery_file_' . $i;
        if (isset($_FILES[$key]) && $_FILES[$key]['error'] == UPLOAD_ERR_OK) {
            $file_tmp_path = $_FILES[$key]['tmp_name'];
            $file_name = $_FILES[$key]['name'];
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

            if (in_array($file_ext, $allowed_exts)) {
                $unique_file_name = time() . '_gal_' . $i . '_' . uniqid() . '.' . $file_ext;
                $dest_path = $upload_dir . $unique_file_name;
                if (move_uploaded_file($file_tmp_path, $dest_path)) {
                    $new_gallery[] = 'uploads/products/' . $unique_file_name;
                }
            }
        }
    }

    $new_gallery = array_slice($new_gallery, 0, 5);

    // Galeriden çıkarılan eski dosyaları sil
    $old_gallery = json_decode($current['images'] ?? '[]', true);
    if (is_array($old_gallery)) {
        foreach ($old_gallery as $old_img) {
            if (!in_array($old_img, $new_gallery) && strpos($old_img, 'uploads/') === 0 && file_exists('../' . $old_img)) {
                unlink('../' . $old_img);
            }
        }
    }

    // PDF yükleme (TR)
    if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] == UPLOAD_ERR_OK) {
        $file_tmp_path = $_FILES['pdf_file']['tmp_name'];
        $file_name = $_FILES['pdf_file']['name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (in_array($file_ext, $allowed_doc_exts)) {
            $unique_file_name = time() . '_doc_' . uniqid() . '.' . $file_ext;
            $dest_path = $upload_dir . $unique_file_name;
            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                if (!empty($current['pdfUrl']) && strpos($current['pdfUrl'], 'uploads/') === 0 && file_exists('../' . $current['pdfUrl'])) {
                    unlink('../' . $current['pdfUrl']);
                }
                $pdf_path = 'uploads/products/' . $unique_file_name;
            }
        }
    } else if (isset($_POST['delete_pdf']) && $_POST['delete_pdf'] == 'true') {
        if (!empty($current['pdfUrl']) && strpos($current['pdfUrl'], 'uploads/') === 0 && file_exists('../' . $current['pdfUrl'])) {
            unlink('../' . $current['pdfUrl']);
        }
        $pdf_path = '';
    }

    // PDF yükleme (EN)
    $pdf_path_en = $current['pdfUrl_en'] ?? '';
    if (isset($_FILES['pdf_file_en']) && $_FILES['pdf_file_en']['error'] == UPLOAD_ERR_OK) {
        $file_tmp_path = $_FILES['pdf_file_en']['tmp_name'];
        $file_name = $_FILES['pdf_file_en']['name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (in_array($file_ext, $allowed_doc_exts)) {
            $unique_file_name = time() . '_doc_en_' . uniqid() . '.' . $file_ext;
            $dest_path = $upload_dir . $unique_file_name;
            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                if (!empty($current['pdfUrl_en']) && strpos($current['pdfUrl_en'], 'uploads/') === 0 && file_exists('../' . $current['pdfUrl_en'])) {
                    unlink('../' . $current['pdfUrl_en']);
                }
                $pdf_path_en = 'uploads/products/' . $unique_file_name;
            }
        }
    } else if (isset($_POST['delete_pdf_en']) && $_POST['delete_pdf_en'] == 'true') {
        if (!empty($current['pdfUrl_en']) && strpos($current['pdfUrl_en'], 'uploads/') === 0 && file_exists('../' . $current['pdfUrl_en'])) {
            unlink('../' . $current['pdfUrl_en']);
        }
        $pdf_path_en = '';
    }

    // Kullanım Kılavuzu (TR)
    $manual_path = $current['manualUrl'] ?? '';
    if (isset($_FILES['manual_file']) && $_FILES['manual_file']['error'] == UPLOAD_ERR_OK) {
        $file_tmp_path = $_FILES['manual_file']['tmp_name'];
        $file_name = $_FILES['manual_file']['name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (in_array($file_ext, $allowed_doc_exts)) {
            $unique_file_name = time() . '_manual_' . uniqid() . '.' . $file_ext;
            $dest_path = $upload_dir . $unique_file_name;
            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                if (!empty($current['manualUrl']) && strpos($current['manualUrl'], 'uploads/') === 0 && file_exists('../' . $current['manualUrl'])) {
                    unlink('../' . $current['manualUrl']);
                }
                $manual_path = 'uploads/products/' . $unique_file_name;
            }
        }
    } else if (isset($_POST['delete_manual']) && $_POST['delete_manual'] == 'true') {
        if (!empty($current['manualUrl']) && strpos($current['manualUrl'], 'uploads/') === 0 && file_exists('../' . $current['manualUrl'])) {
            unlink('../' . $current['manualUrl']);
        }
        $manual_path = '';
    }

    // Kullanım Kılavuzu (EN)
    $manual_path_en = $current['manualUrl_en'] ?? '';
    if (isset($_FILES['manual_file_en']) && $_FILES['manual_file_en']['error'] == UPLOAD_ERR_OK) {
        $file_tmp_path = $_FILES['manual_file_en']['tmp_name'];
        $file_name = $_FILES['manual_file_en']['name'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

        if (in_array($file_ext, $allowed_doc_exts)) {
            $unique_file_name = time() . '_manual_en_' . uniqid() . '.' . $file_ext;
            $dest_path = $upload_dir . $unique_file_name;
            if (move_uploaded_file($file_tmp_path, $dest_path)) {
                if (!empty($current['manualUrl_en']) && strpos($current['manualUrl_en'], 'uploads/') === 0 && file_exists('../' . $current['manualUrl_en'])) {
                    unlink('../' . $current['manualUrl_en']);
                }
                $manual_path_en = 'uploads/products/' . $unique_file_name;
            }
        }
    } else if (isset($_POST['delete_manual_en']) && $_POST['delete_manual_en'] == 'true') {
        if (!empty($current['manualUrl_en']) && strpos($current['manualUrl_en'], 'uploads/') === 0 && file_exists('../' . $current['manualUrl_en'])) {
            unlink('../' . $current['manualUrl_en']);
        }
        $manual_path_en = '';
    }

    // Veritabanını güncelle
    $query = "UPDATE products 
              SET slug = ?, name = ?, name_en = ?, category = ?, shortDescription = ?, description = ?, shortDescription_en = ?, description_en = ?, image = ?, images = ?, pdfUrl = ?, pdfUrl_en = ?, manualUrl = ?, manualUrl_en = ?, specs = ?, features = ?, specs_en = ?, features_en = ? 
              WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        $slug,
        $name,
        $name_en,
        $category,
        $shortDescription,
        $description,
        $shortDescription_en,
        $description_en,
        $image_path,
        json_encode($new_gallery),
        $pdf_path,
        $pdf_path_en,
        $manual_path,
        $manual_path_en,
        $specs,
        $features,
        $specs_en,
        $features_en,
        $id
    ]);

    writeAdminLog('products', 'Güncelleme', "Ürün güncellendi: " . $name);
    echo json_encode(["success" => true, "message" => "Ürün başarıyla güncellendi."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
