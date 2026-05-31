<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

try {
    // Tüm gönderim loglarını getir (yeniden eskiye sıralı)
    $stmt = $pdo->query("SELECT * FROM newsletter_logs ORDER BY sent_at DESC");
    $logs = $stmt->fetchAll();

    echo json_encode(["success" => true, "data" => $logs, "count" => count($logs)]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
