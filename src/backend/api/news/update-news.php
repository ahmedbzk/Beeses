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

if (empty($data['id']) || empty($data['title']) || empty($data['summary']) || empty($data['content']) || empty($data['news_date'])) {
    echo json_encode(["success" => false, "message" => "Lütfen tüm zorunlu alanları doldurun."]);
    exit;
}

try {
    $update = "UPDATE news SET title = ?, summary = ?, content = ?, category = ?, image = ?, news_date = ? WHERE id = ?";
    $stmt = $pdo->prepare($update);
    $stmt->execute([
        $data['title'],
        $data['summary'],
        $data['content'],
        $data['category'],
        $data['image'],
        $data['news_date'],
        $data['id']
    ]);
    echo json_encode(["success" => true, "message" => "Haber başarıyla güncellendi."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
