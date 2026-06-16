<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}



// Get admin ID from request header
$adminId = $_SERVER['HTTP_X_ADMIN_ID'] ?? null;

if (empty($adminId) || $adminId === 'undefined') {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Oturum geçersiz. Lütfen tekrar giriş yapın."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    $data = $_POST;
}

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Kullanıcı adı boş bırakılamaz."]);
    exit();
}

try {
    // Check if username is already taken by another admin
    $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = ? AND id != ?");
    $stmtCheck->execute([$username, $adminId]);
    if ($stmtCheck->fetchColumn() > 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Bu kullanıcı adı zaten alınmış."]);
        exit();
    }

    if (!empty($password)) {
        $hashed_password = md5($password);
        $stmt = $pdo->prepare("UPDATE admins SET username = ?, password = ? WHERE id = ?");
        $stmt->execute([$username, $hashed_password, $adminId]);
    } else {
        $stmt = $pdo->prepare("UPDATE admins SET username = ? WHERE id = ?");
        $stmt->execute([$username, $adminId]);
    }

    // Insert log
    $logStmt = $pdo->prepare("INSERT INTO admin_logs (admin_id, username, page, action, details) VALUES (?, ?, ?, ?, ?)");
    $logStmt->execute([$adminId, $username, 'profile', 'Güncelleme', 'Profil güncellendi.']);

    echo json_encode([
        "success" => true,
        "username" => $username,
        "message" => "Profiliniz başarıyla güncellendi."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Veritabanı hatası: " . $e->getMessage()
    ]);
}
?>
