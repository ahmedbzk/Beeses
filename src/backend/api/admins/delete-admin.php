<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}



$id = $_GET['id'] ?? null;

if (empty($id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Yönetici kimliği (id) gereklidir."]);
    exit();
}

try {
    // Check if the user to delete is a superadmin or default admin (extra security)
    $stmtCheck = $pdo->prepare("SELECT role, username FROM admins WHERE id = ?");
    $stmtCheck->execute([$id]);
    $admin = $stmtCheck->fetch();

    if (!$admin) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Yönetici bulunamadı."]);
        exit();
    }

    if ($admin['role'] === 'superadmin' || $admin['username'] === 'admin') {
        http_response_code(403);
        echo json_encode(["success" => false, "message" => "Süper yönetici (superadmin) veya ana yönetici silinemez."]);
        exit();
    }

    $query = "DELETE FROM admins WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$id]);

        writeAdminLog('admins', 'Silme', "Yönetici silindi: " . $admin['username']);
    echo json_encode([
        "success" => true,
        "message" => "Yönetici başarıyla silindi."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Veritabanı hatası: " . $e->getMessage()
    ]);
}
?>
