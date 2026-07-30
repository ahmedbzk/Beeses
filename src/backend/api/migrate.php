<?php
require_once __DIR__ . '/db.php';

try {
    $sql = "ALTER TABLE distributor_applications 
            DROP COLUMN address,
            DROP COLUMN contact_phone,
            DROP COLUMN brands_represented,
            DROP COLUMN years_in_business,
            DROP COLUMN market_focus,
            DROP COLUMN regions_covered,
            DROP COLUMN installation_team,
            DROP COLUMN showroom_space,
            DROP COLUMN customer_base,
            DROP COLUMN marketing_channels,
            DROP COLUMN experience_audio,
            ADD COLUMN group1_info TEXT AFTER contact_email,
            ADD COLUMN group2_info TEXT AFTER group1_info,
            ADD COLUMN group3_info TEXT AFTER group2_info";
            
    $pdo->exec($sql);
    echo "Migration completed successfully.\n";
} catch(PDOException $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
}
?>
