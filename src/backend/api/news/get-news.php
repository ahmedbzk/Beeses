<?php
require_once '../db.php';
header("Content-Type: application/json; charset=UTF-8");



// Ensure title_en, summary_en, sections_en, video_url columns exist in news table
try {
    $columns = $pdo->query("SHOW COLUMNS FROM news")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('title_en', $columns)) {
        $pdo->exec("ALTER TABLE news ADD COLUMN title_en VARCHAR(255) DEFAULT NULL AFTER title");
    }
    if (!in_array('summary_en', $columns)) {
        $pdo->exec("ALTER TABLE news ADD COLUMN summary_en TEXT DEFAULT NULL AFTER summary");
    }
    if (!in_array('sections_en', $columns)) {
        $pdo->exec("ALTER TABLE news ADD COLUMN sections_en TEXT DEFAULT NULL AFTER sections");
    }
    if (!in_array('video_url', $columns)) {
        $pdo->exec("ALTER TABLE news ADD COLUMN video_url VARCHAR(500) DEFAULT NULL AFTER image");
    }
} catch (Exception $e) {
    // Ignore if table doesn't exist yet
}

try {
    $stmt = $pdo->query("SELECT *, DATE_FORMAT(news_date, '%d.%m.%Y %H:%i') as formatted_date FROM news ORDER BY news_date DESC, id DESC");
    $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Decode sections and sections_en JSON
    foreach ($news as &$item) {
        if (!empty($item['sections'])) {
            $item['sections'] = json_decode($item['sections'], true);
        } else {
            $item['sections'] = [];
        }

        if (!empty($item['sections_en'])) {
            $item['sections_en'] = json_decode($item['sections_en'], true);
        } else {
            $item['sections_en'] = [];
        }
    }
    unset($item);

    echo json_encode(["success" => true, "data" => $news]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Hata: " . $e->getMessage()]);
}
?>
