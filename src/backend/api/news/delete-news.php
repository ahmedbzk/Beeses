<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "Geçersiz ID."]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true, "message" => "Haber başarıyla silindi."]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
