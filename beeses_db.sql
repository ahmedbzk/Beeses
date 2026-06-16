-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: 127.0.0.1
-- Üretim Zamanı: 12 Haz 2026, 21:58:31
-- Sunucu sürümü: 10.4.32-MariaDB
-- PHP Sürümü: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `beeses_db`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'admin',
  `permissions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `admins`
--

INSERT INTO `admins` (`id`, `username`, `password`, `role`, `permissions`, `created_at`) VALUES
(1, 'superadmin', 'ac497cfaba23c4184cb03b97e8c51e0a', 'superadmin', NULL, '2026-05-18 22:16:49'),
(2, 'Admin2', '5a5e4a35d82916ec6ceb3da180c11a65', 'admin', '{\"products\":{\"view\":true,\"edit\":false},\"news\":{\"view\":true,\"edit\":false},\"certificates\":{\"view\":true,\"edit\":false},\"faq\":{\"view\":true,\"edit\":false},\"contacts\":{\"view\":true,\"edit\":false},\"warranties\":{\"view\":false,\"edit\":false},\"distributors\":{\"view\":false,\"edit\":false},\"innovations\":{\"view\":false,\"edit\":false},\"newsletter\":{\"view\":false,\"edit\":false},\"admins\":{\"view\":true,\"edit\":false}}', '2026-06-09 20:57:50');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `admin_logs`
--

CREATE TABLE `admin_logs` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `page` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `admin_logs`
--

INSERT INTO `admin_logs` (`id`, `admin_id`, `username`, `page`, `action`, `details`, `created_at`) VALUES
(20, 2, 'Admin2', 'auth', 'Giriş', 'Yönetim paneline giriş yapıldı.', '2026-06-09 20:58:31'),
(34, 2, 'Admin2', 'auth', 'Giriş', 'Yönetim paneline giriş yapıldı.', '2026-06-09 20:58:46'),
(112, 2, 'Admin2', 'auth', 'Giriş', 'Yönetim paneline giriş yapıldı.', '2026-06-09 21:21:17'),
(154, 2, 'Admin2', 'auth', 'Giriş', 'Yönetim paneline giriş yapıldı.', '2026-06-09 21:33:48'),
(169, 2, 'Admin2', 'auth', 'Güncelleme', 'Profil güncellendi. Yeni kullanıcı adı: Admin2', '2026-06-09 21:50:38'),
(170, 2, 'Admin2', 'auth', 'Güncelleme', 'Profil güncellendi. Yeni kullanıcı adı: Admin2', '2026-06-09 21:50:43'),
(171, 2, 'Admin2', 'auth', 'Giriş', 'Yönetim paneline giriş yapıldı.', '2026-06-09 21:50:51'),
(208, 2, 'Admin2', 'auth', 'Giriş', 'Yönetim paneline giriş yapıldı.', '2026-06-09 21:52:07'),
(219, 2, 'Admin2', 'certificates', 'Güncelleme', 'Sertifika güncellendi (TSE Standart Uygunluk2222)', '2026-06-09 21:52:18'),
(252, 2, 'Admin2', 'auth', 'Giriş', 'Yönetim paneline giriş yapıldı.', '2026-06-09 22:10:38');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `approved_warranties`
--

CREATE TABLE `approved_warranties` (
  `id` int(11) NOT NULL,
  `warranty_id` int(11) NOT NULL,
  `serial_number` varchar(100) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `approved_warranties`
--

INSERT INTO `approved_warranties` (`id`, `warranty_id`, `serial_number`, `product_name`, `start_date`, `end_date`, `status`, `created_at`) VALUES
(1, 8, 'asdsadasd', 'SQL-4200', '2026-05-19', '2028-05-19', 'active', '2026-05-27 21:06:45'),
(2, 10, 'P220000000', 'PETEK STEREO', '2026-05-27', '2028-05-27', 'active', '2026-05-27 21:43:48'),
(3, 11, 'P220222222', 'PETEK STEREO', '2026-05-26', '2028-05-26', 'active', '2026-05-28 14:35:29');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT 'award',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `certificates`
--

INSERT INTO `certificates` (`id`, `name`, `name_en`, `description`, `description_en`, `icon`, `created_at`) VALUES
(1, 'ISO 9001:2015', 'ISO 9001:2015', 'Kalite Yönetim Sistemi Sertifikası', 'Quality Management System Certificate', 'shield-check', '2026-05-24 19:22:19'),
(2, 'ISO 14001:2015', 'ISO 14001:2015', 'Çevre Yönetim Sistemi Sertifikası', 'Environmental Management System Certificate', 'leaf', '2026-05-24 19:22:19'),
(3, 'CE Belgesi', 'CE Belgesi', 'Avrupa Standartlarına Uygunluk Beyanı', 'Declaration of Conformity to European Standards', 'award', '2026-05-24 19:22:19'),
(4, 'Yerli Üretim Belgesi', 'Domestic Production Certificate', 'Türkiye Cumhuriyeti Sanayi ve Teknoloji Bakanlığı Onaylı', 'Approved by the Republic of Turkey Ministry of Industry and Technology', 'flag', '2026-05-24 19:22:19'),
(5, 'TSE Standart Uygunluk', 'TSE Standart Uygunluk', 'Türk Standartları Enstitüsü Onaylı Üretim Kalitesi', 'Approved Production Quality by Turkish Standards Institute', 'check-circle', '2026-05-24 19:22:19'),
(6, 'Hizmet Yeterlilik Belgesi', 'Hizmet Yeterlilik Belgesi', 'Satış Sonrası Destek ve Teknik Servis Standartları', 'After-sales Support and Technical Service Standards', 'settings', '2026-05-24 19:22:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `contacts`
--

CREATE TABLE `contacts` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `reply_message` text DEFAULT NULL,
  `status` enum('yeni','okundu','cevaplandi') DEFAULT 'yeni',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `contacts`
--

INSERT INTO `contacts` (`id`, `first_name`, `last_name`, `email`, `phone`, `subject`, `message`, `reply_message`, `status`, `created_at`) VALUES
(1, 'Süleyman', 'Çeçen', 'ahmedbozkurt959@gmail.com', NULL, 'ses', 'Ses sistemleriniz çok güzel çok harika.', NULL, 'yeni', '2026-05-19 09:08:40'),
(2, 'Deneme2', 'deneme', 'deneme@gmail.com', '5383883232', 'Genel Bilgi', 'denemecandır', 'denemeye cevap verildi.', 'yeni', '2026-05-19 09:31:18'),
(3, 'Selami', 'Başaran', 'selami@gmail.com', '5365657452', 'Teknik Destek', 'denemeselami', NULL, 'okundu', '2026-05-19 09:35:23'),
(4, 'Merve', 'Boztürk', 'mervecan@gmail.com', '5307031834', 'Teknik Destek', 'Yani aradım ulaşamadım sizleri neden geri dönüş yapmıyosnuz?', 'ddddddddddddd', 'cevaplandi', '2026-05-19 13:48:21'),
(5, 'Deneme2', 'deneme', 'deneme@gmail.com', '55522233322', 'Satış Ortaklığı', 'selamdeneme12-34', 'Denemecevapverildi.', 'okundu', '2026-05-24 00:19:04'),
(6, 'Ahmetcan', 'Bozkurt', 'ahmedbozkurt959@gmail.com', '05388647110', 'Garanti Başvurusu', 'sdasdsadasdasdasd', 'selam', 'cevaplandi', '2026-06-05 20:32:33');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `distributors`
--

CREATE TABLE `distributors` (
  `id` int(11) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `representative` varchar(100) DEFAULT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `distributors`
--

INSERT INTO `distributors` (`id`, `country`, `representative`, `company_name`, `address`, `phone`, `email`, `website`, `instagram`, `facebook`, `youtube`, `created_at`) VALUES
(1, 'USA (West Coast)', 'Mr. Keith Smith', 'Custom Works Performance Products', '740 Bruce Ln Chico Ca 95928 USA', '001 530 864-5846', 'ks71z28@live.com', 'http://www.customworksperformance.net', 'https://instagram.com/custom_works_performance', 'https://www.facebook.com/CustomWorksPerformance', 'https://www.youtube.com/@Hi-Fire-do', '2026-05-19 10:55:20'),
(2, 'USA (East Coast)', 'Mr. Miguel Ayala', 'Elite Audio LLC', '15354 Northumberland HWY, Burgess va 22432, USA', '001 831 262 7779', 'califgold1@hotmail.com', 'https://www.eliteaudiostore.net/pages/contact', '', '', '', '2026-05-19 10:55:20'),
(3, 'Taiwan', 'Ms. Lulu and Mr. Bevis Huang', 'SHANG GUI TRADING CO., LTD.', 'No. 39, Yichang Rd., Taiping Dist., Taichung City 411035, Taiwan (R.O.C.)', '+886 422778677', 'cw.taiwan.audio@gmail.com', '', '', '', '', '2026-05-19 10:55:20'),
(6, 'Turkey', 'Beeses Audio', 'Beeses Audio Company', 'Oruçreis Mahallesi Giyimkent 16. Sokak Giyimkent Sitesi B170 Blok no: 112/A Esenler / İSTANBUL', '+90 (212) 000 00 00', 'info@iotek.com.tr', 'https://iotek.com.tr', 'https://www.instagram.com/beeses.audio?igsh=MTU2bGR3bWd5MnJsdQ%3D%3D&utm_source=qr', 'https://www.facebook.com/share/1DWuneXLUK/?mibextid=wwXlfr', '', '2026-05-19 11:35:39');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` text NOT NULL,
  `question_en` text DEFAULT NULL,
  `answer` text NOT NULL,
  `answer_en` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `question_en`, `answer`, `answer_en`, `created_at`) VALUES
