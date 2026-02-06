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

// 0. ROOT CHECK
if (($request_uri == '/api/' || $request_uri == '/api') && $method == 'GET') {
    echo json_encode(['message' => 'Tilmid API is running', 'version' => '1.0.0']);
    exit;
}

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

// 3. GET POSTS (List)
if (($request_uri == '/api/posts' || $request_uri == '/api/posts/') && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM posts ORDER BY created_at DESC");
    $posts = $stmt->fetchAll();

    // Transform for frontend
    $formattedPosts = array_map(function ($post) {
        $post['image'] = $post['image_url'];
        $post['date'] = date('Y-m-d', strtotime($post['created_at']));
        $post['author'] = [
            'name' => $post['author_name'] ?? 'الأستاذ ياسين',
            'avatar' => $post['author_avatar'] ?? '/assets/yassine-image-DgfyHuCr.png'
        ];
        // Don't need full sections list, but maybe keep it clean
        unset($post['sections']);
        return $post;
    }, $posts);

    echo json_encode($formattedPosts);
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
    $content = $input['content'] ?? ($input['html'] ?? ''); // Fallback to html if content empty
    $excerpt = $input['excerpt'] ?? '';
    $image = $input['image'] ?? '';
    $category = $input['category'] ?? 'Uncategorized';
    $status = $input['status'] ?? 'published';
    $readingTime = $input['readingTime'] ?? '';
    $fileUrl = $input['file_url'] ?? '';
    $contentType = $input['contentType'] ?? 'html';

    // New fields
    $authorName = $input['author']['name'] ?? 'الأستاذ ياسين';
    $authorAvatar = $input['author']['avatar'] ?? '/assets/yassine-image-DgfyHuCr.png';
    $sections = isset($input['sections']) ? json_encode($input['sections']) : null;

    try {
        $stmt = $pdo->prepare("INSERT INTO posts (title, content, excerpt, image_url, category, status, reading_time, file_url, content_type, author_name, author_avatar, sections, views) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)");
        $stmt->execute([$title, $content, $excerpt, $image, $category, $status, $readingTime, $fileUrl, $contentType, $authorName, $authorAvatar, $sections]);

        http_response_code(201);
        echo json_encode(['id' => $pdo->lastInsertId(), 'title' => $title, 'message' => 'Post created successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
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

// 6. GET SINGLE POST
if (preg_match('#/api/posts/(\d+)(/)?$#', $request_uri, $matches) && $method == 'GET') {
    $id = $matches[1];

    // Increment views
    $updateStmt = $pdo->prepare("UPDATE posts SET views = views + 1 WHERE id = ?");
    $updateStmt->execute([$id]);

    // Fetch post
    $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch();

    if ($post) {
        // Transform for frontend
        $post['image'] = $post['image_url']; // Alias
        $post['date'] = date('Y-m-d', strtotime($post['created_at'])); // Format date
        $post['author'] = [
            'name' => $post['author_name'] ?? 'الأستاذ ياسين',
            'avatar' => $post['author_avatar'] ?? '/assets/yassine-image-DgfyHuCr.png'
        ];
        $post['sections'] = json_decode($post['sections'] ?? '[]', true);

        echo json_encode($post);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Post not found']);
    }
    exit;
}

// 6. STUDENTS
if (strpos($request_uri, '/api/students') !== false && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM students ORDER BY join_date DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 7. STORIES
if (strpos($request_uri, '/api/stories') !== false && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM success_stories ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 8. APPOINTMENTS
if (strpos($request_uri, '/api/appointments') !== false && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM appointments ORDER BY date DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 9. MESSAGES
if (strpos($request_uri, '/api/messages') !== false && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 10. RESOURCES
if (strpos($request_uri, '/api/resources') !== false && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM resources ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 11. COACHING REQUESTS
if (strpos($request_uri, '/api/coaching-requests') !== false && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM coaching_requests ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 404
http_response_code(404);
echo json_encode(['message' => 'Not Found', 'uri' => $request_uri]);
?>