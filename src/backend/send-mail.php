<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['name']) || !isset($input['surname']) || !isset($input['email']) || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Lütfen tüm alanları doldurun.']);
    exit();
}

$name = htmlspecialchars($input['name']);
$surname = htmlspecialchars($input['surname']);
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars($input['message']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Geçersiz email adresi.']);
    exit();
}

$to = 'ahmedbozkurt959@gmail.com';
$subject = "Yeni İletişim Formu Mesajı: $name $surname";
$body = "
<html>
<head>
    <title>Yeni Mesaj</title>
</head>
<body>
    <h2>İletişim Formu Detayları</h2>
    <p><strong>Ad:</strong> $name</p>
    <p><strong>Soyad:</strong> $surname</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Mesaj:</strong><br/>" . nl2br($message) . "</p>
</body>
</html>
";

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: <$email>" . "\r\n";

if (mail($to, $subject, $body, $headers)) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Mesajınız başarıyla gönderildi.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mesaj gönderilirken bir hata oluştu.']);
}
?>
