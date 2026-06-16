<?php
require_once '../db.php';
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}



$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Kullanıcı adı ve şifre gereklidir."]);
    exit;
}

// Şifreyi MD5 ile kontrol ediyoruz (Basit ve hızlı bir yöntem)
$hashed_password = md5($password);

$sql = "SELECT id, username, role, permissions FROM admins WHERE username = ? AND password = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$username, $hashed_password]);

$admin = $stmt->fetch();

if ($admin) {
    // Superadmin ise tüm yetkiler tam olarak verilir
    $allPermissions = [
        "products"     => ["view" => true, "edit" => true],
        "news"         => ["view" => true, "edit" => true],
        "certificates" => ["view" => true, "edit" => true],
        "faq"          => ["view" => true, "edit" => true],
        "contacts"     => ["view" => true, "edit" => true],
        "warranties"   => ["view" => true, "edit" => true],
        "distributors" => ["view" => true, "edit" => true],
        "innovations"  => ["view" => true, "edit" => true],
        "newsletter"   => ["view" => true, "edit" => true],
        "admins"       => ["view" => true, "edit" => true],
    ];

    if ($admin['role'] === 'superadmin') {
        $permissions = $allPermissions;
    } else {
        $permissions = $admin['permissions'] ? json_decode($admin['permissions'], true) : [];
    }

    echo json_encode([
        "success"     => true,
        "id"          => (int)$admin['id'],
        "token"       => "fake-jwt-token-for-frontend-" . time(),
        "username"    => $admin['username'],
        "role"        => $admin['role'],
        "permissions" => $permissions
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Hatalı kullanıcı adı veya şifre."]);
}
?>
