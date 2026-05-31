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

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    $data = $_POST;
}

$id = $data['id'] ?? null;
$question = $data['question'] ?? '';
$answer = $data['answer'] ?? '';

if (empty($id) || empty($question) || empty($answer)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Kimlik (id), Soru ve Cevap alanları zorunludur."));
    exit();
}

try {
    $query = "UPDATE faqs SET question = ?, answer = ? WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$question, $answer, $id]);

    echo json_encode(array("success" => true, "message" => "Soru başarıyla güncellendi."));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()));
}
?>
