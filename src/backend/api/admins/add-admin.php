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

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'admin';
$permissions = $data['permissions'] ?? null;

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Kullanıcı adı ve şifre zorunludur."]);
    exit();
}

// Check if username already exists
try {
    $stmtCheck = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = ?");
    $stmtCheck->execute([$username]);
    if ($stmtCheck->fetchColumn() > 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Bu kullanıcı adı zaten alınmış."]);
        exit();
    }

    // Hash password with MD5 (matching the login check)
    $hashed_password = md5($password);
    
    // Encode permissions to JSON string for database storage
    $permissions_json = $permissions ? json_encode($permissions) : null;

    $query = "INSERT INTO admins (username, password, role, permissions) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$username, $hashed_password, $role, $permissions_json]);

    http_response_code(201);
    $newId = $pdo->lastInsertId();
    writeAdminLog('admins', 'Ekleme', "Yeni yönetici eklendi: " . $username . " (Rol: " . $role . ")");
    echo json_encode([
        "success" => true,
        "message" => "Yönetici başarıyla eklendi.",
        "id" => $newId
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Veritabanı hatası: " . $e->getMessage()
    ]);
}
?>
