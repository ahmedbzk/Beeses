<?php
// get-warranties.php - Garanti kayıtlarını listeleyen API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once '../db.php';

try {
    // En yeni kayıt en üstte olacak şekilde tüm kayıtları çek
    $sql = "SELECT * FROM warranties ORDER BY created_at DESC";
    $stmt = $pdo->query($sql);
    
    $warranties = $stmt->fetchAll();
    
    echo json_encode(["success" => true, "data" => $warranties]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
