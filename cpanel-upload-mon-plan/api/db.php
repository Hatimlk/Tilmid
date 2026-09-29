<?php
require_once __DIR__ . '/config.php';

$host = env('DB_HOST', 'localhost');
$dbname = require_env('DB_NAME');
$username = require_env('DB_USER');
$password = require_env('DB_PASSWORD');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    // Never leak DB connection details (host/user) in the response.
    echo json_encode(['message' => 'Database connection failed']);
    error_log('DB connection failed: ' . $e->getMessage());
    exit;
}
?>