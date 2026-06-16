<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Id, X-Admin-Username, X-Admin-Token");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$isLocal = !isset($_SERVER['HTTP_HOST']) || (strpos($_SERVER['HTTP_HOST'], 'beesesaudio.com') === false);

if ($isLocal) {
    $host = 'localhost'; // Lokal XAMPP sunucusu
    $db   = 'beeses_db'; // Yerel veritabanı adı
    $user = 'root';      // XAMPP varsayılan kullanıcı adı
    $pass = '';          // XAMPP varsayılan şifresi (boş)
} else {
    // Canlı Sunucu (Production) Bilgileri
    $host = 'localhost'; 
    $db   = 'u2736754_dbee';    // Canlı veritabanı adı
    $user = 'beese_usr';     // Canlı veritabanı kullanıcısı
    $pass = '@:c=IdeO2A_7GW15';  // Canlı veritabanı şifresi
}

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
    die(json_encode(["success" => false, "message" => "Veritabanı bağlantı hatası: " . $e->getMessage()]));
}

// Centralized logging helper for admin actions
function writeAdminLog($page, $action, $details) {
    global $pdo;
    
    // Get headers
    $adminId = $_SERVER['HTTP_X_ADMIN_ID'] ?? null;
    $username = $_SERVER['HTTP_X_ADMIN_USERNAME'] ?? null;
    
    // Fallback if headers are not formatted as HTTP_X_ADMIN_ID in $_SERVER
    if (!$adminId) {
        $headers = [];
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
        } else {
            foreach ($_SERVER as $name => $value) {
                if (substr($name, 0, 5) == 'HTTP_') {
                    $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
                }
            }
        }
        
        // Normalize keys to lowercase for safe lookup
        $headers = array_change_key_case($headers, CASE_LOWER);
        $adminId = $headers['x-admin-id'] ?? null;
        $username = $headers['x-admin-username'] ?? null;
    }
    
    if (empty($adminId) || $adminId === 'undefined') {
        $adminId = 0;
    }
    if (empty($username) || $username === 'undefined') {
        $username = 'System';
    }
    
    try {
        // Ensure table exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS admin_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT NOT NULL,
            username VARCHAR(50) NOT NULL,
            page VARCHAR(50) NOT NULL,
            action VARCHAR(50) NOT NULL,
            details TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
        
        $stmt = $pdo->prepare("INSERT INTO admin_logs (admin_id, username, page, action, details) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$adminId, $username, $page, $action, $details]);
    } catch (Exception $e) {
        error_log("writeAdminLog Error: " . $e->getMessage());
    }
}
?>

