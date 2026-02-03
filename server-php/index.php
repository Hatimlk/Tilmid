<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';

$secret_key = 'your_super_secret_key_123'; // Replace in prod

// Parse URL
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Helper for JSON Input
$input = json_decode(file_get_contents('php://input'), true);

// ---------------- ROUTING ---------------- //

// 1. LOGIN
if (strpos($request_uri, '/api/auth/login') !== false && $method == 'POST') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        $payload = [
            'id' => $user['id'],
            'role' => $user['role'],
            'exp' => time() + (60 * 60 * 24) // 1 day
        ];
        $token = JWT::encode($payload, $secret_key);

        echo json_encode([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]);
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid credentials']);
    }
    exit;
}

// 2. REGISTER
if (strpos($request_uri, '/api/auth/register') !== false && $method == 'POST') {
    $username = $input['username'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    // Check existing
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['message' => 'Email already exists']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
    if ($stmt->execute([$username, $email, $hash])) {
        http_response_code(201);
        echo json_encode(['message' => 'User created successfully', 'userId' => $pdo->lastInsertId()]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Register failed']);
    }
    exit;
}

// 3. GET POSTS
if (strpos($request_uri, '/api/posts') !== false && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM posts ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 4. CREATE POST (Protected)
if (strpos($request_uri, '/api/posts') !== false && $method == 'POST') {
    // Verify Token
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    $token = str_replace('Bearer ', '', $authHeader);

    $decoded = JWT::decode($token, $secret_key);
    if (!$decoded) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        exit;
    }

    $title = $input['title'] ?? '';
    $content = $input['content'] ?? '';
    $excerpt = $input['excerpt'] ?? '';
    $image = $input['image'] ?? '';

    $stmt = $pdo->prepare("INSERT INTO posts (title, content, excerpt, image_url) VALUES (?, ?, ?, ?)");
    if ($stmt->execute([$title, $content, $excerpt, $image])) {
        http_response_code(201);
        echo json_encode(['id' => $pdo->lastInsertId(), 'title' => $title]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to create post']);
    }
    exit;
}

// 5. DELETE POST (Protected)
if (preg_match('#/api/posts/(\d+)#', $request_uri, $matches) && $method == 'DELETE') {
    $id = $matches[1];

    // Verify Token (Should ideally check admin role too)
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    $token = str_replace('Bearer ', '', $authHeader);

    if (!JWT::decode($token, $secret_key)) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Post deleted']);
    exit;
}

// 404
http_response_code(404);
echo json_encode(['message' => 'Not Found', 'uri' => $request_uri]);
?>