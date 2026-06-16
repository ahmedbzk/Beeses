<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



// Ensure name_en and description_en columns exist in certificates table
try {
    $columns = $pdo->query("SHOW COLUMNS FROM certificates")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('name_en', $columns)) {
        $pdo->exec("ALTER TABLE certificates ADD COLUMN name_en VARCHAR(255) DEFAULT NULL AFTER name");
    }
    if (!in_array('description_en', $columns)) {
        $pdo->exec("ALTER TABLE certificates ADD COLUMN description_en TEXT DEFAULT NULL AFTER description");
    }
} catch (Exception $e) {
    // Ignore if table doesn't exist yet
}

$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$name_en = $_POST['name_en'] ?? '';
$description_en = $_POST['description_en'] ?? '';
$icon = $_POST['icon'] ?? 'award';

if (empty($id) || empty($name)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Kimlik (id) ve sertifika adı zorunludur."]);
    exit;
}

try {
    // Check if exists
    $stmt = $pdo->prepare("SELECT id FROM certificates WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Sertifika bulunamadı."]);
        exit;
    }

    // Update DB
    $query = "UPDATE certificates SET name = ?, description = ?, name_en = ?, description_en = ?, icon = ? WHERE id = ?";
    $updateStmt = $pdo->prepare($query);
    $updateStmt->execute([$name, $description, $name_en, $description_en, $icon, $id]);

        writeAdminLog('certificates', 'Güncelleme', "Sertifika güncellendi: " . $name);
    echo json_encode(["success" => true, "message" => "Sertifika başarıyla güncellendi."]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
