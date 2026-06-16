<?php
require_once '../db.php';
// submit-warranty.php - Garanti formunu ve faturayı kaydetme
// Angular'dan gelen isteklere izin ver (CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0); // Preflight isteklerini hızlıca geç
}



// Form verilerini al
$product_name = $_POST['product_name'] ?? '';
$serial_number = $_POST['serial_number'] ?? '';
$country = $_POST['country'] ?? '';
$full_name = $_POST['full_name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';

// Klasör yoksa oluştur (Faturaları kaydedeceğimiz yer)
// ../uploads/invoices/ yapmalıyız çünkü şu an warranty klasöründeyiz
$upload_dir = '../uploads/invoices/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$invoice_path = '';

// Dosya yükleme işlemi (Fatura resmi)
if (isset($_FILES['invoice_image']) && $_FILES['invoice_image']['error'] == UPLOAD_ERR_OK) {
    $file_tmp_path = $_FILES['invoice_image']['tmp_name'];
    $file_name = $_FILES['invoice_image']['name'];
    
    $unique_file_name = time() . '_' . uniqid() . '_' . basename($file_name);
    $dest_path = $upload_dir . $unique_file_name;

    if (move_uploaded_file($file_tmp_path, $dest_path)) {
        // Veritabanına kaydedilecek yol
        $invoice_path = 'uploads/invoices/' . $unique_file_name; 
    } else {
        echo json_encode(["success" => false, "message" => "Dosya yüklenirken bir hata oluştu."]);
        exit;
    }
}

// Veritabanına kaydetme
$sql = "INSERT INTO warranties (product_name, serial_number, country, full_name, email, phone, invoice_path, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')";

$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([
        $product_name, 
        $serial_number, 
        $country, 
        $full_name, 
        $email, 
        $phone, 
        $invoice_path
    ]);
    
    echo json_encode(["success" => true, "message" => "Garanti kaydınız başarıyla alındı ve onay bekliyor."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Veritabanı hatası: " . $e->getMessage()]);
}
?>
