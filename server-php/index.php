<?php
require_once __DIR__ . '/config.php';
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';

$secret_key = require_env('JWT_SECRET');

// Parse URL
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Helper for JSON Input
$input = json_decode(file_get_contents('php://input'), true) ?? [];

/* ---------------- AUTH HELPERS ---------------- */

function getBearerToken(): ?string {
    $authHeader = null;
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
    }
    if (!$authHeader && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    }
    if (!$authHeader && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    if ($authHeader && stripos($authHeader, 'Bearer ') === 0) {
        return substr($authHeader, 7);
    }
    return null;
}

function currentUser(string $secret_key): ?array {
    $token = getBearerToken();
    if (!$token) return null;
    return JWT::decode($token, $secret_key);
}

function requireAuth(string $secret_key): array {
    $user = currentUser($secret_key);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        exit;
    }
    return $user;
}

function requireAdmin(string $secret_key): array {
    $user = requireAuth($secret_key);
    if (($user['role'] ?? '') !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden']);
        exit;
    }
    return $user;
}

/* ---------------- RATE LIMITING (login endpoints) ---------------- */

function rateLimited(PDO $pdo, string $identifier, int $maxAttempts = 8, int $windowMinutes = 15): bool {
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) c FROM login_attempts WHERE identifier = ? AND created_at > (NOW() - INTERVAL ? MINUTE)");
        $stmt->execute([$identifier, $windowMinutes]);
        return (int)($stmt->fetch()['c'] ?? 0) >= $maxAttempts;
    } catch (PDOException $e) {
        // If the login_attempts table doesn't exist yet (migration not run), fail open
        // rather than taking the whole login flow down.
        return false;
    }
}

function recordAttempt(PDO $pdo, string $identifier): void {
    try {
        $stmt = $pdo->prepare("INSERT INTO login_attempts (identifier, created_at) VALUES (?, NOW())");
        $stmt->execute([$identifier]);
    } catch (PDOException $e) {
        // ignore if table missing
    }
}

function clientIp(): string {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

// ---------------- ROUTING ---------------- //

// 0. ROOT CHECK
if (($request_uri == '/api/' || $request_uri == '/api') && $method == 'GET') {
    echo json_encode(['message' => 'Tilmid API is running', 'version' => '1.0.0']);
    exit;
}

// 1. LOGIN (admin / general users)
if (strpos($request_uri, '/api/auth/login') !== false && $method == 'POST') {
    $email = trim($input['email'] ?? '');
    $password = (string)($input['password'] ?? '');
    $identifier = clientIp() . '|' . strtolower($email);

    if (rateLimited($pdo, $identifier)) {
        http_response_code(429);
        echo json_encode(['message' => 'Too many attempts. Please try again later.']);
        exit;
    }

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
        recordAttempt($pdo, $identifier);
        http_response_code(400);
        echo json_encode(['message' => 'Invalid credentials']);
    }
    exit;
}

