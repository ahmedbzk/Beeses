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

// Fetch multipart/form-data fields
$name = $_POST['name'] ?? '';
$description = $_POST['description'] ?? '';
$name_en = $_POST['name_en'] ?? '';
$description_en = $_POST['description_en'] ?? '';
$icon = $_POST['icon'] ?? 'award';

if (empty($name)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Sertifika adı zorunludur."]);
    exit;
}

try {
    $insert = "INSERT INTO certificates (name, description, name_en, description_en, icon) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($insert);
    $stmt->execute([$name, $description, $name_en, $description_en, $icon]);
    
    http_response_code(201);
        writeAdminLog('certificates', 'Ekleme', "Sertifika eklendi: " . $name);
    echo json_encode(["success" => true, "message" => "Sertifika başarıyla eklendi.", "id" => $pdo->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
