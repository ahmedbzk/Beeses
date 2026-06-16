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
    // Fetch certificate to check if exists
    $stmt = $pdo->prepare("SELECT id FROM certificates WHERE id = ?");
    $stmt->execute([$id]);
    $cert = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($cert) {
        // Delete database record
        $deleteStmt = $pdo->prepare("DELETE FROM certificates WHERE id = ?");
        $deleteStmt->execute([$id]);

        writeAdminLog('certificates', 'Silme', "Sertifika silindi (ID: " . $id . ")");
        echo json_encode(array("success" => true, "message" => "Sertifika başarıyla silindi."));
    } else {
        http_response_code(404);
        echo json_encode(array("success" => false, "message" => "Sertifika bulunamadı."));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()));
}
?>
