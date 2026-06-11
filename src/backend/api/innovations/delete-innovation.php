<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "Eksik veri gönderildi. (ID gerekli)"]);
    exit;
}

try {
    $sql = "DELETE FROM innovations WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $data['id']]);

    echo json_encode([
        "success" => true,
        "message" => "İnovasyon projesi başarıyla silindi."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Veritabanı hatası: " . $e->getMessage()
    ]);
}
?>
