<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once '../db.php';

try {
    $stmt = $pdo->query("SELECT *, DATE_FORMAT(news_date, '%d.%m.%Y %H:%i') as formatted_date FROM news ORDER BY news_date DESC, id DESC");
    $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "data" => $news]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
