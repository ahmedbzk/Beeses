<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



try {
    $stmt = $pdo->query("SELECT * FROM newsletter_subscribers WHERE is_active = 1 ORDER BY subscribed_at DESC");
    $subscribers = $stmt->fetchAll();

    echo json_encode(["success" => true, "data" => $subscribers, "count" => count($subscribers)]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
