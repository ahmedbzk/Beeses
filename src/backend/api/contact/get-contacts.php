<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



try {
    $query = "SELECT * FROM contacts ORDER BY created_at DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $contacts = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode(array("success" => true, "data" => $contacts));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()));
}
?>
