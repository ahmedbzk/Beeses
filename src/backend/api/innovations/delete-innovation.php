<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");



$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(["success" => false, "message" => "Eksik veri gönderildi. (ID gerekli)"]);
    exit;
}

try {
    $sql = "DELETE FROM innovations WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $data['id']]);

        writeAdminLog('innovations', 'Silme', "İnovasyon silindi (ID: " . $data['id'] . ")");
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