(1, 'Beeses nedir?', 'What is Beeses?', 'Beeses, yüksek kaliteli ve yenilikçi amfi üretimi yapan bir Türk markasıdır. Hem profesyonel müzisyenler hem de amatör kullanıcılar için tasarlanan ürünlerimiz, üstün ses kalitesi ve dayanıklılık sunar.', 'Beeses is a Turkish brand that produces high-quality and innovative amplifiers. Designed for both professional musicians and amateur users, our products offer superior sound quality and durability.', '2026-05-24 19:22:19'),
(2, 'Beeses amfileri hangi tür müzikler için uygundur?', 'What kinds of music are Beeses amplifiers suitable for?', 'Beeses amfileri, rock, jazz, blues, metal ve akustik gibi çeşitli müzik türleri için mükemmel performans sağlar. Farklı modellerimiz, farklı ses ihtiyaçlarını karşılamak üzere tasarlanmıştır.', 'Beeses amplifiers provide excellent performance for various music genres such as rock, jazz, blues, metal, and acoustic. Our different models are designed to meet different audio needs.', '2026-05-24 19:22:19'),
(3, 'Ürünlerinizi nereden satın alabilirim?', 'Where can I buy your products?', 'Beeses ürünlerini resmi web sitemizden veya yetkili satış noktalarımızdan satın alabilirsiniz. Web sitemizdeki “Satış Noktaları” bölümünden size en yakın mağazayı bulabilirsiniz.', 'You can purchase Beeses products from our official website or authorized sales points. You can find the nearest store in the \"Sales Points\" section of our website.', '2026-05-24 19:22:19'),
(4, 'Amfilerinizin garanti süresi nedir?', 'What is the warranty period of your amplifiers?', 'Beeses amfilerimiz 2 yıl üretici garantisi ile sunulmaktadır. Garanti kapsamında ürünlerimizdeki üretim hataları ücretsiz olarak tamir edilir veya değiştirilir.', 'Our Beeses amplifiers are offered with a 2-year manufacturer warranty. Under the warranty, manufacturing defects in our products are repaired or replaced free of charge.', '2026-05-24 19:22:19'),
(5, 'Teknik destek alabilir miyim?', 'Can I get technical support?', 'Evet, Beeses teknik destek ekibi, ürünlerinizle ilgili her türlü soru ve sorun için hizmetinizdedir. Teknik destek almak için web sitemizdeki “Destek” bölümünü ziyaret edebilir veya e-posta yoluyla bize ulaşabilirsiniz.', 'Yes, the Beeses technical support team is at your service for any questions and problems regarding your products. To get technical support, you can visit the \"Support\" section on our website or contact us via email.', '2026-05-24 19:22:19'),
(6, 'Amfileriniz özelleştirilebilir mi?', 'Are your amplifiers customizable?', 'Bazı Beeses modelleri, kullanıcıların ihtiyaçlarına göre özelleştirilebilir. Özel tasarım talepleriniz için bizimle iletişime geçebilirsiniz.', 'Some Beeses models can be customized according to the needs of users. You can contact us for custom design requests.', '2026-05-24 19:22:19'),
(7, 'Kurulum hizmeti sunuyor musunuz?', 'Do you offer installation services?', 'Profesyonel ses sistemleri projeleriniz için keşif ve kurulum hizmeti sağlamaktayız. Detaylı bilgi için teknik ekibimizle iletişime geçebilirsiniz.', 'We provide discovery and installation services for your professional audio system projects. You can contact our technical team for detailed information.', '2026-05-24 19:22:19'),
(8, 'Uluslararası gönderim yapıyor musunuz?', 'Do you ship internationally?', 'Evet, dünyanın birçok noktasına güvenli kargo seçeneklerimizle ürün gönderimi sağlamaktayız. Kargo ücretleri bölgeye göre değişiklik göstermektedir.', 'Yes, we provide product shipments to many parts of the world with our secure shipping options. Shipping fees vary by region.', '2026-05-24 19:22:19'),
(9, 'İade ve değişim şartlarınız nelerdir?', 'What are your return and exchange conditions?', 'Satın aldığınız ürünleri, kullanılmamış ve ambalajı bozulmamış olması şartıyla 14 gün içerisinde iade edebilir veya değiştirebilirsiniz.', 'You can return or exchange the products you purchased within 14 days, provided they are unused and in original packaging.', '2026-05-24 19:22:19'),
(10, 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', 'Which payment methods do you accept?', 'Kredi kartı, banka havalesi, EFT ve güvenli online ödeme sistemlerini kabul ediyoruz. Ayrıca yetkili satıcılarımızda elden taksit imkanları da bulunabilmektedir.', 'We accept credit cards, bank transfers, EFT, and secure online payment systems. Also, installment options may be available at our authorized dealers.', '2026-05-24 19:22:19');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `innovations`
--

CREATE TABLE `innovations` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `subtitle_en` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `status_en` varchar(255) DEFAULT NULL,
  `launchDate` varchar(255) DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `features_en` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features_en`)),
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs`)),
  `specs_en` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs_en`)),
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `innovations`
--

INSERT INTO `innovations` (`id`, `title`, `title_en`, `subtitle`, `subtitle_en`, `description`, `description_en`, `status`, `status_en`, `launchDate`, `features`, `features_en`, `specs`, `specs_en`, `image`, `created_at`) VALUES
(1, 'B-PRO X SERIES', 'B-PRO X SERIES', 'Sesin Geleceği', 'The Future of Sound', 'Yüksek performanslı dijital sinyal işleme teknolojisi ile donatılmış, konser kalitesinde ses deneyimi sunan yeni nesil hoparlör serimiz.', 'Equipped with high-performance digital signal processing technology, our new generation speaker series offering concert-quality sound experience.', 'Geliştirme Aşamasında', 'In Development', '2026 Q4', '[\"Active DSP Control\",\"Wireless Hi-Fi Connectivity\",\"Sustainable Materials\"]', '[\"Active DSP Control\",\"Wireless Hi-Fi Connectivity\",\"Sustainable Materials\"]', '[{\"name\":\"Sinyal İşleme\",\"value\":\"32-bit Floating Point DSP\"},{\"name\":\"Bağlantı\",\"value\":\"Bluetooth 5.3, Wi-Fi 6\"},{\"name\":\"Frekans Tepkisi\",\"value\":\"20Hz - 22kHz\"}]', '[{\"name\":\"Signal Processing\",\"value\":\"32-bit Floating Point DSP\"},{\"name\":\"Connectivity\",\"value\":\"Bluetooth 5.3, Wi-Fi 6\"},{\"name\":\"Frequency Response\",\"value\":\"20Hz - 22kHz\"}]', 'uploads/innovations/1780521640_6a209aa882c54.png', '2026-05-31 21:50:29'),
(2, 'AERO-SHELL PETEK', 'AERO-SHELL PETEK', 'Aerodinamik Akustiğin Zirvesi', 'The Peak of Aerodynamic Acoustics', 'Petek serimizin evrimi. Daha hafif, daha dayanıklı ve akustik olarak mükemmelleştirilmiş yeni gövde tasarımı.', 'Evolution of our honeycomb series. Lighter, more durable, and acoustically perfected new body design.', 'Prototip Test Ediliyor', 'Prototype Testing', '2027 Q1', '[\"Carbon Fiber Shell\",\"Enhanced Cooling System\",\"Ultra-Low Distortion\"]', '[\"Carbon Fiber Shell\",\"Enhanced Cooling System\",\"Ultra-Low Distortion\"]', '[{\"name\":\"Gövde Materyali\",\"value\":\"Karbon Fiber ve Titanyum Alaşım\"},{\"name\":\"Ağırlık\",\"value\":\"Önceki nesle göre %30 daha hafif\"},{\"name\":\"Termal Kapasite\",\"value\":\"Geliştirilmiş 150W soğutma\"}]', '[{\"name\":\"Body Material\",\"value\":\"Carbon Fiber and Titanium Alloy\"},{\"name\":\"Weight\",\"value\":\"30% lighter than previous generation\"},{\"name\":\"Thermal Capacity\",\"value\":\"Enhanced 150W cooling\"}]', 'uploads/innovations/1780520232_6a209528721f0.png', '2026-05-31 21:50:29');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `summary` text NOT NULL,
  `summary_en` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `content_en` text DEFAULT NULL,
  `category` varchar(100) NOT NULL DEFAULT 'Duyuru',
  `image` varchar(255) DEFAULT '',
  `video_url` varchar(500) DEFAULT NULL,
  `sections` text DEFAULT NULL,
  `sections_en` text DEFAULT NULL,
  `news_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `news`
