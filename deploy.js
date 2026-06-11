const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

async function deploy() {
    // 1. .env Dosyası Kontrolü ve Doğrulama
    if (!process.env.FTP_HOST || !process.env.FTP_USER || !process.env.FTP_PASSWORD) {
        console.error("\n========================================================================");
        console.error("❌ HATA: FTP bilgileri eksik!");
        console.error("Lütfen projenin kök dizinindeki '.env' dosyasını açın ve şu bilgileri girin:");
        console.error("  - FTP_HOST");
        console.error("  - FTP_USER");
        console.error("  - FTP_PASSWORD");
        console.error("========================================================================\n");
        process.exit(1);
    }

    // 2. Derleme (Build) Klasörünün Varlık Kontrolü
    const localDir = path.join(__dirname, "dist/beeses-audio/browser");
    if (!fs.existsSync(localDir)) {
        console.error("\n========================================================================");
        console.error("❌ HATA: Derleme çıktısı bulunamadı!");
        console.error(`Hedef klasör mevcut değil: ${localDir}`);
        console.error("Lütfen 'npm run build:prod' komutunun başarıyla tamamlandığından emin olun.");
        console.error("========================================================================\n");
        process.exit(1);
    }

    const client = new ftp.Client();
    client.ftp.verbose = true; // FTP loglarını detaylı görmek için aktif ediyoruz

    try {
        console.log("\n========================================================================");
        console.log(`🔌 Sunucuya bağlanılıyor: ${process.env.FTP_HOST}...`);
        
        await client.access({
            host: process.env.FTP_HOST,
            port: parseInt(process.env.FTP_PORT || "21"),
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: process.env.FTP_SECURE === "true"
        });

        console.log("✅ Sunucu bağlantısı başarılı!");
        
        const remotePath = process.env.FTP_REMOTE_PATH || "/public_html";
        console.log(`📂 Hedef sunucu klasörü ayarlanıyor/kontrol ediliyor: "${remotePath}"`);
        await client.ensureDir(remotePath);

        console.log(`📤 Dosyalar yükleniyor: "${localDir}" -> "${remotePath}"`);
        console.log("Lütfen işlemin tamamlanmasını bekleyin, bu işlem internet hızınıza bağlı olarak biraz sürebilir...");
        
        // Klasörün tamamını sunucuya senkronize eder
        await client.uploadFromDir(localDir);

        console.log("\n🚀 Tebrikler! FTP Dağıtımı başarıyla tamamlandı!");
        console.log("========================================================================\n");
    } catch (err) {
        console.error("\n========================================================================");
        console.error("❌ HATA: FTP Yükleme işlemi başarısız oldu!");
        console.error("Detay:", err.message || err);
        console.error("Lütfen FTP bilgilerinizi ve internet bağlantınızı kontrol edin.");
        console.error("========================================================================\n");
        process.exit(1);
    } finally {
        client.close();
    }
}

deploy();
