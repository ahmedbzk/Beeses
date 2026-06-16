<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}



try {
    // Select all administrators
    $stmt = $pdo->query("SELECT id, username, role, permissions, created_at FROM admins ORDER BY id ASC");
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode permissions JSON string back to PHP array/object so it goes as JSON to the frontend
    foreach ($admins as &$admin) {
        $admin['permissions'] = $admin['permissions'] ? json_decode($admin['permissions'], true) : new stdClass();
    }

    echo json_encode([
        "success" => true,
        "data" => $admins
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Veritabanı hatası: " . $e->getMessage()
    ]);
}
?>