--

INSERT INTO `news` (`id`, `title`, `title_en`, `summary`, `summary_en`, `content`, `content_en`, `category`, `image`, `sections`, `sections_en`, `news_date`, `created_at`) VALUES
(1, 'Beeses Audio Yeni SQL Amplifikatör Serisini Duyurdu', 'Beeses Audio Announces New SQL Amplifier Series', 'Beeses Audio, araç içi ses deneyimini zirveye taşıyan yeni nesil Class-AB SQL serisi amfilerini piyasaya sürdü. Yüksek çözünürlüklü ses performansı ve dayanıklı gövde tasarımı ile dikkat çeken seride SQL-4400 ve SQL-4200 modelleri yer alıyor.', 'Beeses Audio has launched its new generation Class-AB SQL series amplifiers, taking the in-car audio experience to the peak. The series, which draws attention with its high-resolution sound performance and durable body design, includes the SQL-4400 and SQL-4200 models.', '', '', 'Duyuru', 'assets/products/sql44001.2.png', '[{\"title\":\"M\\u00fckemmel Sesin Pe\\u015finde: Yeni Class-AB Serisi\",\"text\":\"Beeses Audio olarak, ses d\\u00fcnyas\\u0131nda standartlar\\u0131 yeniden belirleyen yeni Class-AB SQL Serisi amplifikat\\u00f6rlerimizi sunmaktan gurur duyuyoruz. Bu seri, temiz, g\\u00fc\\u00e7l\\u00fc ve yorulmayan bir dinleme deneyimi sunmak \\u00fczere T\\u00fcrkiye\'de titizlikle tasarlanm\\u0131\\u015ft\\u0131r.\",\"image\":\"assets\\/backgrounds\\/bg1.jpg\"},{\"title\":\"\\u00dcst\\u00fcn G\\u00fc\\u00e7 Elemanlar\\u0131 ve Cosmo Toroidal Trafo\",\"text\":\"SQL-4400, 4x464 watt (2 ohm) g\\u00fcc\\u00fc ve ultra d\\u00fc\\u015f\\u00fck distorsiyon oranlar\\u0131 (%0.033 THD+N) ile y\\u00fcksek g\\u00fc\\u00e7 gereksinimi duyan kullan\\u0131c\\u0131lar i\\u00e7in geli\\u015ftirildi. Cosmo toroidal trafolar ve Infineon mosfet \\u00e7\\u0131k\\u0131\\u015f katlar\\u0131 ile donat\\u0131lan amfilerimiz, kararl\\u0131 ve kay\\u0131ps\\u0131z bir enerji aktar\\u0131m\\u0131 sa\\u011flar.\",\"image\":\"assets\\/backgrounds\\/bg2.jpg\"},{\"title\":\"CNC Kesim Al\\u00fcminyum G\\u00f6vde ve Geli\\u015fmi\\u015f So\\u011futma\",\"text\":\"Yeni nesil so\\u011futma bloklar\\u0131 ve \\u015f\\u0131k CNC kesim al\\u00fcminyum g\\u00f6vdesi ile arac\\u0131n\\u0131zda minimum yer kaplayacak \\u015fekilde tasarlanm\\u0131\\u015ft\\u0131r. Alt\\u0131n kaplamal\\u0131 RCA giri\\u015fleri ve y\\u00fcksek kaliteli hoparl\\u00f6r terminalleri, sinyal kayb\\u0131n\\u0131 tamamen ortadan kald\\u0131r\\u0131r. Beeses Audio distrib\\u00fct\\u00f6rleri \\u00fczerinden \\u015fimdi sat\\u0131n alabilirsiniz.\",\"image\":\"assets\\/backgrounds\\/bg3.jpg\"}]', '[{\"title\":\"In Pursuit of Perfect Sound: New Class-AB Series\",\"text\":\"As Beeses Audio, we are proud to introduce our new Class-AB SQL Series amplifiers, which redefine standards in the audio world. This series is meticulously designed in Turkey to offer a clean, powerful, and fatigue-free listening experience.\",\"image\":\"assets\\/backgrounds\\/bg1.jpg\"},{\"title\":\"Superior Power Elements and Cosmo Toroidal Transformer\",\"text\":\"SQL-4400 has been developed for users who require high power with 4x464 watt (2 ohm) power and ultra-low distortion rates (0.033% THD+N). Equipped with Cosmo toroidal transformers and Infineon mosfet output stages, our amplifiers provide stable and lossless energy transfer.\",\"image\":\"assets\\/backgrounds\\/bg2.jpg\"},{\"title\":\"CNC Cut Aluminum Body and Advanced Cooling\",\"text\":\"With its new generation cooling blocks and stylish CNC cut aluminum body, it is designed to take up minimum space in your vehicle. Gold-plated RCA inputs and high-quality speaker terminals completely eliminate signal loss. You can buy it now through Beeses Audio distributors.\",\"image\":\"assets\\/backgrounds\\/bg3.jpg\"}]', '2026-05-28 16:00:42', '2026-05-28 16:00:42'),
(2, 'Yerli Üretim Gücü: Petek Serisi Fabrikamızda', 'Local Production Power: Petek Series in Our Factory', 'T.C. Sanayi ve Teknoloji Bakanlığı onaylı Yerli Üretim Belgesi ile üretilen Petek serisi amfilerimiz, Hi-Res ses kalitesini kompakt boyutlarda sunarak yerli mühendisliğin gururu oluyor.', 'Produced with the Domestic Production Certificate approved by the Republic of Turkey Ministry of Industry and Technology, our Petek series amplifiers offer Hi-Res sound quality in compact dimensions and become the pride of local engineering.', '', '', 'Haber', 'assets/products/Petek Stereo.png', '[{\"title\":\"Yerli M\\u00fchendislik ve Kompakt Tasar\\u0131m Esnekli\\u011fi\",\"text\":\"Beeses Audio Petek Serisi amplifikat\\u00f6rler, tamamen yerli tasar\\u0131m ve \\u00fcretim s\\u00fcre\\u00e7leri ile \\u00fcretilmektedir. Kompakt yap\\u0131s\\u0131 sayesinde koltuk alt\\u0131 veya bagaj i\\u00e7i yan b\\u00f6lmeler gibi dar alanlarda kolayca konumland\\u0131r\\u0131labilen Petek Serisi, Hi-Res Audio standartlar\\u0131nda ses \\u00fcretimi sunar.\",\"image\":\"\"},{\"title\":\"\\u0130zole Preamfi ve Alt\\u0131n Kaplama PCB Teknolojisi\",\"text\":\"\\u0130zole preamfi yap\\u0131s\\u0131, besleme kat\\u0131ndan gelebilecek manyetik parazitleri s\\u00f6n\\u00fcmler ve sessiz bir arka plan sa\\u011flar. Alt\\u0131n kaplama PCB yollar\\u0131 ise oksitlenmeyi engelleyerek ses iletim kalitesini uzun y\\u0131llar boyunca korur. Yerli \\u00fcretimin g\\u00fcc\\u00fcn\\u00fc arac\\u0131n\\u0131zda hissetmek i\\u00e7in en yak\\u0131n bayimize u\\u011frayabilirsiniz.\",\"image\":\"assets\\/backgrounds\\/bg5.jpg\"}]', '[{\"title\":\"Local Engineering and Compact Design Flexibility\",\"text\":\"Beeses Audio Petek Series amplifiers are produced entirely with local design and production processes. Thanks to its compact structure, Petek Series can be easily positioned in narrow spaces such as under-seat or luggage side compartments, and offers sound reproduction at Hi-Res Audio standards.\",\"image\":\"\"},{\"title\":\"Isolated Preamp and Gold-Plated PCB Technology\",\"text\":\"The isolated preamp structure dampens magnetic interference from the power stage and provides a quiet background. Gold-plated PCB paths prevent oxidation, protecting the audio transmission quality for many years. You can visit our nearest dealer to feel the power of local production in your vehicle.\",\"image\":\"assets\\/backgrounds\\/bg5.jpg\"}]', '2026-05-28 16:00:42', '2026-05-28 16:00:42'),
(3, 'Odyofiller İçin Özel: OF Serisi Stereo Amfiler Satışta', 'Special for Audiophiles: OF Series Stereo Amplifiers on Sale', 'Saf ses saflığını hedefleyen odyofiller için özel JFET giriş teknolojisi ve Sanken bipolar transistörlerle üretilen Beeses OF Serisi, doğal ses tınısını aracınıza getiriyor.', 'Aiming for pure sound clarity, the Beeses OF Series, produced with special JFET input technology and Sanken bipolar transistors for audiophiles, brings natural sound tone to your vehicle.', '', '', 'Etkinlik', 'assets/products/OF-1 ve BS-O 101.PNG', '[{\"title\":\"Saf Ses Safl\\u0131\\u011f\\u0131 \\u0130\\u00e7in JFET Giri\\u015f Teknolojisi\",\"text\":\"Beeses Audio, odyofil ses tutkunlar\\u0131 i\\u00e7in \\u00f6zel olarak \\u00fcretti\\u011fi OF Serisi (OF-1 ve OF-2) amfilerini sat\\u0131\\u015fa sundu. Sanken bipolar transist\\u00f6rler ve JFET giri\\u015f kat\\u0131 sayesinde, kaynaktan gelen ses sinyali en ufak bir bozulmaya u\\u011framadan hoparl\\u00f6rlerinize aktar\\u0131l\\u0131r.\",\"image\":\"assets\\/backgrounds\\/bg6.jpg\"},{\"title\":\"Kusursuz Hoparl\\u00f6r Kontrol\\u00fc ve Y\\u00fcksek Damping Fakt\\u00f6r\\u00fc\",\"text\":\"Damping fakt\\u00f6r\\u00fcn\\u00fcn y\\u00fcksekli\\u011fi (400) sayesinde hoparl\\u00f6rlerin kontrol\\u00fc kusursuz \\u015fekilde sa\\u011flan\\u0131r, bu da daha s\\u0131k\\u0131 ve kontroll\\u00fc bas tepkileri ile do\\u011fal vokaller anlam\\u0131na gelir. S\\u0131n\\u0131f\\u0131n\\u0131n en temiz ses kalitesine sahip amfisi olan OF serisi hakk\\u0131nda detayl\\u0131 teknik bilgileri \\u00fcr\\u00fcn katalo\\u011fumuzdan edinebilirsiniz.\",\"image\":\"assets\\/backgrounds\\/bg7.jpg\"}]', '[{\"title\":\"JFET Input Technology for Pure Sound Purity\",\"text\":\"Beeses Audio has released its OF Series (OF-1 and OF-2) amplifiers produced specifically for audiophile music lovers. Thanks to Sanken bipolar transistors and JFET input stage, the audio signal coming from the source is transmitted to your speakers without the slightest distortion.\",\"image\":\"assets\\/backgrounds\\/bg6.jpg\"},{\"title\":\"Flawless Speaker Control and High Damping Factor\",\"text\":\"Thanks to the high damping factor (400), speaker control is flawlessly provided, which means tighter and more controlled bass responses and natural vocals. You can obtain detailed technical information about the OF series, which has the cleanest sound quality in its class, from our product catalog.\",\"image\":\"assets\\/backgrounds\\/bg7.jpg\"}]', '2026-05-28 16:00:42', '2026-05-28 16:00:42');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `newsletter_logs`
--

