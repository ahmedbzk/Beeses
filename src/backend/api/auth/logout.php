<?php
require_once '../db.php';
require_once '../auth_helper.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Çıkışta token sunucuda da geçersiz kılınır (token geçersiz olsa bile çıkış başarılı sayılır)
try {
    revokeAdminToken($pdo, getAdminTokenFromRequest());
} catch (Throwable $e) {
}

echo json_encode(["success" => true]);
?>
