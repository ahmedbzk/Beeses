<?php
// mail_helper.php - SMTP Mailer using PHP sockets with timeout protection

function readSMTPResponse($socket) {
    $response = "";
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        // SMTP responses have a 3 digit code. Multi-line responses use a dash (e.g. 250-xyz).
        // The last line of the response uses a space (e.g. 250 xyz).
        if (preg_match('/^\d{3} /', $line)) {
            break;
        }
    }
    $info = stream_get_meta_data($socket);
    if ($info['timed_out']) {
        throw new Exception("SMTP bağlantı zaman aşımına uğradı (Timeout).");
    }
    if ($response === "") {
        throw new Exception("SMTP sunucusundan boş yanıt alındı veya bağlantı kesildi.");
    }
    return $response;
}

function sendMailSMTP($to, $subject, $message, $isHtml = false) {
    // Read SMTP settings from .env manually
    $envPath = __DIR__ . '/../../.env';
    if (!file_exists($envPath)) {
        $envPath = __DIR__ . '/../.env'; // fallback
    }
    if (!file_exists($envPath)) {
        $envPath = __DIR__ . '/.env'; // fallback
    }
    
    $smtpHost = 'localhost'; // Default Plesk local SMTP
    $smtpPort = 25;          // Default local port
    $smtpUser = '';
    $smtpPass = '';
    $smtpSecure = '';
    
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') !== false) {
                list($name, $value) = explode('=', $line, 2);
                $name = trim($name);
                $value = trim($value);
                if ($name === 'SMTP_HOST') $smtpHost = $value;
                if ($name === 'SMTP_PORT') $smtpPort = intval($value);
                if ($name === 'SMTP_USER') $smtpUser = $value;
                if ($name === 'SMTP_PASS') $smtpPass = $value;
                if ($name === 'SMTP_SECURE') $smtpSecure = $value;
            }
        }
    }
    
    $fromEmail = !empty($smtpUser) ? $smtpUser : "info@beesesaudio.com";
    $fromName = "Beeses Audio";
    
    // Connect to SMTP server
    $hostSpec = ($smtpSecure === 'ssl') ? 'ssl://' . $smtpHost : $smtpHost;
    $socket = @fsockopen($hostSpec, $smtpPort, $errno, $errstr, 5); // 5s connection timeout
    if (!$socket) {
        // Fallback to local port 25 without security if security failed and we tried to use secure
        if (!empty($smtpSecure)) {
            $socket = @fsockopen($smtpHost, 25, $errno, $errstr, 5);
        }
        if (!$socket) {
            throw new Exception("SMTP sunucusuna bağlanılamadı: $errstr ($errno)");
        }
    }
    
    // Set 5 seconds read timeout to prevent 2 minutes hangs on SMTP reads
    stream_set_timeout($socket, 5);
    
    try {
        $response = readSMTPResponse($socket);
        
        // EHLO / HELO
        fwrite($socket, "EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n");
        $response = readSMTPResponse($socket);
        
        // STARTTLS if secure is tls
        if ($smtpSecure === 'tls') {
            fwrite($socket, "STARTTLS\r\n");
            $response = readSMTPResponse($socket);
            if (strpos($response, '220') === 0) {
                if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                    throw new Exception("TLS el sıkışması başarısız oldu.");
                }
                // Re-send EHLO after TLS start
                fwrite($socket, "EHLO " . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n");
                $response = readSMTPResponse($socket);
            }
        }
        
        // SMTP Authentication if credentials are provided
        if (!empty($smtpUser) && !empty($smtpPass)) {
            fwrite($socket, "AUTH LOGIN\r\n");
            $response = readSMTPResponse($socket);
            
            fwrite($socket, base64_encode($smtpUser) . "\r\n");
            $response = readSMTPResponse($socket);
            
            fwrite($socket, base64_encode($smtpPass) . "\r\n");
            $response = readSMTPResponse($socket);
        }
        
        // MAIL FROM
        fwrite($socket, "MAIL FROM: <$fromEmail>\r\n");
        $response = readSMTPResponse($socket);
        
        // RCPT TO
        fwrite($socket, "RCPT TO: <$to>\r\n");
        $response = readSMTPResponse($socket);
        
        // DATA
        fwrite($socket, "DATA\r\n");
        $response = readSMTPResponse($socket);
        
        // Normalize newlines in message body to CRLF (\r\n) to prevent "bare LF" mail drops by Gmail/Yahoo
        $normalizedMessage = str_replace(["\r\n", "\r", "\n"], "\r\n", $message);

        // Formulate Headers
        $headers = "MIME-Version: 1.0\r\n";
        if ($isHtml) {
            $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        } else {
            $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        }
        $headers .= "From: =?UTF-8?B?" . base64_encode($fromName) . "?= <$fromEmail>\r\n";
        $headers .= "To: <$to>\r\n";
        $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n\r\n";
        
        // Double dots escaping in SMTP body
        $body = str_replace("\r\n.", "\r\n..", $normalizedMessage);
        
        fwrite($socket, $headers . $body . "\r\n.\r\n");
        $response = readSMTPResponse($socket);
        
        // QUIT
        fwrite($socket, "QUIT\r\n");
        fclose($socket);
        
        return true;
    } catch (Exception $e) {
        @fclose($socket);
        throw $e;
    }
}
?>
