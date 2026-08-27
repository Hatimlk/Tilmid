<?php
/**
 * One-time migration for existing deployments:
 *  1. Creates the login_attempts table (rate limiting) if missing.
 *  2. Renames students.password -> students.password_hash if the old column exists.
 *  3. Hashes any plaintext values left in password_hash (anything not already
 *     a bcrypt digest) with password_hash().
 *
 * Usage: visit /migrate.php?secret=YOUR_MIGRATION_SECRET once after deploying
 * the updated code, then DELETE THIS FILE from the server.
 *
 * MIGRATION_SECRET must be set in server-php/.env.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$expected = require_env('MIGRATION_SECRET');
$provided = $_GET['secret'] ?? '';

if (!hash_equals($expected, (string)$provided)) {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden']);
    exit;
}

$log = [];

// 1. login_attempts table
$pdo->exec("CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_identifier_created (identifier, created_at)
)");
$log[] = 'login_attempts table ensured';

// 2. rename students.password -> password_hash if needed
$cols = $pdo->query("SHOW COLUMNS FROM students")->fetchAll(PDO::FETCH_COLUMN);
if (in_array('password', $cols, true) && !in_array('password_hash', $cols, true)) {
    $pdo->exec("ALTER TABLE students CHANGE COLUMN password password_hash VARCHAR(255)");
    $log[] = 'renamed students.password to students.password_hash';
} elseif (!in_array('password_hash', $cols, true)) {
    $pdo->exec("ALTER TABLE students ADD COLUMN password_hash VARCHAR(255)");
    $log[] = 'added students.password_hash column';
} else {
    $log[] = 'students.password_hash already present';
}

// 3. hash any remaining plaintext passwords
$students = $pdo->query("SELECT id, password_hash FROM students")->fetchAll();
$rehashed = 0;
foreach ($students as $s) {
    $val = $s['password_hash'];
    if ($val !== null && $val !== '' && strpos($val, '$2y$') !== 0) {
        $stmt = $pdo->prepare("UPDATE students SET password_hash = ? WHERE id = ?");
        $stmt->execute([password_hash($val, PASSWORD_DEFAULT), $s['id']]);
        $rehashed++;
    }
}
$log[] = "rehashed $rehashed plaintext student password(s)";

// 4. add students.package (active Mouwakaba coaching pack) if missing
if (!in_array('package', $cols, true)) {
    $pdo->exec("ALTER TABLE students ADD COLUMN package ENUM('essentiel','boost','premium') DEFAULT NULL");
    $log[] = 'added students.package column';
} else {
    $log[] = 'students.package already present';
}

// 5. widen students.status for the admin lifecycle (pending activation / completed / archived)
$statusCol = $pdo->query("SHOW COLUMNS FROM students WHERE Field = 'status'")->fetch();
if ($statusCol && strpos($statusCol['Type'], 'pending_activation') === false) {
    $pdo->exec("ALTER TABLE students MODIFY COLUMN status ENUM('active','pending_activation','suspended','completed','archived') DEFAULT 'active'");
    $log[] = 'widened students.status enum';
} else {
    $log[] = 'students.status already widened';
}

// 6. add students.coach_name (plain text label until a real Coach entity exists) if missing
$cols = $pdo->query("SHOW COLUMNS FROM students")->fetchAll(PDO::FETCH_COLUMN);
if (!in_array('coach_name', $cols, true)) {
    $pdo->exec("ALTER TABLE students ADD COLUMN coach_name VARCHAR(255) DEFAULT NULL");
    $log[] = 'added students.coach_name column';
} else {
    $log[] = 'students.coach_name already present';
}

// 7. widen appointments.status to include 'completed'
$apptStatusCol = $pdo->query("SHOW COLUMNS FROM appointments WHERE Field = 'status'")->fetch();
if ($apptStatusCol && strpos($apptStatusCol['Type'], 'completed') === false) {
    $pdo->exec("ALTER TABLE appointments MODIFY COLUMN status ENUM('confirmed','pending','cancelled','completed') DEFAULT 'confirmed'");
    $log[] = 'widened appointments.status enum';
} else {
    $log[] = 'appointments.status already widened';
}

// 8. activity_log table (powers the admin "Activité récente" widget)
$pdo->exec("CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actor_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_label VARCHAR(255) NOT NULL,
    meta JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
)");
$log[] = 'activity_log table ensured';

// 9. orientation_requests table (pack-selection lead form on the Tawjih page)
$pdo->exec("CREATE TABLE IF NOT EXISTS orientation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    filiere VARCHAR(100),
    city VARCHAR(100),
    bac_year VARCHAR(20),
    regional_grade VARCHAR(20),
    pack VARCHAR(100),
    status ENUM('new', 'contacted', 'enrolled', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");
$log[] = 'orientation_requests table ensured';

echo json_encode(['message' => 'Migration complete', 'log' => $log, 'next_step' => 'Delete this file from the server now.']);