// 1b. STUDENT LOGIN
if (strpos($request_uri, '/api/students/login') !== false && $method == 'POST') {
    $username = trim($input['username'] ?? '');
    $password = (string)($input['password'] ?? '');
    $identifier = clientIp() . '|student|' . strtolower($username);

    if (rateLimited($pdo, $identifier)) {
        http_response_code(429);
        echo json_encode(['message' => 'Too many attempts. Please try again later.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM students WHERE username = ?");
    $stmt->execute([$username]);
    $student = $stmt->fetch();

    if ($student && $student['status'] === 'active' && !empty($student['password_hash']) && password_verify($password, $student['password_hash'])) {
        $payload = [
            'id' => $student['id'],
            'role' => 'student',
            'exp' => time() + (60 * 60 * 24)
        ];
        $token = JWT::encode($payload, $secret_key);
        unset($student['password_hash']);

        echo json_encode(['token' => $token, 'user' => $student]);
    } else {
        recordAttempt($pdo, $identifier);
        http_response_code(400);
        echo json_encode(['message' => 'Invalid credentials']);
    }
    exit;
}

// 1c. CURRENT SESSION (used by the frontend to verify a stored token is still valid)
if (($request_uri == '/api/auth/me') && $method == 'GET') {
    $decoded = requireAuth($secret_key);

    if ($decoded['role'] === 'student') {
        $stmt = $pdo->prepare("SELECT id, name, username, email, grade, join_date, status, avatar_url FROM students WHERE id = ?");
        $stmt->execute([$decoded['id']]);
        $record = $stmt->fetch();
        if (!$record || $record['status'] !== 'active') {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            exit;
        }
        echo json_encode(['role' => 'student'] + $record);
    } else {
        $stmt = $pdo->prepare("SELECT id, username, email, role FROM users WHERE id = ?");
        $stmt->execute([$decoded['id']]);
        $record = $stmt->fetch();
        if (!$record) {
            http_response_code(401);
            echo json_encode(['message' => 'Unauthorized']);
            exit;
        }
        echo json_encode($record);
    }
    exit;
}

// 2. REGISTER
if (strpos($request_uri, '/api/auth/register') !== false && $method == 'POST') {
    $username = trim($input['username'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = (string)($input['password'] ?? '');

    if (!$username || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
        http_response_code(400);
        echo json_encode(['message' => 'Valid username, email and a password of at least 8 characters are required']);
        exit;
    }

    // Check existing
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['message' => 'Email already exists']);
        exit;
    }

    // Registration always creates a plain 'user' - admin accounts are provisioned out-of-band.
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'user')");
    if ($stmt->execute([$username, $email, $hash])) {
        http_response_code(201);
        echo json_encode(['message' => 'User created successfully', 'userId' => $pdo->lastInsertId()]);
    } else {
        http_response_code(500);
        echo json_encode(['message' => 'Register failed']);
    }
    exit;
}

// 3. GET POSTS (List) - public
if (($request_uri == '/api/posts' || $request_uri == '/api/posts/') && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM posts ORDER BY created_at DESC");
    $posts = $stmt->fetchAll();

    $formattedPosts = array_map(function ($post) {
        $post['image'] = $post['image_url'];
        $post['date'] = date('Y-m-d', strtotime($post['created_at']));
        $post['author'] = [
            'name' => $post['author_name'] ?? 'الأستاذ ياسين',
            'avatar' => $post['author_avatar'] ?? '/assets/yassine-image-DgfyHuCr.png'
        ];
        unset($post['sections']);
        return $post;
    }, $posts);

    echo json_encode($formattedPosts);
    exit;
}

// 4. CREATE POST (admin only)
if (strpos($request_uri, '/api/posts') !== false && $method == 'POST') {
    requireAdmin($secret_key);

    $title = $input['title'] ?? '';
    $content = $input['content'] ?? ($input['html'] ?? '');
    $excerpt = $input['excerpt'] ?? '';
    $image = $input['image'] ?? '';
    $category = $input['category'] ?? 'Uncategorized';
    $status = $input['status'] ?? 'published';
    $readingTime = $input['readingTime'] ?? '';
    $fileUrl = $input['file_url'] ?? '';
    $contentType = $input['contentType'] ?? 'html';

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
        echo json_encode(['message' => 'Database error']);
        error_log('Create post failed: ' . $e->getMessage());
    }
    exit;
}

// 5. DELETE POST (admin only)
if (preg_match('#/api/posts/(\d+)#', $request_uri, $matches) && $method == 'DELETE') {
    requireAdmin($secret_key);
    $id = $matches[1];

    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Post deleted']);
    exit;
}

// 6. GET SINGLE POST - public
if (preg_match('#/api/posts/(\d+)(/)?$#', $request_uri, $matches) && $method == 'GET') {
    $id = $matches[1];

    $updateStmt = $pdo->prepare("UPDATE posts SET views = views + 1 WHERE id = ?");
    $updateStmt->execute([$id]);

    $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch();

    if ($post) {
        $post['image'] = $post['image_url'];
        $post['date'] = date('Y-m-d', strtotime($post['created_at']));
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

// 7. STUDENTS (admin only - roster with PII, never includes password_hash)
if (preg_match('#^/api/students/(\d+)$#', $request_uri, $matches) && $method == 'DELETE') {
    requireAdmin($secret_key);
    $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
    $stmt->execute([$matches[1]]);
    echo json_encode(['message' => 'Student deleted']);
    exit;
}

if ($request_uri === '/api/students' && $method == 'GET') {
    requireAdmin($secret_key);
    $stmt = $pdo->query("SELECT id, name, username, email, grade, join_date, status, avatar_url FROM students ORDER BY join_date DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/students' && $method == 'POST') {
    requireAdmin($secret_key);
    $id = $input['id'] ?? null;
    $isUpdate = $id !== null && ctype_digit((string)$id);

    $name = $input['name'] ?? '';
    $username = $input['username'] ?? '';
    $email = $input['email'] ?? null;
    $grade = $input['grade'] ?? '';
    $status = $input['status'] ?? 'active';
    $avatar = $input['avatar'] ?? null;
    $password = $input['password'] ?? null; // optional - only set/changed when provided

    try {
        if ($isUpdate) {
            if ($password) {
                $stmt = $pdo->prepare("UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=?, password_hash=? WHERE id=?");
                $stmt->execute([$name, $username, $email, $grade, $status, $avatar, password_hash($password, PASSWORD_DEFAULT), $id]);
            } else {
                $stmt = $pdo->prepare("UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=? WHERE id=?");
                $stmt->execute([$name, $username, $email, $grade, $status, $avatar, $id]);
            }
            http_response_code(200);
            echo json_encode(['id' => (int)$id, 'message' => 'Student updated']);
        } else {
            $hash = $password ? password_hash($password, PASSWORD_DEFAULT) : null;
            $stmt = $pdo->prepare("INSERT INTO students (name, username, email, grade, status, avatar_url, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $username, $email, $grade, $status, $avatar, $hash]);
            http_response_code(201);
            echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Student created']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Student save failed: ' . $e->getMessage());
    }
    exit;
}

// 8. STORIES - public (shown on the homepage)
if (strpos($request_uri, '/api/stories') !== false && $method == 'GET') {
    $stmt = $pdo->query("SELECT * FROM success_stories ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 9. APPOINTMENTS (admin only)
if (strpos($request_uri, '/api/appointments') !== false && $method == 'GET') {
    requireAdmin($secret_key);
    $stmt = $pdo->query("SELECT * FROM appointments ORDER BY date DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

if (strpos($request_uri, '/api/appointments') !== false && $method == 'POST') {
    requireAdmin($secret_key);
    $studentName = $input['studentName'] ?? '';
    $title = $input['title'] ?? '';
    $date = $input['date'] ?? '';
    $time = $input['time'] ?? '';
    $status = $input['status'] ?? 'confirmed';
    $type = $input['type'] ?? 'live';

    try {
        $stmt = $pdo->prepare("INSERT INTO appointments (student_name, title, date, time, status, type) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$studentName, $title, $date, $time, $status, $type]);
        http_response_code(201);
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Appointment created']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Create appointment failed: ' . $e->getMessage());
    }
    exit;
}

// 10. MESSAGES (contact form: POST public / GET admin-only)
if (strpos($request_uri, '/api/messages') !== false) {
    if ($method == 'GET') {
        requireAdmin($secret_key);
        $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    }
    if ($method == 'POST') {
        $name = $input['name'] ?? '';
        $phone = $input['phone'] ?? '';
        $type = $input['type'] ?? ($input['goal'] ?? 'General');
        $message = $input['message'] ?? '';

        try {
            $stmt = $pdo->prepare("INSERT INTO contact_messages (name, phone, type, message) VALUES (?, ?, ?, ?)");
            $stmt->execute([$name, $phone, $type, $message]);

            http_response_code(201);
            echo json_encode(['message' => 'Message saved successfully', 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Database error']);
            error_log('Save message failed: ' . $e->getMessage());
        }
        exit;
    }
}

// 11. RESOURCES - any authenticated user (students need this for their library view)
if (strpos($request_uri, '/api/resources') !== false && $method == 'GET') {
    requireAuth($secret_key);
    $stmt = $pdo->query("SELECT * FROM resources ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 12. COACHING REQUESTS (POST public lead form / GET admin-only)
if (strpos($request_uri, '/api/coaching-requests') !== false) {
    if ($method == 'GET') {
        requireAdmin($secret_key);
        $stmt = $pdo->query("SELECT * FROM coaching_requests ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    }
    if ($method == 'POST') {
        $name = $input['name'] ?? '';
        $phone = $input['phone'] ?? '';
        $grade = $input['grade'] ?? '';

        try {
            $stmt = $pdo->prepare("INSERT INTO coaching_requests (name, phone, grade) VALUES (?, ?, ?)");
            $stmt->execute([$name, $phone, $grade]);

            http_response_code(201);
            echo json_encode(['message' => 'Request saved successfully', 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Database error']);
            error_log('Save coaching request failed: ' . $e->getMessage());
        }
        exit;
    }
}

// 404
http_response_code(404);
echo json_encode(['message' => 'Not Found']);
?>