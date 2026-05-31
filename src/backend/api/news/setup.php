<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

require_once '../db.php';

try {
    // Recreate the news table
    $pdo->exec("DROP TABLE IF EXISTS news");
    $pdo->exec("CREATE TABLE news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        summary TEXT NOT NULL,
        content TEXT DEFAULT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'Duyuru',
        image VARCHAR(255) DEFAULT '',
        sections TEXT DEFAULT NULL,
        news_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");

    $news = [
        [
            'title' => 'Beeses Audio Yeni SQL Amplifikatör Serisini Duyurdu',
            'summary' => 'Beeses Audio, araç içi ses deneyimini zirveye taşıyan yeni nesil Class-AB SQL serisi amfilerini piyasaya sürdü. Yüksek çözünürlüklü ses performansı ve dayanıklı gövde tasarımı ile dikkat çeken seride SQL-4400 ve SQL-4200 modelleri yer alıyor.',
            'content' => '',
            'category' => 'Duyuru',
            'image' => 'assets/products/SQL 4400 Serisi-1.png',
            'sections' => json_encode([
                [
                    'title' => 'Mükemmel Sesin Peşinde: Yeni Class-AB Serisi',
                    'text' => "Beeses Audio olarak, ses dünyasında standartları yeniden belirleyen yeni Class-AB SQL Serisi amplifikatörlerimizi sunmaktan gurur duyuyoruz. Bu seri, temiz, güçlü ve yorulmayan bir dinleme deneyimi sunmak üzere Türkiye'de titizlikle tasarlanmıştır.",
                    'image' => 'assets/backgrounds/bg1.jpg'
                ],
                [
                    'title' => 'Üstün Güç Elemanları ve Cosmo Toroidal Trafo',
                    'text' => "SQL-4400, 4x464 watt (2 ohm) gücü ve ultra düşük distorsiyon oranları (%0.033 THD+N) ile yüksek güç gereksinimi duyan kullanıcılar için geliştirildi. Cosmo toroidal trafolar ve Infineon mosfet çıkış katları ile donatılan amfilerimiz, kararlı ve kayıpsız bir enerji aktarımı sağlar.",
                    'image' => 'assets/backgrounds/bg2.jpg'
                ],
                [
                    'title' => 'CNC Kesim Alüminyum Gövde ve Gelişmiş Soğutma',
                    'text' => "Yeni nesil soğutma blokları ve şık CNC kesim alüminyum gövdesi ile aracınızda minimum yer kaplayacak şekilde tasarlanmıştır. Altın kaplamalı RCA girişleri ve yüksek kaliteli hoparlör terminalleri, sinyal kaybını tamamen ortadan kaldırır. Beeses Audio distribütörleri üzerinden şimdi satın alabilirsiniz.",
                    'image' => 'assets/backgrounds/bg3.jpg'
                ]
            ])
        ],
        [
            'title' => 'Yerli Üretim Gücü: Petek Serisi Fabrikamızda',
            'summary' => 'T.C. Sanayi ve Teknoloji Bakanlığı onaylı Yerli Üretim Belgesi ile üretilen Petek serisi amfilerimiz, Hi-Res ses kalitesini kompakt boyutlarda sunarak yerli mühendisliğin gururu oluyor.',
            'content' => '',
            'category' => 'Haber',
            'image' => 'assets/products/Petek Stereo.png',
            'sections' => json_encode([
                [
                    'title' => 'Yerli Mühendislik ve Kompakt Tasarım Esnekliği',
                    'text' => "Beeses Audio Petek Serisi amplifikatörler, tamamen yerli tasarım ve üretim süreçleri ile üretilmektedir. Kompakt yapısı sayesinde koltuk altı veya bagaj içi yan bölmeler gibi dar alanlarda kolayca konumlandırılabilen Petek Serisi, Hi-Res Audio standartlarında ses üretimi sunar.",
                    'image' => 'assets/backgrounds/bg4.jpg'
                ],
                [
                    'title' => 'İzole Preamfi ve Altın Kaplama PCB Teknolojisi',
                    'text' => "İzole preamfi yapısı, besleme katından gelebilecek manyetik parazitleri sönümler ve sessiz bir arka plan sağlar. Altın kaplama PCB yolları ise oksitlenmeyi engelleyerek ses iletim kalitesini uzun yıllar boyunca korur. Yerli üretimin gücünü aracınızda hissetmek için en yakın bayimize uğrayabilirsiniz.",
                    'image' => 'assets/backgrounds/bg5.jpg'
                ]
            ])
        ],
        [
            'title' => 'Odyofiller İçin Özel: OF Serisi Stereo Amfiler Satışta',
            'summary' => 'Saf ses saflığını hedefleyen odyofiller için özel JFET giriş teknolojisi ve Sanken bipolar transistörlerle üretilen Beeses OF Serisi, doğal ses tınısını aracınıza getiriyor.',
            'content' => '',
            'category' => 'Etkinlik',
            'image' => 'assets/products/OF-1 ve BS-O 101.PNG',
            'sections' => json_encode([
                [
                    'title' => 'Saf Ses Saflığı İçin JFET Giriş Teknolojisi',
                    'text' => "Beeses Audio, odyofil ses tutkunları için özel olarak ürettiği OF Serisi (OF-1 ve OF-2) amfilerini satışa sundu. Sanken bipolar transistörler ve JFET giriş katı sayesinde, kaynaktan gelen ses sinyali en ufak bir bozulmaya uğramadan hoparlörlerinize aktarılır.",
                    'image' => 'assets/backgrounds/bg6.jpg'
                ],
                [
                    'title' => 'Kusursuz Hoparlör Kontrolü ve Yüksek Damping Faktörü',
                    'text' => "Damping faktörünün yüksekliği (400) sayesinde hoparlörlerin kontrolü kusursuz şekilde sağlanır, bu da daha sıkı ve kontrollü bas tepkileri ile doğal vokaller anlamına gelir. Sınıfının en temiz ses kalitesine sahip amfisi olan OF serisi hakkında detaylı teknik bilgileri ürün kataloğumuzdan edinebilirsiniz.",
                    'image' => 'assets/backgrounds/bg7.jpg'
                ]
            ])
        ]
    ];

    $insert = $pdo->prepare("INSERT INTO news (title, summary, content, category, image, sections) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($news as $item) {
        $insert->execute([
            $item['title'],
            $item['summary'],
            $item['content'],
            $item['category'],
            $item['image'],
            $item['sections']
        ]);
    }

    echo json_encode([
        "success" => true,
        "message" => "News tablosu başarıyla yeniden kuruldu ve sekmeli haber yapılandırması yüklendi."
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Veritabanı kurulum hatası: " . $e->getMessage()
    ]);
}
?>
