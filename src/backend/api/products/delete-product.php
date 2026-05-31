<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        $data = $_POST;
    }
    $id = $data['id'] ?? null;
}

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Urun kimligi (id) zorunludur."]);
    exit;
}

try {
    // 1. Fetch product files to delete them physically
    $stmt = $pdo->prepare("SELECT image, images, pdfUrl FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $prod = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($prod) {
        // Delete main image
        if (!empty($prod['image']) && strpos($prod['image'], 'uploads/') === 0 && file_exists('../' . $prod['image'])) {
            unlink('../' . $prod['image']);
        }

        // Delete gallery images
        $gallery = json_decode($prod['images'] ?? '[]', true);
        if (is_array($gallery)) {
            foreach ($gallery as $img) {
                if ($img !== $prod['image'] && strpos($img, 'uploads/') === 0 && file_exists('../' . $img)) {
                    unlink('../' . $img);
                }
            }
        }

        // Delete PDF
        if (!empty($prod['pdfUrl']) && strpos($prod['pdfUrl'], 'uploads/') === 0 && file_exists('../' . $prod['pdfUrl'])) {
            unlink('../' . $prod['pdfUrl']);
        }

        // 2. Delete database record
        $deleteStmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $deleteStmt->execute([$id]);

        echo json_encode(["success" => true, "message" => "Urun ve iliskili tum dosyalar basariyla silindi."]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Urun bulunamadi."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
