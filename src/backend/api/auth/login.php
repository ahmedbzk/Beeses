<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Kullanıcı adı ve şifre gereklidir."]);
    exit;
}

// Şifreyi MD5 ile kontrol ediyoruz (Basit ve hızlı bir yöntem)
$hashed_password = md5($password);

$sql = "SELECT id, username FROM admins WHERE username = ? AND password = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$username, $hashed_password]);

$admin = $stmt->fetch();

if ($admin) {
    // Gerçek bir sistemde JWT Token verilir, burada basitlik için success dönüyoruz.
    echo json_encode([
        "success" => true, 
        "token" => "fake-jwt-token-for-frontend-" . time(),
        "username" => $admin['username']
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Hatalı kullanıcı adı veya şifre."]);
}
?>
