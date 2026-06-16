<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}



$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || !filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Geçerli bir e-posta adresi giriniz."]);
    exit();
}

try {
    // Daha önce abone olmuş mu kontrol et
    $checkStmt = $pdo->prepare("SELECT id, is_active FROM newsletter_subscribers WHERE email = :email");
    $checkStmt->execute([':email' => $data->email]);
    $existing = $checkStmt->fetch();

    if ($existing) {
        if ($existing['is_active']) {
            echo json_encode(["success" => false, "message" => "Bu e-posta adresi zaten abone listesinde."]);
        } else {
            // Tekrar aktif et
            $reactivate = $pdo->prepare("UPDATE newsletter_subscribers SET is_active = 1, subscribed_at = NOW() WHERE email = :email");
            $reactivate->execute([':email' => $data->email]);
            echo json_encode(["success" => true, "message" => "Aboneliğiniz yeniden etkinleştirildi."]);
        }
        exit();
    }

    $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (:email, NOW())");
    $stmt->execute([':email' => $data->email]);

    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Bülten aboneliğiniz başarıyla oluşturuldu."]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
