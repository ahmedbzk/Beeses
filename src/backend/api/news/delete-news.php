<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "Geçersiz ID."]);
    exit;
}

try {
    // Görsel dosyasını silmek için önce haberi çekelim
    $selectStmt = $pdo->prepare("SELECT image FROM news WHERE id = ?");
    $selectStmt->execute([$id]);
    $newsItem = $selectStmt->fetch();
    
    if ($newsItem && !empty($newsItem['image'])) {
        $image = $newsItem['image'];
        // Yalnızca bizim yüklediğimiz ve var olan görselleri siliyoruz
        if (strpos($image, 'uploads/news/') === 0 && file_exists('../' . $image)) {
            unlink('../' . $image);
        }
    }

    $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
    $stmt->execute([$id]);
        writeAdminLog('news', 'Silme', "Haber silindi (ID: " . $id . ")");
    echo json_encode(["success" => true, "message" => "Haber başarıyla silindi."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
