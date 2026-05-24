<?php
// update-warranty.php - Garanti durumunu güncelleyen API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$ids = $data['ids'] ?? null;
$status = $data['status'] ?? null;

if ((!$id && empty($ids)) || !$status) {
    echo json_encode(["success" => false, "message" => "Eksik bilgi gönderildi."]);
    exit;
}

// Sadece geçerli statülere izin ver
$valid_statuses = ['pending', 'approved', 'rejected'];
if (!in_array($status, $valid_statuses)) {
    echo json_encode(["success" => false, "message" => "Geçersiz durum bilgisi."]);
    exit;
}

try {
    if (!empty($ids) && is_array($ids)) {
        $in  = str_repeat('?,', count($ids) - 1) . '?';
        $sql = "UPDATE warranties SET status = ? WHERE id IN ($in)";
        $stmt = $pdo->prepare($sql);
        $params = array_merge([$status], $ids);
        $stmt->execute($params);
    } else {
        $sql = "UPDATE warranties SET status = ? WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$status, $id]);
    }
    
    echo json_encode(["success" => true, "message" => "Durum başarıyla güncellendi."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
