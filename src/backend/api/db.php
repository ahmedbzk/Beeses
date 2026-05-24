<?php
// db.php - Veritabanı Bağlantı Dosyası
$host = 'localhost'; // Lokal çalışırken localhost, cPanel'de genelde localhost kalır
$db   = 'beeses_db'; // XAMPP'ta oluşturacağımız veritabanı adı
$user = 'root';      // XAMPP varsayılan kullanıcı adı
$pass = '';          // XAMPP varsayılan şifresi (boş)
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Hataları göster
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Verileri dizi olarak getir
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Gerçek ortamda hatayı ekrana basmak yerine loglamak daha güvenlidir.
    die(json_encode(["success" => false, "message" => "Veritabanı bağlantı hatası: " . $e->getMessage()]));
}
?>
