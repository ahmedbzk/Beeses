<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

try {
    $query = "SELECT * FROM distributors ORDER BY created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $distributors = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode(array("success" => true, "data" => $distributors));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()));
}
?>
