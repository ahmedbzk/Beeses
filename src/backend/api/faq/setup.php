<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

require_once '../db.php';

try {
    // Create faqs table
    $pdo->exec("CREATE TABLE IF NOT EXISTS faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    // Seed faqs table if empty
    $stmtFaq = $pdo->query("SELECT COUNT(*) FROM faqs");
    $faqCount = $stmtFaq->fetchColumn();
    $faqSeeded = false;

    if ($faqCount == 0) {
        $faqs = [
            [
                'question' => 'Beeses nedir?',
                'answer' => 'Beeses, yüksek kaliteli ve yenilikçi amfi üretimi yapan bir Türk markasıdır. Hem profesyonel müzisyenler hem de amatör kullanıcılar için tasarlanan ürünlerimiz, üstün ses kalitesi ve dayanıklılık sunar.'
            ],
            [
                'question' => 'Beeses amfileri hangi tür müzikler için uygundur?',
                'answer' => 'Beeses amfileri, rock, jazz, blues, metal ve akustik gibi çeşitli müzik türleri için mükemmel performans sağlar. Farklı modellerimiz, farklı ses ihtiyaçlarını karşılamak üzere tasarlanmıştır.'
            ],
            [
                'question' => 'Ürünlerinizi nereden satın alabilirim?',
                'answer' => 'Beeses ürünlerini resmi web sitemizden veya yetkili satış noktalarımızdan satın alabilirsiniz. Web sitemizdeki “Satış Noktaları” bölümünden size en yakın mağazayı bulabilirsiniz.'
            ],
            [
                'question' => 'Amfilerinizin garanti süresi nedir?',
                'answer' => 'Beeses amfilerimiz 2 yıl üretici garantisi ile sunulmaktadır. Garanti kapsamında ürünlerimizdeki üretim hataları ücretsiz olarak tamir edilir veya değiştirilir.'
            ],
            [
                'question' => 'Teknik destek alabilir miyim?',
                'answer' => 'Evet, Beeses teknik destek ekibi, ürünlerinizle ilgili her türlü soru ve sorun için hizmetinizdedir. Teknik destek almak için web sitemizdeki “Destek” bölümünü ziyaret edebilir veya e-posta yoluyla bize ulaşabilirsiniz.'
            ],
            [
                'question' => 'Amfileriniz özelleştirilebilir mi?',
                'answer' => 'Bazı Beeses modelleri, kullanıcıların ihtiyaçlarına göre özelleştirilebilir. Özel tasarım talepleriniz için bizimle iletişime geçebilirsiniz.'
            ],
            [
                'question' => 'Kurulum hizmeti sunuyor musunuz?',
                'answer' => 'Profesyonel ses sistemleri projeleriniz için keşif ve kurulum hizmeti sağlamaktayız. Detaylı bilgi için teknik ekibimizle iletişime geçebilirsiniz.'
            ],
            [
                'question' => 'Uluslararası gönderim yapıyor musunuz?',
                'answer' => 'Evet, dünyanın birçok noktasına güvenli kargo seçeneklerimizle ürün gönderimi sağlamaktayız. Kargo ücretleri bölgeye göre değişiklik göstermektedir.'
            ],
            [
                'question' => 'İade ve değişim şartlarınız nelerdir?',
                'answer' => 'Satın aldığınız ürünleri, kullanılmamış ve ambalajı bozulmamış olması şartıyla 14 gün içerisinde iade edebilir veya değiştirebilirsiniz.'
            ],
            [
                'question' => 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
                'answer' => 'Kredi kartı, banka havalesi, EFT ve güvenli online ödeme sistemlerini kabul ediyoruz. Ayrıca yetkili satıcılarımızda elden taksit imkanları da bulunabilmektedir.'
            ]
        ];

        $insertFaq = $pdo->prepare("INSERT INTO faqs (question, answer) VALUES (?, ?)");
        foreach ($faqs as $faq) {
            $insertFaq->execute([$faq['question'], $faq['answer']]);
        }
        $faqSeeded = true;
    }

    echo json_encode([
        "success" => true,
        "message" => "Faqs tablosu basariyla kontrol edildi ve olusturuldu.",
        "seeded" => $faqSeeded
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Veritabani kurulum hatasi: " . $e->getMessage()
    ]);
}
?>
