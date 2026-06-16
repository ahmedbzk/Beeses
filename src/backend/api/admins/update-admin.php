<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}



// Get JSON post data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    $data = $_POST;
}

$id = $data['id'] ?? null;
$username = $data['username'] ?? '';
$role = $data['role'] ?? 'admin';
$permissions = $data['permissions'] ?? null;
$password = $data['password'] ?? '';

if (empty($id) || empty($username)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Yönetici kimliği (id) ve kullanıcı adı zorunludur."]);
    exit();
}

try {
    // Check if username is already taken by another user
    $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = ? AND id != ?");
    $stmtCheck->execute([$username, $id]);
    if ($stmtCheck->fetchColumn() > 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Bu kullanıcı adı başka bir yönetici tarafından kullanılıyor."]);
        exit();
    }

    $permissions_json = $permissions ? json_encode($permissions) : null;

    if (!empty($password)) {
        // Hashed password
        $hashed_password = md5($password);
        $query = "UPDATE admins SET username = ?, password = ?, role = ?, permissions = ? WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$username, $hashed_password, $role, $permissions_json, $id]);
    } else {
        $query = "UPDATE admins SET username = ?, role = ?, permissions = ? WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$username, $role, $permissions_json, $id]);
    }

        writeAdminLog('admins', 'Güncelleme', "Yönetici güncellendi: " . $username . " (Rol: " . $role . ")");
    echo json_encode([
        "success" => true,
        "message" => "Yönetici başarıyla güncellendi."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Veritabanı hatası: " . $e->getMessage()
    ]);
}
?>
