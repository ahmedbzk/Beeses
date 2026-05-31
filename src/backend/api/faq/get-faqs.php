<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../db.php';

try {
    $stmt = $pdo->query("SELECT * FROM faqs ORDER BY id ASC");
    $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $faqs]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
