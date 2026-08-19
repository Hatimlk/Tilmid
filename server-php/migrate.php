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

echo json_encode(['message' => 'Migration complete', 'log' => $log, 'next_step' => 'Delete this file from the server now.']);
