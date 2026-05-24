<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->status)) {
    try {
        $query = "UPDATE contacts SET status = :status, reply_message = IFNULL(:reply_message, reply_message) WHERE id = :id";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(':status', $data->status);
        $stmt->bindParam(':id', $data->id);
        
        $reply_message = isset($data->reply_message) ? $data->reply_message : null;
        $stmt->bindParam(':reply_message', $reply_message);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(array("success" => true, "message" => "Durum güncellendi."));
        } else {
            http_response_code(503);
            echo json_encode(array("success" => false, "message" => "Durum güncellenemedi."));
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Eksik veri."));
}
?>
