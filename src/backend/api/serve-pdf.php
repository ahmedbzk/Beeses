<?php
$path = $_GET['path'] ?? '';
if (empty($path)) {
    die("Geçersiz dosya.");
}

if (strpos($path, 'uploads/products/') !== 0 || strpos($path, '..') !== false) {
    die("Erişim reddedildi.");
}

$filePath = __DIR__ . '/' . $path;
if (!file_exists($filePath)) {
    die("Dosya bulunamadı.");
}

$title = "Beeses Audio";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlspecialchars($title); ?></title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background-color: #323639;
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe src="/backend/api/<?php echo htmlspecialchars($path); ?>"></iframe>
</body>
</html>
