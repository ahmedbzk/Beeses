<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->name) &&
    !empty($data->surname) &&
    !empty($data->email) &&
    !empty($data->subject) &&
    !empty($data->message)
) {
    try {
        $query = "INSERT INTO contacts (first_name, last_name, email, phone, subject, message) VALUES (:first_name, :last_name, :email, :phone, :subject, :message)";
        $stmt = $pdo->prepare($query);

        $stmt->bindParam(':first_name', $data->name);
        $stmt->bindParam(':last_name', $data->surname);
        $stmt->bindParam(':email', $data->email);
        
        $phone = isset($data->phone) ? $data->phone : null;
        $stmt->bindParam(':phone', $phone);
        
        $stmt->bindParam(':subject', $data->subject);
        $stmt->bindParam(':message', $data->message);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(array("success" => true, "message" => "Mesajınız başarıyla gönderildi."));
        } else {
            http_response_code(503);
            echo json_encode(array("success" => false, "message" => "Mesaj gönderilirken bir hata oluştu."));
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(array("success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Lütfen tüm alanları doldurunuz."));
}
?>
