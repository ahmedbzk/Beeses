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
        
        // 3. Frontend (Angular) Dosyalarını Yükle
        const remotePath = process.env.FTP_REMOTE_PATH || "/public_html";
        console.log(`📂 Hedef sunucu klasörü ayarlanıyor/kontrol ediliyor: "${remotePath}"`);
        await client.ensureDir(remotePath);

        console.log(`📤 Frontend dosyaları yükleniyor: "${localDir}" -> "${remotePath}"`);
        console.log("Lütfen işlemin tamamlanmasını bekleyin...");
        await client.uploadFromDir(localDir);
        console.log("✅ Frontend başarıyla yüklendi!");

        // 4. Backend (PHP API) Dosyalarını Yükle
        const localBackendDir = path.join(__dirname, "src/backend/api");
        const remoteBackendPath = path.posix.join(remotePath, "backend/api");
        
        if (fs.existsSync(localBackendDir)) {
            console.log(`\n📂 Backend hedef klasörü ayarlanıyor/kontrol ediliyor: "${remoteBackendPath}"`);
            await client.ensureDir(remoteBackendPath);

            console.log(`📤 Backend dosyaları yükleniyor: "${localBackendDir}" -> "${remoteBackendPath}"`);
            await client.uploadFromDir(localBackendDir);
            console.log("✅ Backend API başarıyla yüklendi!");
        } else {
            console.warn(`⚠️ UYARI: Yerel backend dizini bulunamadı: ${localBackendDir}`);
        }

        console.log("\n🚀 Tebrikler! Tüm FTP Dağıtım işlemleri başarıyla tamamlandı!");
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
