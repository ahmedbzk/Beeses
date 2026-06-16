<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



// Try getting id from GET first, then fallback to JSON post data
$id = $_GET['id'] ?? null;

if (!$id) {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        $data = $_POST;
    }
    $id = $data['id'] ?? null;
}

if (empty($id)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Kimlik (id) zorunludur."));
    exit();
}

try {
    $query = "DELETE FROM faqs WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$id]);

        writeAdminLog('faq', 'Silme', "Soru silindi (ID: " . $id . ")");
    echo json_encode(array("success" => true, "message" => "Soru başarıyla silindi."));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()));
}
?>