CREATE TABLE `newsletter_logs` (
  `id` int(11) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `body` text NOT NULL,
  `recipients_count` int(11) NOT NULL DEFAULT 0,
  `sent_count` int(11) NOT NULL DEFAULT 0,
  `failed_count` int(11) NOT NULL DEFAULT 0,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `newsletter_logs`
--

INSERT INTO `newsletter_logs` (`id`, `subject`, `body`, `recipients_count`, `sent_count`, `failed_count`, `sent_at`) VALUES
(1, 'sadsad', 'asdasdasd', 1, 0, 1, '2026-05-28 22:15:51');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `newsletter_subscribers`
--

INSERT INTO `newsletter_subscribers` (`id`, `email`, `is_active`, `subscribed_at`) VALUES
(1, 'test@test.com', 0, '2026-05-28 22:10:21'),
(2, 'ahmedbozkurt959@gmail.com', 1, '2026-05-28 22:11:05'),
(3, 'ahmedbozkurt959@gmail.com2', 0, '2026-05-28 22:16:06'),
(4, 'mervebozktukt@gmail.com', 0, '2026-06-04 00:37:12'),
(5, 'ahmedbozkurt959@gmail.com12', 0, '2026-05-28 23:13:41');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `shortDescription` text NOT NULL,
  `shortDescription_en` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `description_en` text DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `images` text DEFAULT NULL,
  `pdfUrl` varchar(255) DEFAULT '',
  `specs` text DEFAULT NULL,
  `specs_en` text DEFAULT NULL,
  `features` text DEFAULT NULL,
  `features_en` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `pdfUrl_en` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `products`
--

INSERT INTO `products` (`id`, `slug`, `name`, `name_en`, `category`, `shortDescription`, `shortDescription_en`, `description`, `description_en`, `image`, `images`, `pdfUrl`, `specs`, `specs_en`, `features`, `features_en`, `created_at`, `pdfUrl_en`) VALUES
(1, 'sql-4400', 'SQL-4400 Serisi Amplifikatör', 'SQL-4400 Series Amplifikatör', 'SQL SERİSİ', 'Class-AB Amplifikatör', 'Class-AB Amplifier', 'Özenle tasarlanmış Class-AB besleme yapısı ile doğal, yüksek çözünürlüklü ve uzun ömürlü bir ses performansi sunar.', 'With its carefully designed Class-AB power supply structure, it offers a natural, high-resolution and long-lasting sound performance.', 'uploads/products/1780691276_main_6a23314c7b2c2.png', '[\"uploads\\/products\\/1780691276_main_6a23314c7b2c2.png\",\"uploads\\/products\\/1780691276_gal_0_6a23314c7c1dd.png\",\"uploads\\/products\\/1780691276_gal_1_6a23314c7c70e.png\"]', 'uploads/products/Beeses-SQL-4400.pdf', '[{\"name\":\"Producing Country\",\"value\":\"Türkiye\"},{\"name\":\"Weight\",\"value\":\"5900 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"62x216x435 mm\"},{\"name\":\"Crossover\",\"value\":\"Low pass-Band pass-High pass (32Hz-4Khz)\"},{\"name\":\"PWM Technology\",\"value\":\"IR mosfet, Cosmo toroidal\"},{\"name\":\"Output Technology\",\"value\":\"Infineon mosfet\"},{\"name\":\"Input Technology\",\"value\":\"Jfet\"},{\"name\":\"Input Empedance\",\"value\":\"22 KΩ\"},{\"name\":\"Input Sensitivity\",\"value\":\"0.3-8 volt\"},{\"name\":\"Frequancy Range\",\"value\":\"8-54.000 Hz\"},{\"name\":\"THD+N\",\"value\":\"% 0.033 (% 90 power), % 0.025 (10 W)\"},{\"name\":\"Damping\",\"value\":\"400\"},{\"name\":\"S/N Ratio\",\"value\":\"105\"},{\"name\":\"Power\",\"value\":\"4x464 watt @ 2Ω, 4x256 watt @ 4Ω\"},{\"name\":\"Maximum Current\",\"value\":\"148 amper\"},{\"name\":\"Iddle current\",\"value\":\"1.56 amper\"},{\"name\":\"Voltage Range\",\"value\":\"10.5-18 volt\"},{\"name\":\"Class\",\"value\":\"Class-AB\"},{\"name\":\"Channel\",\"value\":\"4\"}]', '[{\"name\":\"Producing Country\",\"value\":\"Turkey\"},{\"name\":\"Weight\",\"value\":\"5900 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"62x216x435 mm\"},{\"name\":\"Crossover\",\"value\":\"Low pass-Band pass-High pass (32Hz-4Khz)\"},{\"name\":\"PWM Technology\",\"value\":\"IR mosfet, Cosmo toroidal\"},{\"name\":\"Output Technology\",\"value\":\"Infineon mosfet\"},{\"name\":\"Input Technology\",\"value\":\"Jfet\"},{\"name\":\"Input Empedance\",\"value\":\"22 KΩ\"},{\"name\":\"Input Sensitivity\",\"value\":\"0.3-8 volt\"},{\"name\":\"Frequancy Range\",\"value\":\"8-54.000 Hz\"},{\"name\":\"THD+N\",\"value\":\"% 0.033 (% 90 power), % 0.025 (10 W)\"},{\"name\":\"Damping\",\"value\":\"400\"},{\"name\":\"S/N Ratio\",\"value\":\"105\"},{\"name\":\"Power\",\"value\":\"4x464 watt @ 2Ω, 4x256 watt @ 4Ω\"},{\"name\":\"Maximum Current\",\"value\":\"148 amper\"},{\"name\":\"Iddle current\",\"value\":\"1.56 amper\"},{\"name\":\"Voltage Range\",\"value\":\"10.5-18 volt\"},{\"name\":\"Class\",\"value\":\"Class-AB\"},{\"name\":\"Channel\",\"value\":\"4\"}]', '[{\"title\":\"Geniş Frekans Tepkisi\",\"description\":\"8 Hz\'den 54.000 Hz\'e uzanan geniş frekans bandı.\"},{\"title\":\"Eşleştirilmiş Transistör ile Hassas Sinyal İşleme\",\"description\":\"Kanal içi doğrusallığı ve simetriyi artırır. Distorsiyon düşer, sinyal işleme hassasiyeti artar.\"},{\"title\":\"Sınıf AB Amplifikatör Mimarisi\",\"description\":\"Sınıf A\'nın doğallığı ile Sınıf B\'nin verimliliğini birleştirir.\"},{\"title\":\"Güçlü PWM ile Hassas Voltaj Kontrolü\",\"description\":\"Güç katında kullanılan güçlü PWM yapısı, araç elektrik sistemindeki dalgalanmalara rağmen besleme voltajını hassas şekilde kontrol eder.\"},{\"title\":\"Hassas Gain Kontrolü\",\"description\":\"Hoparlör ve kaynak cihaz kombinasyonunuza uygun hassas seviye ayarı yapabilir.\"},{\"title\":\"Altın Kaplamalı RCA Terminalleri\",\"description\":\"Düşük temas direnci ve yüksek iletkenlik sağlayarak sinyal kaybını minimize eder.\"},{\"title\":\"Çok Düşük Distorsiyon\",\"description\":\"Orta ve yüksek ses seviyelerinde bile temiz, pürüzsüz ve yorucu olmayan bir dinleme deneyimi sunar.\"},{\"title\":\"Kompakt Gövde Tasarımı\",\"description\":\"CNC ile hassas işlenmiş kompakt alüminyum gövde, araç içinde minimum yer kaplayacak şekilde tasarlanmıştır.\"}]', '[{\"title\":\"Wide Frequency Response\",\"description\":\"Wide frequency band extending from 8 Hz to 54.000 Hz.\"},{\"title\":\"Precise Signal Processing with Matched Transistors\",\"description\":\"Increases in-channel linearity and symmetry. Lowers distortion, increases signal processing precision.\"},{\"title\":\"Class-AB Amplifier Architecture\",\"description\":\"Combines the natural sound of Class-A with the efficiency of Class-B.\"},{\"title\":\"Precise Voltage Control with Powerful PWM\",\"description\":\"The powerful PWM structure used in the power stage precisely controls the supply voltage despite fluctuations in the vehicle electrical system.\"},{\"title\":\"Precise Gain Control\",\"description\":\"Can adjust the level precisely to suit your speaker and source device combination.\"},{\"title\":\"Gold-Plated RCA Terminals\",\"description\":\"Provides low contact resistance and high conductivity to minimize signal loss.\"},{\"title\":\"Very Low Distortion\",\"description\":\"Provides a clean, smooth, and non-fatiguing listening experience even at medium and high volume levels.\"},{\"title\":\"Compact Body Design\",\"description\":\"The CNC-machined compact aluminum body is designed to take up minimal space in the vehicle.\"}]', '2026-05-24 22:35:10', ''),
(2, 'sql-4200', 'SQL-4200 Serisi Amplifikatör', 'SQL-4200 Series Amplifier', 'SQL SERİSİ', 'SQL Amplifikatör', 'SQL Amplifier', 'Güçlü ve dinamik ses arayanlar için yüksek performanslı Class-AB amplifikatör.', 'High-performance Class-AB amplifier for those looking for powerful and dynamic sound.', 'uploads/products/1780515368_gal_0_6a208228a1644.png', '[\"uploads\\/products\\/1780515368_gal_0_6a208228a1644.png\",\"uploads\\/products\\/1780516810_main_6a2087ca09c00.png\",\"uploads\\/products\\/1780515368_gal_1_6a208228a1c88.png\",\"uploads\\/products\\/1780515368_gal_2_6a208228a229c.png\"]', 'uploads/products/Beeses-SQL-4200.pdf', '[{\"name\":\"Producing Country\",\"value\":\"Türkiye\"},{\"name\":\"Weight\",\"value\":\"4500 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"62x216x380 mm\"},{\"name\":\"Crossover\",\"value\":\"Low pass-Band pass-High pass (32Hz-4Khz)\"},{\"name\":\"PWM Technology\",\"value\":\"IR mosfet, Cosmo toroidal\"},{\"name\":\"Output Technology\",\"value\":\"Infineon mosfet\"},{\"name\":\"Input Technology\",\"value\":\"Jfet\"},{\"name\":\"Input Empedance\",\"value\":\"22 KΩ\"},{\"name\":\"Input Sensitivity\",\"value\":\"0.3-8 volt\"},{\"name\":\"Frequancy Range\",\"value\":\"10-50.000 Hz\"},{\"name\":\"THD+N\",\"value\":\"% 0.040\"},{\"name\":\"Damping\",\"value\":\"350\"},{\"name\":\"S/N Ratio\",\"value\":\"100\"},{\"name\":\"Power\",\"value\":\"4x300 watt @ 2Ω, 4x150 watt @ 4Ω\"},{\"name\":\"Maximum Current\",\"value\":\"100 amper\"},{\"name\":\"Iddle current\",\"value\":\"1.20 amper\"},{\"name\":\"Voltage Range\",\"value\":\"10.5-16.5 volt\"},{\"name\":\"Class\",\"value\":\"Class-AB\"},{\"name\":\"Channel\",\"value\":\"4\"}]', '[{\"name\":\"Producing Country\",\"value\":\"Turkey\"},{\"name\":\"Weight\",\"value\":\"5100 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"62x216x385 mm\"},{\"name\":\"Crossover\",\"value\":\"Low pass-Band pass-High pass (32Hz-4Khz)\"},{\"name\":\"PWM Technology\",\"value\":\"IR mosfet, Cosmo toroidal\"},{\"name\":\"Output Technology\",\"value\":\"Infineon mosfet\"},{\"name\":\"Input Technology\",\"value\":\"Jfet\"},{\"name\":\"Input Empedance\",\"value\":\"22 KΩ\"},{\"name\":\"Input Sensitivity\",\"value\":\"0.3-8 volt\"},{\"name\":\"Frequancy Range\",\"value\":\"8-50.000 Hz\"},{\"name\":\"THD+N\",\"value\":\"% 0.035 (% 90 power), % 0.027 (10 W)\"},{\"name\":\"Damping\",\"value\":\"350\"},{\"name\":\"S/N Ratio\",\"value\":\"102\"},{\"name\":\"Power\",\"value\":\"4x380 watt @ 2Ω, 4x210 watt @ 4Ω\"},{\"name\":\"Maximum Current\",\"value\":\"120 amper\"},{\"name\":\"Iddle current\",\"value\":\"1.48 amper\"},{\"name\":\"Voltage Range\",\"value\":\"10.5-18 volt\"},{\"name\":\"Class\",\"value\":\"Class-AB\"},{\"name\":\"Channel\",\"value\":\"4\"}]', '[{\"title\":\"Üstün Ses Performansı\",\"description\":\"Yüksek çözünürlüklü bileşenler kullanılarak tasarlanmıştır.\"},{\"title\":\"Kompakt Gövde Tasarımı\",\"description\":\"Isı dağılımını optimize eden alüminyum soğutucu yüzey.\"},{\"title\":\"Altın Kaplamalı RCA Terminalleri\",\"description\":\"Oksitlenmeye karşı dayanıklı uzun ömürlü yapı.\"}]', '[{\"title\":\"High Dynamic Range\",\"description\":\"Offers wide dynamic range and natural sound definition.\"},{\"title\":\"Class-AB Topology\",\"description\":\"Combines linear audio amplification with practical power efficiency.\"},{\"title\":\"Low Heat Dissipation\",\"description\":\"Optimized aluminum chassis design for efficient thermal management.\"}]', '2026-05-24 22:35:10', ''),
(3, 'of-1', 'OF-1 Serisi Amplifikatör', 'OF-1 Series Amplifier', 'OF SERİSİ', 'Odyofil Subwoofer Amplifikatörü', 'Audiophile Stereo Amplifier', 'Yüksek kaliteli pasif ve yarı iletken bileşenlerle tasarlanmış üstün subwoofer performansı.', 'Designed for audiophiles seeking absolute signal purity. Outfitted with premium Sanken output transistors.', 'uploads/products/of1.2.png', '[\"uploads\\/products\\/of1.2.png\",\"uploads\\/products\\/of1.1.png\",\"uploads\\/products\\/of1.3.png\",\"uploads\\/products\\/1780245083_gal_0_6a1c625bc055f.png\"]', 'uploads/products/Beeses-OF-1.pdf', '[{\"name\":\"Producing Country\",\"value\":\"Türkiye\"},{\"name\":\"Weight\",\"value\":\"3420 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"56x165x320 mm\"},{\"name\":\"Crossover\",\"value\":\"none or optional 4-320 Hz low pass\"},{\"name\":\"PWM Technology\",\"value\":\"IR mosfet, Cosmo toroidal\"},{\"name\":\"Output Technology\",\"value\":\"Sanken bipolar transistor\"},{\"name\":\"Input Technology\",\"value\":\"OP series Jfet\"},{\"name\":\"Input Empedance\",\"value\":\"22 KΩ\"},{\"name\":\"Input Sensitivity\",\"value\":\"0.3-8 volt\"},{\"name\":\"Frequancy Range\",\"value\":\"4-24.000 Hz\"},{\"name\":\"THD+N\",\"value\":\"% 0.06 (% 90 power), % 0.003 (10 W)\"},{\"name\":\"Damping\",\"value\":\"400\"},{\"name\":\"S/N Ratio\",\"value\":\"110\"},{\"name\":\"Power\",\"value\":\"1x860 watt @ 2Ω, 1x552 watt @ 4Ω\"},{\"name\":\"Maximum Current\",\"value\":\"100 amper\"},{\"name\":\"Iddle current\",\"value\":\"1.32 amper\"},{\"name\":\"Voltage Range\",\"value\":\"10.5-16.5 volt\"},{\"name\":\"Class\",\"value\":\"Class-AB (bias A)\"},{\"name\":\"Channel\",\"value\":\"mono\"}]', '[{\"name\":\"Producing Country\",\"value\":\"Turkey\"},{\"name\":\"Weight\",\"value\":\"6500 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"62x216x485 mm\"},{\"name\":\"Output Technology\",\"value\":\"Sanken Bipolar Transistor\"},{\"name\":\"Input Technology\",\"value\":\"Matched JFET\"},{\"name\":\"Class\",\"value\":\"Class-AB Audiophile\"},{\"name\":\"Channel\",\"value\":\"2\"}]', '[{\"title\":\"JFET Giriş ve Tampon Katı\",\"description\":\"Yüksek giriş empedansı ve düşük gürültü ile kaynak üniteden gelen sinyalin saflığını korur.\"},{\"title\":\"Geniş Empedans Uyumluluğu\",\"description\":\"Minimum 2 Ohm, maksimum 8 Ohm hoparlör empedansı desteği.\"},{\"title\":\"Sınıf AB (Bias A) Amplifikatör\",\"description\":\"Sınıf A\'nın doğallığı ile Sınıf B\'nin verimliliğini birleştiren mimari.\"},{\"title\":\"Çok Düşük Distorsiyon\",\"description\":\"Son derece düşük toplam harmonik bozulma oranı.\"},{\"title\":\"Kompakt Gövde Tasarımı\",\"description\":\"Araç içinde minimum yer kaplayacak estetik CNC alüminyum tasarım.\"}]', '[{\"title\":\"Sanken Bipolar Transistors\",\"description\":\"High current capability and legendary musical character.\"},{\"title\":\"Matched JFET Input Stage\",\"description\":\"Provides ultra-clean preamp stage and natural soundstage.\"}]', '2026-05-24 22:35:10', ''),
(4, 'of-2', 'OF-2 Serisi Amplifikatör', 'OF-2 Series Amplifier', 'OF SERİSİ', 'Odyofil Stereo Amplifikatör', 'Pure Stereo Amplifier', 'Kusursuz tonal denge ve yüksek güç aktarımı için özel olarak geliştirilmiş stereo amplifikatör.', 'Provides unmatched tonal accuracy and wide imaging for premium component speakers.', 'uploads/products/of2.2.png', '[\"uploads\\/products\\/of2.2.png\",\"uploads\\/products\\/of2.1.png\",\"uploads\\/products\\/of2.3.png\",\"uploads\\/products\\/1780245096_gal_0_6a1c6268bd3d3.png\"]', 'uploads/products/Beeses-OF-2.pdf', '[{\"name\":\"Producing Country\",\"value\":\"Türkiye\"},{\"name\":\"Weight\",\"value\":\"3420 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"56x165x320 mm\"},{\"name\":\"Crossover\",\"value\":\"none or optional\"},{\"name\":\"PWM Technology\",\"value\":\"IR mosfet, Cosmo toroidal\"},{\"name\":\"Output Technology\",\"value\":\"Sanken bipolar transistor\"},{\"name\":\"Input Technology\",\"value\":\"OP series Jfet\"},{\"name\":\"Input Empedance\",\"value\":\"22 KΩ\"},{\"name\":\"Input Sensitivity\",\"value\":\"0.3-8 volt\"},{\"name\":\"Frequancy Range\",\"value\":\"10-30.000 Hz\"},{\"name\":\"THD+N\",\"value\":\"% 0.05\"},{\"name\":\"Damping\",\"value\":\"350\"},{\"name\":\"S/N Ratio\",\"value\":\"105\"},{\"name\":\"Power\",\"value\":\"2x400 watt @ 2Ω, 2x250 watt @ 4Ω\"},{\"name\":\"Maximum Current\",\"value\":\"80 amper\"},{\"name\":\"Iddle current\",\"value\":\"1.20 amper\"},{\"name\":\"Voltage Range\",\"value\":\"10.5-16.5 volt\"},{\"name\":\"Class\",\"value\":\"Class-AB\"},{\"name\":\"Channel\",\"value\":\"2\"}]', '[{\"name\":\"Producing Country\",\"value\":\"Turkey\"},{\"name\":\"Weight\",\"value\":\"5400 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"62x216x415 mm\"},{\"name\":\"Output Technology\",\"value\":\"Sanken Bipolar Transistor\"},{\"name\":\"Class\",\"value\":\"Class-AB Audiophile\"},{\"name\":\"Channel\",\"value\":\"2\"}]', '[{\"title\":\"JFET Giriş Teknolojisi\",\"description\":\"Kusursuz sinyal aktarımı için saf ses.\"},{\"title\":\"Geniş Frekans Tepkisi\",\"description\":\"10 Hz - 30.000 Hz arası geniş frekans aralığı.\"},{\"title\":\"Gelişmiş Soğutma\",\"description\":\"Uzun süreli kullanımlarda optimum performans.\"}]', '[{\"title\":\"Pure Analog Path\",\"description\":\"Zero feedback, fully discrete components in signal path.\"}]', '2026-05-24 22:35:10', ''),
(5, 'petek-stereo', 'PETEK STEREO Serisi Amplifikatör', 'PETEK STEREO Series Amplifier', 'PETEK SERİSİ', 'Petek Stereo Amplifikatör', 'Compact Stereo Amplifier', 'Geniş frekans aralığı ve düşük distorsiyon değerleriyle Hi-Res Audio standardına uygun şaheser.', 'Ultra-efficient, space-saving design featuring high-resolution sound quality.', 'uploads/products/peteksterio1.png', '[\"uploads\\/products\\/peteksterio1.png\",\"uploads\\/products\\/peteksterio2.png\",\"uploads\\/products\\/peteksterio3.png\"]', 'uploads/products/Beeses-Petek-Stereo.pdf', '[{\"name\":\"Producing Country\",\"value\":\"Türkiye\"},{\"name\":\"Weight\",\"value\":\"1770 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"48x225x151 mm\"},{\"name\":\"Crossover\",\"value\":\"none\"},{\"name\":\"PWM Technology\",\"value\":\"IR mosfet, Magnetics toroidal\"},{\"name\":\"Output Technology\",\"value\":\"Sanken bipolar transistor\"},{\"name\":\"Input Technology\",\"value\":\"OPA series bipolar\"},{\"name\":\"Input Empedance\",\"value\":\"22 KΩ\"},{\"name\":\"Input Sensitivity\",\"value\":\"0.3-8 volt\"},{\"name\":\"Frequancy Range\",\"value\":\"8-54.000 Hz\"},{\"name\":\"THD+N\",\"value\":\"% 0.08 (% 90 power), % 0.005 (10 W)\"},{\"name\":\"Damping\",\"value\":\"200\"},{\"name\":\"S/N Ratio\",\"value\":\"110\"},{\"name\":\"Power\",\"value\":\"2x164 watt @ 2Ω, 2x92 watt @ 4Ω\"},{\"name\":\"Maximum Current\",\"value\":\"44 amper\"},{\"name\":\"Iddle current\",\"value\":\"0.72 amper\"},{\"name\":\"Voltage Range\",\"value\":\"10.5-16.5 volt\"},{\"name\":\"Class\",\"value\":\"Class-AB (bias A)\"},{\"name\":\"Channel\",\"value\":\"2\"}]', '[{\"name\":\"Producing Country\",\"value\":\"Turkey\"},{\"name\":\"Class\",\"value\":\"Class-D Ultra-Compact\"},{\"name\":\"Channel\",\"value\":\"2 / 4\"}]', '[{\"title\":\"Hi-Res Audio Standardına Uygun Tasarım\",\"description\":\"Geniş frekans aralığı ve düşük distorsiyon.\"},{\"title\":\"İzole Preamfi ve Amfi Mimarisi\",\"description\":\"Besleme ünitesinden izole edilmiştir, manyetik alan etkisini ve parazitleri en aza indirir.\"},{\"title\":\"Altın Kaplama PCB\",\"description\":\"Sinyal yollarında kullanılan altın kaplama yüzeyleri oksitlenmeyi azaltır.\"},{\"title\":\"Gücü Optimize Eden Altın Kaplama Terminaller\",\"description\":\"Güç giriş terminalleri ve sigorta yuvalarında kullanılan altın kaplama kontaklar.\"},{\"title\":\"Kompakt Gövde Tasarımı\",\"description\":\"CNC ile hassas işlenmiş araç içi estetik uyumlu gövde.\"}]', '[{\"title\":\"Ultra-Compact Size\",\"description\":\"Can fit under seats or small side compartments easily.\"},{\"title\":\"High Efficiency\",\"description\":\"Minimal power draw from vehicle electrical system with warm tonal quality.\"}]', '2026-05-24 22:35:10', ''),
(6, 'petek-mono-block', 'PETEK MONO BLOCK Serisi Amplifikatör', 'PETEK MONO BLOCK Series Amplifikatör', 'PETEK SERİSİ', 'Petek Mono Block Amplifikatör', '', 'Hi-Res bas kontrolü ve saf güç. Odyofiller için tasarlanmış Mono Block amplifikatör.', '', 'uploads/products/petekmono1.png', '[\"uploads\\/products\\/petekmono1.png\",\"uploads\\/products\\/petekmono2.png\",\"uploads\\/products\\/petekmono3.png\"]', 'uploads/products/Beeses-Petek-Mono-Block.pdf', '[{\"name\":\"Producing Country\",\"value\":\"Türkiye\"},{\"name\":\"Weight\",\"value\":\"1850 gr\"},{\"name\":\"Dimensions (HxWxD)\",\"value\":\"48x225x151 mm\"},{\"name\":\"Crossover\",\"value\":\"none or optional\"},{\"name\":\"PWM Technology\",\"value\":\"IR mosfet, Magnetics toroidal\"},{\"name\":\"Output Technology\",\"value\":\"Sanken bipolar transistor\"},{\"name\":\"Input Technology\",\"value\":\"OPA series bipolar\"},{\"name\":\"Input Empedance\",\"value\":\"22 KΩ\"},{\"name\":\"Input Sensitivity\",\"value\":\"0.3-8 volt\"},{\"name\":\"Frequancy Range\",\"value\":\"8-50.000 Hz\"},{\"name\":\"THD+N\",\"value\":\"% 0.05\"},{\"name\":\"Damping\",\"value\":\"300\"},{\"name\":\"S/N Ratio\",\"value\":\"108\"},{\"name\":\"Power\",\"value\":\"1x400 watt @ 2Ω, 1x250 watt @ 4Ω\"},{\"name\":\"Maximum Current\",\"value\":\"60 amper\"},{\"name\":\"Iddle current\",\"value\":\"0.80 amper\"},{\"name\":\"Voltage Range\",\"value\":\"10.5-16.5 volt\"},{\"name\":\"Class\",\"value\":\"Class-AB (bias A)\"},{\"name\":\"Channel\",\"value\":\"mono\"}]', '[]', '[{\"title\":\"İzole Preamfi ve Amfi Mimarisi\",\"description\":\"Daha sessiz bir arka plan ve saf güç çıkışı.\"},{\"title\":\"Altın Kaplama PCB\",\"description\":\"Kayıpları minimize eden sinyal iletimi.\"},{\"title\":\"Gelişmiş Subwoofer Kontrolü\",\"description\":\"Damping faktörü sayesinde kusursuz bas tepkisi.\"}]', '[]', '2026-05-24 22:35:10', '');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `warranties`
--

CREATE TABLE `warranties` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `country` varchar(100) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `invoice_path` varchar(500) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `warranties`
--

INSERT INTO `warranties` (`id`, `product_name`, `serial_number`, `country`, `full_name`, `email`, `phone`, `invoice_path`, `status`, `created_at`) VALUES
(2, 'sadasdsa', 'sadasdasdasd', 'Türkiye', 'Deneme2', 'ahmedbozkurt959@gmail.com', '+90 5388647110', 'uploads/invoices/1779144351_6a0b969f92ae7_AHMETCANBOZKURTTRCV.pdf', 'rejected', '2026-05-18 22:45:51'),
(3, 'asasdasd', 'asdasdasdas', 'Amerika', 'Deneme3', 'deneme@gmail.com', '+1 56565454123', 'uploads/invoices/1779145597_6a0b9b7d5bbce_AHMETCANBOZKURTENCV.pdf', 'rejected', '2026-05-18 23:06:37'),
(4, 'asdasd', 'asdasdasd', 'Türkiye', 'Ahmetcan Bozkurt', 'ahmedbozkurt959@gmail.com', '+90 5388647110', 'uploads/invoices/1779145961_6a0b9ce9602e9_AHMETCANBOZKURTTRCV.pdf', 'rejected', '2026-05-18 23:12:41'),
(5, 'PETEK MONO BLOCK', 'BSS-DTER-2332', 'Türkiye', 'Merve Boztürk', 'mervecan@gmail.com', '+90 5307031834', 'uploads/invoices/1779198286_6a0c694ebc6b3_MS logo.png', 'rejected', '2026-05-19 13:44:46'),
(6, 'PETEK STEREO', 'P220260050', 'Türkiye', 'Ahmetcan Bozkurt', 'ahmedbozkurt959@gmail.com', '+90 5388647110', 'uploads/invoices/1779820786_6a15e8f279c61_Gemini_Generated_Image_qkycfmqkycfmqkyc.png', 'rejected', '2026-05-26 18:39:46'),
(7, 'SQL-4200', 'sadasdasdasd', 'Türkiye', 'asdasd', 'dsadsadsad@gmail.com', '+90 asdasdas', 'uploads/invoices/1779915360_6a175a60f34cc_Distributor List with Homepage and Social Media Info.pdf', 'rejected', '2026-05-27 20:56:01'),
(8, 'SQL-4200', 'asdsadasd', 'Türkiye', 'asdsad', 'ahmedbozkurt959@gmail.com', '+90 asdsadsa', 'uploads/invoices/1779915992_6a175cd820281_BRAX-Composing_Desktop_2560x969.png', 'approved', '2026-05-27 21:06:32'),
(9, 'SQL-4400', '4400', 'Türkiye', 'denemeeee', 'ahmedbozkurt959@gmail.com', '+90 5388647110', 'uploads/invoices/1779917759_6a1763bf1ad97_BRAX-Composing_Desktop_2560x969.png', 'pending', '2026-05-27 21:35:59'),
(10, 'PETEK STEREO', 'P220000000', 'Almanya', 'deneme son ', 'ahmedbozkurt959@gmail.com', '+49 213123213', 'uploads/invoices/1779918082_6a17650229360_Gemini_Generated_Image_378gch378gch378g.png', 'approved', '2026-05-27 21:41:22'),
(11, 'PETEK STEREO', 'P220222222', 'Almanya', 'Garanti Deneme', 'ahmedbozkurt959@gmail.com', '+49 5645454546', 'uploads/invoices/1779978806_6a185236acea5_Gemini_Generated_Image_378gch378gch378g.png', 'approved', '2026-05-28 14:33:26');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `warranty_emails`
--

CREATE TABLE `warranty_emails` (
  `id` int(11) NOT NULL,
  `warranty_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Tablo için indeksler `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `approved_warranties`
--
ALTER TABLE `approved_warranties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `warranty_id` (`warranty_id`);

--
-- Tablo için indeksler `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `distributors`
--
ALTER TABLE `distributors`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `innovations`
--
ALTER TABLE `innovations`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `newsletter_logs`
--
ALTER TABLE `newsletter_logs`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_email` (`email`);

--
-- Tablo için indeksler `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Tablo için indeksler `warranties`
--
ALTER TABLE `warranties`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `warranty_emails`
--
ALTER TABLE `warranty_emails`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=254;

--
-- Tablo için AUTO_INCREMENT değeri `approved_warranties`
--
ALTER TABLE `approved_warranties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Tablo için AUTO_INCREMENT değeri `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Tablo için AUTO_INCREMENT değeri `distributors`
--
ALTER TABLE `distributors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Tablo için AUTO_INCREMENT değeri `innovations`
--
ALTER TABLE `innovations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `newsletter_logs`
--
ALTER TABLE `newsletter_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Tablo için AUTO_INCREMENT değeri `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Tablo için AUTO_INCREMENT değeri `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Tablo için AUTO_INCREMENT değeri `warranties`
--
ALTER TABLE `warranties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Tablo için AUTO_INCREMENT değeri `warranty_emails`
--
ALTER TABLE `warranty_emails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `approved_warranties`
--
ALTER TABLE `approved_warranties`
  ADD CONSTRAINT `approved_warranties_ibfk_1` FOREIGN KEY (`warranty_id`) REFERENCES `warranties` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
