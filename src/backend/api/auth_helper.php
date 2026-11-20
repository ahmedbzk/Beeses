<?php
/**
 * Admin oturum doğrulaması.
 *
 * Giriş (auth/login.php) rastgele bir token üretir; veritabanında token'ın kendisi değil SHA-256 özeti tutulur.
 * Panel her istekte token'ı "X-Admin-Token" başlığıyla gönderir (admin-auth.interceptor.ts).
 *
 * Kullanım (db.php'den sonra):
 *   requireAdmin();            // yalnızca geçerli oturum (listeleme/okuma uç noktaları)
 *   requireAdmin('products');  // oturum + ilgili sayfada düzenleme yetkisi (ekle/güncelle/sil)
 *
 * admin_sessions tablosu ilk kullanımda otomatik oluşturulur; canlı sunucuda elle SQL çalıştırmaya gerek yoktur.
 */

require_once __DIR__ . '/db.php';

const ADMIN_SESSION_TTL_DAYS = 7;

function ensureAdminSessionsTable(PDO $pdo): void
{
    static $done = false;
    if ($done) return;
    $pdo->exec("CREATE TABLE IF NOT EXISTS admin_sessions (
        token_hash CHAR(64) NOT NULL PRIMARY KEY,
        admin_id INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        INDEX idx_admin_sessions_admin (admin_id),
        INDEX idx_admin_sessions_expires (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $done = true;
}

/** Giriş başarılı olduğunda çağrılır; istemciye verilecek düz token'ı döner. */
function issueAdminToken(PDO $pdo, int $adminId): string
{
    ensureAdminSessionsTable($pdo);
    $pdo->exec("DELETE FROM admin_sessions WHERE expires_at < NOW()");

    $token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("INSERT INTO admin_sessions (token_hash, admin_id, expires_at)
                           VALUES (?, ?, DATE_ADD(NOW(), INTERVAL " . ADMIN_SESSION_TTL_DAYS . " DAY))");
    $stmt->execute([hash('sha256', $token), $adminId]);
    return $token;
}

function revokeAdminToken(PDO $pdo, string $token): void
{
    if ($token === '') return;
    ensureAdminSessionsTable($pdo);
    $stmt = $pdo->prepare("DELETE FROM admin_sessions WHERE token_hash = ?");
    $stmt->execute([hash('sha256', $token)]);
}

function getAdminTokenFromRequest(): string
{
    $token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
    if ($token === '' && function_exists('getallheaders')) {
        $headers = array_change_key_case(getallheaders(), CASE_LOWER);
        $token = $headers['x-admin-token'] ?? '';
    }
    return trim((string)$token);
}

function adminAuthFail(int $status, string $messageTr, string $messageEn): void
{
    http_response_code($status);
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(["success" => false, "message" => $messageTr, "message_en" => $messageEn]);
    exit;
}

/**
 * Geçerli bir admin oturumu yoksa 401, yetki yoksa 403 döner ve betiği sonlandırır.
 * Başarılı olursa admin kaydını (id, username, role, permissions) döner.
 *
 * @param string|null $editPage Düzenleme yetkisi gereken sayfa anahtarı (admins.permissions JSON'undaki anahtar).
 */
function requireAdmin(?string $editPage = null): array
{
    global $pdo;

    $token = getAdminTokenFromRequest();
    if ($token === '' || !preg_match('/^[a-f0-9]{64}$/', $token)) {
        adminAuthFail(401, "Oturum geçersiz. Lütfen tekrar giriş yapın.", "Invalid session. Please log in again.");
    }

    try {
        ensureAdminSessionsTable($pdo);
        $stmt = $pdo->prepare("SELECT a.id, a.username, a.role, a.permissions
                               FROM admin_sessions s
                               JOIN admins a ON a.id = s.admin_id
                               WHERE s.token_hash = ? AND s.expires_at > NOW()");
        $stmt->execute([hash('sha256', $token)]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        adminAuthFail(500, "Oturum doğrulanamadı.", "Session could not be verified.");
    }

    if (!$admin) {
        adminAuthFail(401, "Oturum süreniz doldu. Lütfen tekrar giriş yapın.", "Your session has expired. Please log in again.");
    }

    if ($editPage !== null && $admin['role'] !== 'superadmin') {
        $perms = json_decode($admin['permissions'] ?? '', true);
        if (!is_array($perms) || empty($perms[$editPage]['edit'])) {
            adminAuthFail(403, "Bu işlem için yetkiniz yok.", "You are not authorized to perform this action.");
        }
    }

    // writeAdminLog() ve eski kodlar kimliği bu başlıklardan okuyor; istemcinin gönderdiği (taklit edilebilir)
    // değerler yerine doğrulanmış oturumun bilgilerini yaz.
    $_SERVER['HTTP_X_ADMIN_ID'] = (string)$admin['id'];
    $_SERVER['HTTP_X_ADMIN_USERNAME'] = $admin['username'];

    return $admin;
}

/** Şifre doğrulama: yeni kayıtlar password_hash, eski kayıtlar MD5 (girişte otomatik yükseltilir). */
function verifyAdminPassword(string $password, string $storedHash): bool
{
    if (preg_match('/^[a-f0-9]{32}$/i', $storedHash)) {
        return hash_equals(strtolower($storedHash), md5($password));
    }
    return password_verify($password, $storedHash);
}

/**
 * admins.password sütunu güvenli hash'i (60+ karakter) sığdırabiliyor mu?
 * Eski kurulumlarda sütun MD5 için VARCHAR(32) olabilir; bu durumda genişletmeyi dener.
 * Genişletilemezse false döner ve MD5'e devam edilir — böylece hash kesilip admin kilitlenmez.
 */
function adminPasswordColumnFits(): bool
{
    static $fits = null;
    if ($fits !== null) return $fits;
    global $pdo;

    $readLength = function () use ($pdo): int {
        $row = $pdo->query("SHOW COLUMNS FROM admins LIKE 'password'")->fetch(PDO::FETCH_ASSOC);
        if (!$row) return 0;
        if (preg_match('/char\((\d+)\)/i', $row['Type'], $m)) return (int)$m[1];
        return preg_match('/text/i', $row['Type']) ? 65535 : 0;
    };

    try {
        if ($readLength() < 255) {
            $pdo->exec("ALTER TABLE admins MODIFY COLUMN password VARCHAR(255) NOT NULL");
        }
        $fits = $readLength() >= 60;
    } catch (Throwable $e) {
        $fits = false;
    }
    return $fits;
}

function hashAdminPassword(string $password): string
{
    return adminPasswordColumnFits() ? password_hash($password, PASSWORD_DEFAULT) : md5($password);
}
