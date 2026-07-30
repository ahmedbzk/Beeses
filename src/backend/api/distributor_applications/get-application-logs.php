<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Id, X-Admin-Username, X-Admin-Token");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../db.php';

try {
    if(!isset($_GET['id'])) {
        echo json_encode(["success" => false, "message" => "Eksik ID."]);
        exit;
    }

    $id = (int)$_GET['id'];
    
    // JSON details içinde application_id'si eşleşen logları getir
    $sql = "SELECT id, admin_id, username, action, details, created_at 
            FROM admin_logs 
            WHERE page = 'distributor_applications' 
            AND details LIKE :search 
            ORDER BY created_at DESC";
            
    $stmt = $pdo->prepare($sql);
    $search = '%"application_id":' . $id . '%';
    $stmt->execute(['search' => $search]);
    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Format logs
    $formattedLogs = [];
    foreach ($logs as $log) {
        $details = json_decode($log['details'], true);
        if ($details && isset($details['application_id']) && (int)$details['application_id'] === $id) {
            $formattedLogs[] = [
                'id' => $log['id'],
                'username' => $log['username'],
                'action' => $log['action'],
                'new_status' => $details['new_status'] ?? '',
                'created_at' => $log['created_at']
            ];
        }
    }

    echo json_encode([
        "success" => true,
        "data" => $formattedLogs
    ]);
} catch(PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Hata: " . $e->getMessage()
    ]);
}
?>
