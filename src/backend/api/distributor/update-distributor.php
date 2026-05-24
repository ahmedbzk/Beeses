<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../db.php';

$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    $data = $_POST;
}

$id = $data['id'] ?? '';
$country = $data['country'] ?? '';
$representative = $data['representative'] ?? '';
$company_name = $data['company_name'] ?? '';
$address = $data['address'] ?? '';
$phone = $data['phone'] ?? '';
$email = $data['email'] ?? '';
$website = $data['website'] ?? '';
$instagram = $data['instagram'] ?? '';
$facebook = $data['facebook'] ?? '';
$youtube = $data['youtube'] ?? '';

if (empty($id) || empty($country) || empty($company_name)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Kimlik (id), Ülke ve Şirket Adı zorunludur."));
    exit();
}

try {
    $query = "UPDATE distributors 
              SET country = ?, representative = ?, company_name = ?, address = ?, phone = ?, email = ?, website = ?, instagram = ?, facebook = ?, youtube = ?
              WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        $country,
        $representative,
        $company_name,
        $address,
        $phone,
        $email,
        $website,
        $instagram,
        $facebook,
        $youtube,
        $id
    ]);

    http_response_code(200);
    echo json_encode(array("success" => true, "message" => "Distribütör başarıyla güncellendi."));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()));
}
?>
