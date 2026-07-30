<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Id, X-Admin-Username, X-Admin-Token");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../db.php';

try {
    $data = json_decode(file_get_contents("php://input"));
    if(!isset($data->id)) {
        echo json_encode(["success" => false, "message" => "Eksik ID."]);
        exit;
    }

    $id = $data->id;

    // Get file path before deleting
    $stmt = $pdo->prepare("SELECT file_path FROM distributor_applications WHERE id = ?");
    $stmt->execute([$id]);
    $app = $stmt->fetch(PDO::FETCH_ASSOC);

    // Delete record
    $deleteStmt = $pdo->prepare("DELETE FROM distributor_applications WHERE id = ?");
    $deleteStmt->execute([$id]);

    // Delete file if exists
    if ($app && !empty($app['file_path'])) {
        $filePath = __DIR__ . '/../../' . $app['file_path'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    echo json_encode(["success" => true, "message" => "Başvuru başarıyla silindi."]);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
