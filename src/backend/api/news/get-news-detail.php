<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../db.php';

$id = $_GET['id'] ?? '';

if (empty($id)) {
    echo json_encode(["success" => false, "message" => "Haber kimliği (ID) belirtilmelidir."]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT *, DATE_FORMAT(news_date, '%d.%m.%Y %H:%i') as formatted_date FROM news WHERE id = ?");
    $stmt->execute([$id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($item) {
        if (!empty($item['sections'])) {
            $item['sections'] = json_decode($item['sections'], true);
        } else {
            $item['sections'] = [];
        }
        echo json_encode(["success" => true, "data" => $item]);
    } else {
        echo json_encode(["success" => false, "message" => "Haber bulunamadı."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
