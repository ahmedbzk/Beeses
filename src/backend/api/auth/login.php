<?php
require_once '../db.php';
require_once '../auth_helper.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
    echo json_encode(["success" => false, "message" => "Kullanıcı adı ve şifre gereklidir.", "message_en" => "Username and password are required."]);
    exit;
}

$stmt = $pdo->prepare("SELECT id, username, password, role, permissions FROM admins WHERE username = ?");
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !verifyAdminPassword($password, $admin['password'])) {
    echo json_encode(["success" => false, "message" => "Hatalı kullanıcı adı veya şifre.", "message_en" => "Incorrect username or password."]);
    exit;
}

// Eski MD5 şifreyi ilk başarılı girişte güvenli hash'e yükselt (kullanıcı için hiçbir şey değişmez)
if (preg_match('/^[a-f0-9]{32}$/i', $admin['password']) && adminPasswordColumnFits()) {
    try {
        $up = $pdo->prepare("UPDATE admins SET password = ? WHERE id = ?");
        $up->execute([hashAdminPassword($password), $admin['id']]);
    } catch (PDOException $e) {
        // Yükseltme başarısız olsa da giriş devam eder; bir sonraki girişte tekrar denenir
    }
}

$allPermissions = [
    "products"                 => ["view" => true, "edit" => true],
    "news"                     => ["view" => true, "edit" => true],
    "certificates"             => ["view" => true, "edit" => true],
    "faq"                      => ["view" => true, "edit" => true],
    "contacts"                 => ["view" => true, "edit" => true],
    "warranties"               => ["view" => true, "edit" => true],
    "distributors"             => ["view" => true, "edit" => true],
    "distributor_applications" => ["view" => true, "edit" => true],
    "innovations"              => ["view" => true, "edit" => true],
    "newsletter"               => ["view" => true, "edit" => true],
    "admins"                   => ["view" => true, "edit" => true],
];

if ($admin['role'] === 'superadmin') {
    $permissions = $allPermissions;
} else {
    $permissions = $admin['permissions'] ? json_decode($admin['permissions'], true) : [];
}

try {
    $token = issueAdminToken($pdo, (int)$admin['id']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Oturum oluşturulamadı.", "message_en" => "Session could not be created."]);
    exit;
}

echo json_encode([
    "success"     => true,
    "id"          => (int)$admin['id'],
    "token"       => $token,
    "username"    => $admin['username'],
    "role"        => $admin['role'],
    "permissions" => $permissions
]);
?>
