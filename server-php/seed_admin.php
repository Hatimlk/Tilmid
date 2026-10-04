<?php
/**
 * One-time admin provisioning script.
 *
 * The previous version of this file had NO authentication and echoed the
 * admin password back in the HTTP response - anyone who requested the URL
 * could read or reset the live admin password. This version:
 *  - requires a secret shared via server-php/.env (MIGRATION_SECRET)
 *  - reads the password from server-php/.env (ADMIN_BOOTSTRAP_PASSWORD),
 *    never hardcodes or echoes it
 *
 * Usage: set ADMIN_EMAIL / ADMIN_BOOTSTRAP_PASSWORD in server-php/.env, then
 * send one POST to /seed_admin.php with the header
 *   X-Setup-Secret: <MIGRATION_SECRET>
 * (e.g. curl -X POST -H "X-Setup-Secret: ..." https://tilmide.ma/api/seed_admin.php).
 * The secret is never accepted in the URL: query strings end up in server access logs.
 * DELETE THIS FILE from the server immediately afterward.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

$expected = require_env('MIGRATION_SECRET');
if (isset($_GET['secret'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Send the secret in the X-Setup-Secret header, not the URL']);
    exit;
}
$provided = $_SERVER['HTTP_X_SETUP_SECRET'] ?? '';

if (!hash_equals($expected, (string)$provided)) {
    http_response_code(403);
    echo json_encode(['message' => 'Forbidden']);
    exit;
}

$username = env('ADMIN_USERNAME', 'Admin User');
$email = require_env('ADMIN_EMAIL');
$password = require_env('ADMIN_BOOTSTRAP_PASSWORD');

if (strlen($password) < 12) {
    http_response_code(400);
    echo json_encode(['message' => 'ADMIN_BOOTSTRAP_PASSWORD must be at least 12 characters']);
    exit;
}

$password_hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        $update = $pdo->prepare("UPDATE users SET password_hash = ?, role = 'admin' WHERE email = ?");
        $update->execute([$password_hash, $email]);
        echo json_encode(['message' => "Admin user ($email) password updated."]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'admin')");
        $stmt->execute([$username, $email, $password_hash]);
        echo json_encode(['message' => "Admin user ($email) created."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error']);
    error_log('seed_admin failed: ' . $e->getMessage());
}
