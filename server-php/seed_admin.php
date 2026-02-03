<?php
require_once 'db.php';

$username = 'Admin User';
$email = 'admin@tilmide.ma'; // Custom Admin Email
$password = 'Yassine$2026@';

// Hash the password
$password_hash = password_hash($password, PASSWORD_DEFAULT);
$role = 'admin';

try {
    // Check if exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        // Update existing user's password
        $updateAuth = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
        $updateAuth->execute([$password_hash, $email]);
        echo "Admin user ($email) validated.<br>";
        echo "Password UPDATED to: <b>$password</b>";
    } else {
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $email, $password_hash, $role]);
        echo "Success! Admin user created.<br>";
        echo "Email: <b>$email</b><br>";
        echo "Password: <b>$password</b><br>";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>