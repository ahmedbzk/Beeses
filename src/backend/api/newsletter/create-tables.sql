-- ============================================================
--  Beeses Audio - Bülten (Newsletter) Veritabanı Tabloları
--  Oluşturma Tarihi: 2026
-- ============================================================

-- Abone tablosu
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id`            INT(11) NOT NULL AUTO_INCREMENT,
  `email`         VARCHAR(255) NOT NULL UNIQUE,
  `is_active`     TINYINT(1) NOT NULL DEFAULT 1,
  `subscribed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gönderim geçmişi tablosu
CREATE TABLE IF NOT EXISTS `newsletter_logs` (
  `id`               INT(11) NOT NULL AUTO_INCREMENT,
  `subject`          VARCHAR(500) NOT NULL,
  `body`             TEXT NOT NULL,
  `recipients_count` INT(11) NOT NULL DEFAULT 0,
  `sent_count`       INT(11) NOT NULL DEFAULT 0,
  `failed_count`     INT(11) NOT NULL DEFAULT 0,
  `sent_at`          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
