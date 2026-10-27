<?php
$path = $_GET['path'] ?? '';
if (empty($path)) {
    http_response_code(400);
    die("Geçersiz dosya.");
}

if (strpos($path, 'uploads/products/') !== 0 || strpos($path, '..') !== false) {
    http_response_code(403);
    die("Erişim reddedildi.");
}

$filePath = __DIR__ . '/' . $path;
if (!file_exists($filePath)) {
    // Silinmiş kılavuzlar Google'a "bulunamadı" olarak bildirilsin (200 yerine 404)
    http_response_code(404);
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

