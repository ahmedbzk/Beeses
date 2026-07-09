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

// Serve the raw PDF bytes directly to the browser
header('Content-Type: application/pdf');
header('Content-Disposition: inline; filename="' . basename($filePath) . '"');
header('Content-Transfer-Encoding: binary');
header('Accept-Ranges: bytes');
header('Content-Length: ' . filesize($filePath));
readfile($filePath);
exit;

