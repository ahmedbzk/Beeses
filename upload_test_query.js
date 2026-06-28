const ftp = require("basic-ftp");
require("dotenv").config();

async function run() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: process.env.FTP_HOST,
            port: parseInt(process.env.FTP_PORT || "21"),
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
            secure: process.env.FTP_SECURE === "true"
        });

        const localPath = "c:/Users/ahmed/Desktop/beeses-audio/src/backend/api/test_query.php";
        const remotePath = "/httpdocs/backend/api/test_query.php";
        console.log(`Uploading file: ${localPath} -> ${remotePath}`);
        await client.uploadFrom(localPath, remotePath);
        console.log("Upload successful!");
    } catch (err) {
        console.error("Upload failed:", err.message || err);
    } finally {
        client.close();
    }
}

run();
