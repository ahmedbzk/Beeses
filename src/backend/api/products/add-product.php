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

$slug = $_POST['slug'] ?? '';
$name = $_POST['name'] ?? '';
$category = $_POST['category'] ?? '';
$shortDescription = $_POST['shortDescription'] ?? '';
$description = $_POST['description'] ?? '';
$specs = $_POST['specs'] ?? '[]';
$features = $_POST['features'] ?? '[]';

if (empty($slug) || empty($name) || empty($category)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Urun adi, slug ve kategori alanlari zorunludur."]);
    exit;
}

$upload_dir = '../uploads/products/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'png'];
$allowed_doc_exts = ['pdf', 'doc', 'docx'];

$image_path = '';

// Handle Primary Image Upload
if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] == UPLOAD_ERR_OK) {
    $file_tmp_path = $_FILES['image_file']['tmp_name'];
    $file_name = $_FILES['image_file']['name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

    if (in_array($file_ext, $allowed_exts)) {
        $unique_file_name = time() . '_main_' . uniqid() . '.' . $file_ext;
        $dest_path = $upload_dir . $unique_file_name;
        if (move_uploaded_file($file_tmp_path, $dest_path)) {
            $image_path = 'uploads/products/' . $unique_file_name;
        }
    }
}

if (empty($image_path)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Ana urun gorseli yuklenmelidir."]);
    exit;
}

$gallery_images = [$image_path]; // First image in gallery is the main one

// Handle Gallery Image Uploads (up to 4)
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
                $gallery_images[] = 'uploads/products/' . $unique_file_name;
            }
        }
    }
}

$pdf_path = '';

// Handle PDF Upload
if (isset($_FILES['pdf_file']) && $_FILES['pdf_file']['error'] == UPLOAD_ERR_OK) {
    $file_tmp_path = $_FILES['pdf_file']['tmp_name'];
    $file_name = $_FILES['pdf_file']['name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));

    if (in_array($file_ext, $allowed_doc_exts)) {
        $unique_file_name = time() . '_doc_' . uniqid() . '.' . $file_ext;
        $dest_path = $upload_dir . $unique_file_name;
        if (move_uploaded_file($file_tmp_path, $dest_path)) {
            $pdf_path = 'uploads/products/' . $unique_file_name;
        }
    }
}

try {
    $query = "INSERT INTO products (slug, name, category, shortDescription, description, image, images, pdfUrl, specs, features) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        $slug,
        $name,
        $category,
        $shortDescription,
        $description,
        $image_path,
        json_encode($gallery_images),
        $pdf_path,
        $specs,
        $features
    ]);

    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Urun basariyla eklendi.", "id" => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    // If database insert fails, clean up uploaded files
    if (file_exists('../' . $image_path)) unlink('../' . $image_path);
    foreach ($gallery_images as $g_img) {
        if ($g_img !== $image_path && file_exists('../' . $g_img)) {
            unlink('../' . $g_img);
        }
    }
    if (!empty($pdf_path) && file_exists('../' . $pdf_path)) unlink('../' . $pdf_path);

    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
