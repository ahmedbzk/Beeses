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

$data = json_decode(file_get_contents("php://input"));

if (empty($data->id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Geçersiz istek."]);
    exit();
}

try {
    $stmt = $pdo->prepare("UPDATE newsletter_subscribers SET is_active = 0 WHERE id = :id");
    $stmt->execute([':id' => $data->id]);

    echo json_encode(["success" => true, "message" => "Abone başarıyla silindi."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
