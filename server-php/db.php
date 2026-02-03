<?php
// Database Config (Adjust these for Production)
$host = 'localhost';
$dbname = 'tilmide1_tilmid_db'; // Change in prod
$username = 'tilmide1_yassine'; // Change in prod
$password = 'Tilmide@2026@';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
?>