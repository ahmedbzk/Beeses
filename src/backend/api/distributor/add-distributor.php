<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get JSON post data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    // Fallback to $_POST if not JSON
    $data = $_POST;
}

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

if (empty($country) || empty($company_name)) {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Ülke ve Şirket Adı zorunludur."));
    exit();
}

try {
    $query = "INSERT INTO distributors (country, representative, company_name, address, phone, email, website, instagram, facebook, youtube) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        $youtube
    ]);

    http_response_code(201);
    $newId = $pdo->lastInsertId();
    writeAdminLog('distributors', 'Ekleme', "Distribütör eklendi: " . $company_name);
    echo json_encode(array("success" => true, "message" => "Distribütör başarıyla eklendi.", "id" => $newId));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()));
}
?>
