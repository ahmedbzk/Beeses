<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['title']) || empty($data['summary']) || empty($data['content'])) {
    echo json_encode(["success" => false, "message" => "Lütfen tüm zorunlu alanları doldurun."]);
    exit;
}

$news_date = $data['news_date'] ?? null;
if (empty($news_date)) {
    $news_date = date('Y-m-d H:i:s');
}

try {
    $insert = "INSERT INTO news (title, summary, content, category, image, news_date) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($insert);
    $stmt->execute([
        $data['title'],
        $data['summary'],
        $data['content'],
        $data['category'] ?? 'Duyuru',
        $data['image'] ?? '',
        $news_date
    ]);
    echo json_encode(["success" => true, "message" => "Haber başarıyla eklendi."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
