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

// Student module routes (plan, goals, revisions, habits, error log, checkins,
// timetable) are readable by the owning student OR an admin (?studentId=),
// but writable only by the owning student — admin access there is read-only,
// matching the "aperçu lecture seule" the StudentDetail tabs promise.
function requireStudentOrAdmin(string $secret_key): array {
    $user = requireAuth($secret_key);
    $role = $user['role'] ?? '';
    if ($role !== 'student' && $role !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden']);
        exit;
    }
    return $user;
}

function requireStudent(string $secret_key): array {
    $user = requireAuth($secret_key);
    if (($user['role'] ?? '') !== 'student') {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden']);
        exit;
    }
    return $user;
}

// Resolves which student's data a GET should return: the caller's own id for
// a student, or the ?studentId= query param for an admin. Exits with a 400
// itself when an admin omits studentId.
function resolveStudentId(array $user): int {
    if (($user['role'] ?? '') === 'student') return (int)$user['id'];
    $studentId = isset($_GET['studentId']) ? (int)$_GET['studentId'] : 0;
    if (!$studentId) {
        http_response_code(400);
        echo json_encode(['message' => 'studentId query param required']);
        exit;
    }
    return $studentId;
}

/* ---------------- ACTIVITY LOG ---------------- */
// Best-effort: a logging failure (e.g. migration not run yet) must never break
// the underlying student/appointment action, so failures are swallowed.
function logActivity(PDO $pdo, array $actor, string $action, string $entityType, string $entityLabel, ?array $meta = null): void {
    try {
        $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
        $stmt->execute([$actor['id'] ?? 0]);
        $actorName = $stmt->fetch()['username'] ?? 'Admin';
        $stmt = $pdo->prepare("INSERT INTO activity_log (actor_name, action, entity_type, entity_label, meta) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$actorName, $action, $entityType, $entityLabel, $meta ? json_encode($meta) : null]);
    } catch (PDOException $e) {
        error_log('Activity log insert failed: ' . $e->getMessage());
    }
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
        $stmt = $pdo->prepare("SELECT id, name, username, email, grade, join_date, status, avatar_url, package FROM students WHERE id = ?");
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
    $stmt = $pdo->query("SELECT id, name, username, email, grade, join_date, status, avatar_url, package, coach_name FROM students ORDER BY join_date DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/students' && $method == 'POST') {
    $admin = requireAdmin($secret_key);
    $id = $input['id'] ?? null;
    $isUpdate = $id !== null && ctype_digit((string)$id);

    $name = $input['name'] ?? '';
    $username = $input['username'] ?? '';
    $email = $input['email'] ?? null;
    $grade = $input['grade'] ?? '';
    $status = $input['status'] ?? 'active';
    $avatar = $input['avatar'] ?? null;
    $password = $input['password'] ?? null; // optional - only set/changed when provided
    $validPackages = ['essentiel', 'boost', 'premium'];
    $package = in_array($input['package'] ?? null, $validPackages, true) ? $input['package'] : null;
    $coachName = $input['coachName'] ?? null;

    try {
        if ($isUpdate) {
            $stmt = $pdo->prepare("SELECT status, package FROM students WHERE id = ?");
            $stmt->execute([$id]);
            $existing = $stmt->fetch();

            if ($password) {
                $stmt = $pdo->prepare("UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=?, password_hash=?, package=?, coach_name=? WHERE id=?");
                $stmt->execute([$name, $username, $email, $grade, $status, $avatar, password_hash($password, PASSWORD_DEFAULT), $package, $coachName, $id]);
            } else {
                $stmt = $pdo->prepare("UPDATE students SET name=?, username=?, email=?, grade=?, status=?, avatar_url=?, package=?, coach_name=? WHERE id=?");
                $stmt->execute([$name, $username, $email, $grade, $status, $avatar, $package, $coachName, $id]);
            }

            if ($existing && $existing['package'] !== $package) {
                logActivity($pdo, $admin, 'package_changed', 'student', $name, ['from' => $existing['package'], 'to' => $package]);
            }
            if ($existing && $existing['status'] !== $status) {
                logActivity($pdo, $admin, 'status_changed', 'student', $name, ['from' => $existing['status'], 'to' => $status]);
            }

            http_response_code(200);
            echo json_encode(['id' => (int)$id, 'message' => 'Student updated']);
        } else {
            $hash = $password ? password_hash($password, PASSWORD_DEFAULT) : null;
            $stmt = $pdo->prepare("INSERT INTO students (name, username, email, grade, status, avatar_url, password_hash, package, coach_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $username, $email, $grade, $status, $avatar, $hash, $package, $coachName]);
            logActivity($pdo, $admin, 'student_created', 'student', $name, ['package' => $package]);
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

if (preg_match('#^/api/appointments/(\d+)$#', $request_uri, $matches) && $method == 'DELETE') {
    requireAdmin($secret_key);
    $stmt = $pdo->prepare("DELETE FROM appointments WHERE id = ?");
    $stmt->execute([$matches[1]]);
    echo json_encode(['message' => 'Appointment deleted']);
    exit;
}

if (strpos($request_uri, '/api/appointments') !== false && $method == 'POST') {
    $admin = requireAdmin($secret_key);
    $id = $input['id'] ?? null;
    $isUpdate = $id !== null && ctype_digit((string)$id);

    if ($isUpdate) {
        $stmt = $pdo->prepare("SELECT * FROM appointments WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();
        if (!$existing) {
            http_response_code(404);
            echo json_encode(['message' => 'Appointment not found']);
            exit;
        }

        $studentName = $input['studentName'] ?? $existing['student_name'];
        $title = $input['title'] ?? $existing['title'];
        $date = $input['date'] ?? $existing['date'];
        $time = $input['time'] ?? $existing['time'];
        $status = $input['status'] ?? $existing['status'];
        $type = $input['type'] ?? $existing['type'];
        $studentId = array_key_exists('studentId', $input) ? $input['studentId'] : $existing['student_id'];
        $category = array_key_exists('category', $input) ? $input['category'] : $existing['category'];
        $notes = array_key_exists('notes', $input) ? $input['notes'] : $existing['notes'];

        try {
            $stmt = $pdo->prepare("UPDATE appointments SET student_name=?, title=?, date=?, time=?, status=?, type=?, student_id=?, category=?, notes=? WHERE id=?");
            $stmt->execute([$studentName, $title, $date, $time, $status, $type, $studentId ?: null, $category ?: null, $notes, $id]);
            if ($existing['status'] !== $status) {
                logActivity($pdo, $admin, 'appointment_status_changed', 'appointment', $title, ['student' => $studentName, 'from' => $existing['status'], 'to' => $status]);
            }
            echo json_encode(['id' => (int)$id, 'message' => 'Appointment updated']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Database error']);
            error_log('Update appointment failed: ' . $e->getMessage());
        }
        exit;
    }

    $studentName = $input['studentName'] ?? '';
    $title = $input['title'] ?? '';
    $date = $input['date'] ?? '';
    $time = $input['time'] ?? '';
    $status = $input['status'] ?? 'confirmed';
    $type = $input['type'] ?? 'live';
    $studentId = $input['studentId'] ?? null;
    $category = $input['category'] ?? null;
    $notes = $input['notes'] ?? null;

    try {
        $stmt = $pdo->prepare("INSERT INTO appointments (student_name, title, date, time, status, type, student_id, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$studentName, $title, $date, $time, $status, $type, $studentId ?: null, $category ?: null, $notes]);
        $newId = $pdo->lastInsertId();
        logActivity($pdo, $admin, 'appointment_created', 'appointment', $title, ['student' => $studentName, 'date' => $date, 'time' => $time]);
        http_response_code(201);
        echo json_encode(['id' => $newId, 'message' => 'Appointment created']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Create appointment failed: ' . $e->getMessage());
    }
    exit;
}

// 9b. ACTIVITY LOG (admin only, read-only feed for the dashboard)
if ($request_uri === '/api/activity' && $method == 'GET') {
    requireAdmin($secret_key);
    $stmt = $pdo->query("SELECT id, actor_name, action, entity_type, entity_label, meta, created_at FROM activity_log ORDER BY created_at DESC LIMIT 30");
    echo json_encode($stmt->fetchAll());
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

// 13. ORIENTATION REQUESTS (POST public pack-selection form / GET admin-only)
if (strpos($request_uri, '/api/orientation-requests') !== false) {
    if ($method == 'GET') {
        requireAdmin($secret_key);
        $stmt = $pdo->query("SELECT * FROM orientation_requests ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    }
    if ($method == 'POST') {
        $name = $input['name'] ?? '';
        $phone = $input['phone'] ?? '';
        $filiere = $input['filiere'] ?? '';
        $city = $input['city'] ?? '';
        $bacYear = $input['bacYear'] ?? '';
        $regionalGrade = $input['regionalGrade'] ?? '';
        $pack = $input['pack'] ?? '';

        try {
            $stmt = $pdo->prepare("INSERT INTO orientation_requests (name, phone, filiere, city, bac_year, regional_grade, pack) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $phone, $filiere, $city, $bacYear, $regionalGrade, $pack]);

            http_response_code(201);
            echo json_encode(['message' => 'Request saved successfully', 'id' => $pdo->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Database error']);
            error_log('Save orientation request failed: ' . $e->getMessage());
        }
        exit;
    }
}

// 14. SELF-GUIDED PLAN (Mon Plan) — one row per student
if ($request_uri === '/api/plan' && $method == 'GET') {
    $user = requireStudentOrAdmin($secret_key);
    $studentId = resolveStudentId($user);
    $stmt = $pdo->prepare("SELECT * FROM self_guided_plans WHERE student_id = ?");
    $stmt->execute([$studentId]);
    $row = $stmt->fetch();
    if ($row) {
        $row['actions'] = json_decode($row['actions'] ?? '[]', true);
        $row['habits'] = json_decode($row['habits'] ?? '[]', true);
    }
    echo json_encode($row ?: null);
    exit;
}

if ($request_uri === '/api/plan' && $method == 'POST') {
    $user = requireStudent($secret_key);
    $objective = $input['objective'] ?? '';
    $startDate = $input['startDate'] ?? '';
    $obstacles = $input['obstacles'] ?? '';
    $actions = json_encode($input['actions'] ?? []);
    $habits = json_encode($input['habits'] ?? []);

    try {
        $stmt = $pdo->prepare("INSERT INTO self_guided_plans (student_id, objective, start_date, obstacles, actions, habits)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE objective=VALUES(objective), start_date=VALUES(start_date),
               obstacles=VALUES(obstacles), actions=VALUES(actions), habits=VALUES(habits)");
        $stmt->execute([$user['id'], $objective, $startDate, $obstacles, $actions, $habits]);
        echo json_encode(['message' => 'Plan saved']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Save plan failed: ' . $e->getMessage());
    }
    exit;
}

// 15. GOALS (Objectifs, in Mes outils)
if ($request_uri === '/api/goals' && $method == 'GET') {
    $user = requireStudentOrAdmin($secret_key);
    $studentId = resolveStudentId($user);
    $stmt = $pdo->prepare("SELECT * FROM goals WHERE student_id = ? ORDER BY created_at DESC");
    $stmt->execute([$studentId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/goals' && $method == 'POST') {
    $user = requireStudent($secret_key);
    $id = $input['id'] ?? null;
    $title = $input['title'] ?? '';
    $category = $input['category'] ?? null;
    $targetDate = $input['targetDate'] ?? null;
    $progress = $input['progress'] ?? 0;
    $status = $input['status'] ?? 'a_demarrer';
    $nextAction = $input['nextAction'] ?? null;

    try {
        if ($id) {
            $stmt = $pdo->prepare("UPDATE goals SET title=?, category=?, target_date=?, progress=?, status=?, next_action=? WHERE id=? AND student_id=?");
            $stmt->execute([$title, $category, $targetDate, $progress, $status, $nextAction, $id, $user['id']]);
            echo json_encode(['id' => (int)$id, 'message' => 'Goal updated']);
        } else {
            $stmt = $pdo->prepare("INSERT INTO goals (student_id, title, category, target_date, progress, status, next_action) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$user['id'], $title, $category, $targetDate, $progress, $status, $nextAction]);
            http_response_code(201);
            echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Goal created']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Save goal failed: ' . $e->getMessage());
    }
    exit;
}

if (preg_match('#^/api/goals/(\d+)$#', $request_uri, $matches) && $method == 'DELETE') {
    $user = requireStudent($secret_key);
    $stmt = $pdo->prepare("DELETE FROM goals WHERE id = ? AND student_id = ?");
    $stmt->execute([$matches[1], $user['id']]);
    echo json_encode(['message' => 'Goal deleted']);
    exit;
}

// 16. REVISION SESSIONS (Suivi des révisions)
if ($request_uri === '/api/revisions' && $method == 'GET') {
    $user = requireStudentOrAdmin($secret_key);
    $studentId = resolveStudentId($user);
    $stmt = $pdo->prepare("SELECT * FROM revision_sessions WHERE student_id = ? ORDER BY session_date DESC");
    $stmt->execute([$studentId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/revisions' && $method == 'POST') {
    $user = requireStudent($secret_key);
    $subject = $input['subject'] ?? '';
    $chapter = $input['chapter'] ?? null;
    $durationMin = $input['durationMin'] ?? 0;
    $technique = $input['technique'] ?? null;
    $understanding = $input['understanding'] ?? 3;

    try {
        $stmt = $pdo->prepare("INSERT INTO revision_sessions (student_id, subject, chapter, duration_min, technique, understanding) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user['id'], $subject, $chapter, $durationMin, $technique, $understanding]);
        http_response_code(201);
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Revision session created']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Save revision failed: ' . $e->getMessage());
    }
    exit;
}

if (preg_match('#^/api/revisions/(\d+)$#', $request_uri, $matches) && $method == 'DELETE') {
    $user = requireStudent($secret_key);
    $stmt = $pdo->prepare("DELETE FROM revision_sessions WHERE id = ? AND student_id = ?");
    $stmt->execute([$matches[1], $user['id']]);
    echo json_encode(['message' => 'Revision session deleted']);
    exit;
}

// 17. HABITS (Habit tracker)
if ($request_uri === '/api/habits' && $method == 'GET') {
    $user = requireStudentOrAdmin($secret_key);
    $studentId = resolveStudentId($user);
    $stmt = $pdo->prepare("SELECT * FROM habits WHERE student_id = ? ORDER BY created_at ASC");
    $stmt->execute([$studentId]);
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) { $row['days'] = json_decode($row['days'] ?? '[]', true); }
    echo json_encode($rows);
    exit;
}

if ($request_uri === '/api/habits' && $method == 'POST') {
    $user = requireStudent($secret_key);
    $id = $input['id'] ?? null;
    $name = $input['name'] ?? '';
    $days = json_encode($input['days'] ?? [false, false, false, false, false, false, false]);

    try {
        if ($id) {
            $stmt = $pdo->prepare("UPDATE habits SET name=?, days=? WHERE id=? AND student_id=?");
            $stmt->execute([$name, $days, $id, $user['id']]);
            echo json_encode(['id' => (int)$id, 'message' => 'Habit updated']);
        } else {
            $stmt = $pdo->prepare("INSERT INTO habits (student_id, name, days) VALUES (?, ?, ?)");
            $stmt->execute([$user['id'], $name, $days]);
            http_response_code(201);
            echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Habit created']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Save habit failed: ' . $e->getMessage());
    }
    exit;
}

if (preg_match('#^/api/habits/(\d+)$#', $request_uri, $matches) && $method == 'DELETE') {
    $user = requireStudent($secret_key);
    $stmt = $pdo->prepare("DELETE FROM habits WHERE id = ? AND student_id = ?");
    $stmt->execute([$matches[1], $user['id']]);
    echo json_encode(['message' => 'Habit deleted']);
    exit;
}

// 18. ERROR LOG (Mon Error Log)
if ($request_uri === '/api/error-log' && $method == 'GET') {
    $user = requireStudentOrAdmin($secret_key);
    $studentId = resolveStudentId($user);
    $stmt = $pdo->prepare("SELECT * FROM error_log_entries WHERE student_id = ? ORDER BY created_at DESC");
    $stmt->execute([$studentId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

// 19. CHECK-INS
if ($request_uri === '/api/checkins' && $method == 'GET') {
    $user = requireStudentOrAdmin($secret_key);
    $studentId = resolveStudentId($user);
    $stmt = $pdo->prepare("SELECT * FROM checkins WHERE student_id = ? ORDER BY created_at DESC");
    $stmt->execute([$studentId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/checkins' && $method == 'POST') {
    $user = requireStudent($secret_key);
    $adherence = $input['adherence'] ?? null;
    $daysRespected = $input['daysRespected'] ?? null;
    $obstacle = $input['obstacle'] ?? null;
    $concentration = $input['concentration'] ?? null;
    $success = $input['success'] ?? null;
    $needsAdjustment = !empty($input['needsAdjustment']) ? 1 : 0;

    try {
        $stmt = $pdo->prepare("INSERT INTO checkins (student_id, adherence, days_respected, obstacle, concentration, success, needs_adjustment) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user['id'], $adherence, $daysRespected, $obstacle, $concentration, $success, $needsAdjustment]);
        $newId = $pdo->lastInsertId();
        logActivity($pdo, $user, 'checkin_submitted', 'checkin', 'Check-in', ['adherence' => $adherence, 'daysRespected' => $daysRespected]);
        http_response_code(201);
        echo json_encode(['id' => $newId, 'message' => 'Check-in created']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Save check-in failed: ' . $e->getMessage());
    }
    exit;
}

// 20. TIMETABLE (Mon planning)
if ($request_uri === '/api/timetable' && $method == 'GET') {
    $user = requireStudentOrAdmin($secret_key);
    $studentId = resolveStudentId($user);
    $stmt = $pdo->prepare("SELECT * FROM timetable_tasks WHERE student_id = ? ORDER BY created_at ASC");
    $stmt->execute([$studentId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/timetable' && $method == 'POST') {
    $user = requireStudent($secret_key);
    $subject = $input['subject'] ?? '';
    $day = $input['day'] ?? '';
    $startTime = $input['startTime'] ?? '';
    $endTime = $input['endTime'] ?? '';

    try {
        $stmt = $pdo->prepare("INSERT INTO timetable_tasks (student_id, subject, day, start_time, end_time) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$user['id'], $subject, $day, $startTime, $endTime]);
        http_response_code(201);
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Timetable task created']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Save timetable task failed: ' . $e->getMessage());
    }
    exit;
}

if (preg_match('#^/api/timetable/(\d+)$#', $request_uri, $matches) && $method == 'DELETE') {
    $user = requireStudent($secret_key);
    $stmt = $pdo->prepare("DELETE FROM timetable_tasks WHERE id = ? AND student_id = ?");
    $stmt->execute([$matches[1], $user['id']]);
    echo json_encode(['message' => 'Timetable task deleted']);
    exit;
}

// 21. UPLOAD (admin only) — ?kind=document (PDF/DOC/DOCX, default) or ?kind=video
// (MP4/WEBM/MOV). Files land under server-php/uploads/{documents,videos}/ and
// are served back as static files by Apache (see server-php/.htaccess), never
// re-entering this router.
if ($request_uri === '/api/upload' && $method == 'POST') {
    requireAdmin($secret_key);

    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['message' => 'Aucun fichier reçu ou erreur d\'upload']);
        exit;
    }

    $kind = ($_GET['kind'] ?? 'document') === 'video' ? 'video' : 'document';
    $allowedExtensions = $kind === 'video'
        ? ['mp4', 'webm', 'mov']
        : ['pdf', 'doc', 'docx'];
    $maxBytes = $kind === 'video' ? 500 * 1024 * 1024 : 20 * 1024 * 1024;

    $originalName = $_FILES['file']['name'];
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    if (!in_array($ext, $allowedExtensions, true)) {
        http_response_code(400);
        echo json_encode(['message' => 'Type de fichier non autorisé']);
        exit;
    }
    if ($_FILES['file']['size'] > $maxBytes) {
        http_response_code(400);
        echo json_encode(['message' => 'Fichier trop volumineux']);
        exit;
    }

    $subdir = $kind === 'video' ? 'videos' : 'documents';
    $uploadDir = __DIR__ . '/uploads/' . $subdir . '/';
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
        http_response_code(500);
        echo json_encode(['message' => 'Impossible de créer le dossier de destination']);
        exit;
    }

    $filename = $kind . '-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $ext;

    if (!move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . $filename)) {
        http_response_code(500);
        echo json_encode(['message' => 'Échec de l\'upload']);
        exit;
    }

    http_response_code(201);
    echo json_encode([
        'message' => 'File uploaded',
        'url' => '/api/uploads/' . $subdir . '/' . $filename,
        'size' => $_FILES['file']['size'],
    ]);
    exit;
}

// 22. COURSE MODULES ("Mes contenus" — fixed 5 modules, admin attaches a video)
if ($request_uri === '/api/course-modules' && $method == 'GET') {
    requireAuth($secret_key); // any logged-in user (student or admin)
    $stmt = $pdo->query("SELECT * FROM course_modules ORDER BY position ASC");
    echo json_encode($stmt->fetchAll());
    exit;
}

if (preg_match('#^/api/course-modules/(\d+)$#', $request_uri, $matches) && $method == 'POST') {
    requireAdmin($secret_key);
    $id = $matches[1];
    $videoUrl = $input['videoUrl'] ?? null;
    $videoSource = in_array($input['videoSource'] ?? null, ['link', 'upload'], true) ? $input['videoSource'] : null;
    // An empty videoUrl clears the attached video entirely.
    if ($videoUrl === '') { $videoUrl = null; $videoSource = null; }

    try {
        $stmt = $pdo->prepare("UPDATE course_modules SET video_url = ?, video_source = ? WHERE id = ?");
        $stmt->execute([$videoUrl, $videoSource, $id]);
        echo json_encode(['id' => (int)$id, 'message' => 'Module updated']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Update course module failed: ' . $e->getMessage());
    }
    exit;
}

// 23. RESOURCES — write side (admin only; GET is public to any authenticated user, see section 11 above)
if ($request_uri === '/api/resources' && $method == 'POST') {
    requireAdmin($secret_key);
    $title = $input['title'] ?? '';
    $type = $input['type'] ?? 'summary';
    $url = $input['url'] ?? '';
    $subject = $input['subject'] ?? '';
    $fileSize = $input['fileSize'] ?? null;
    $iconName = $input['iconName'] ?? null;

    try {
        $stmt = $pdo->prepare("INSERT INTO resources (title, type, url, subject, file_size, icon_name) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$title, $type, $url, $subject, $fileSize, $iconName]);
        http_response_code(201);
        echo json_encode(['id' => $pdo->lastInsertId(), 'message' => 'Resource created']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Save resource failed: ' . $e->getMessage());
    }
    exit;
}

if (preg_match('#^/api/resources/(\d+)$#', $request_uri, $matches) && $method == 'DELETE') {
    requireAdmin($secret_key);
    $stmt = $pdo->prepare("DELETE FROM resources WHERE id = ?");
    $stmt->execute([$matches[1]]);
    echo json_encode(['message' => 'Resource deleted']);
    exit;
}

// 24. COACHING SESSIONS — appointments filtered to category='coaching'.
// Student sees only their own; admin sees all (or one student via ?studentId=).
if ($request_uri === '/api/coaching-sessions' && $method == 'GET') {
    $user = requireStudentOrAdmin($secret_key);
    if (($user['role'] ?? '') === 'student') {
        $stmt = $pdo->prepare("SELECT a.* FROM appointments a WHERE a.category = 'coaching' AND a.student_id = ? ORDER BY a.date DESC");
        $stmt->execute([$user['id']]);
    } elseif (isset($_GET['studentId']) && $_GET['studentId'] !== '') {
        $stmt = $pdo->prepare("SELECT a.*, s.name AS student_full_name FROM appointments a LEFT JOIN students s ON a.student_id = s.id WHERE a.category = 'coaching' AND a.student_id = ? ORDER BY a.date DESC");
        $stmt->execute([(int)$_GET['studentId']]);
    } else {
        $stmt = $pdo->query("SELECT a.*, s.name AS student_full_name FROM appointments a LEFT JOIN students s ON a.student_id = s.id WHERE a.category = 'coaching' ORDER BY a.date DESC");
    }
    echo json_encode($stmt->fetchAll());
    exit;
}

// 25. ADMIN CROSS-STUDENT OVERVIEWS (Plans, Check-ins, Progression)
if ($request_uri === '/api/admin/plans' && $method == 'GET') {
    requireAdmin($secret_key);
    $stmt = $pdo->query("SELECT s.id AS student_id, s.name, s.username, p.objective, p.start_date, p.obstacles, p.actions, p.habits, p.updated_at
        FROM students s LEFT JOIN self_guided_plans p ON p.student_id = s.id
        WHERE s.status = 'active' ORDER BY s.name ASC");
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/admin/checkins' && $method == 'GET') {
    requireAdmin($secret_key);
    $stmt = $pdo->query("SELECT c.*, s.name, s.username FROM checkins c JOIN students s ON c.student_id = s.id ORDER BY c.created_at DESC LIMIT 200");
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/admin/progress-overview' && $method == 'GET') {
    requireAdmin($secret_key);

    $students = $pdo->query("SELECT id, name, username, package FROM students WHERE status = 'active'")->fetchAll();

    $plans = [];
    foreach ($pdo->query("SELECT student_id, actions FROM self_guided_plans") as $row) {
        $actions = json_decode($row['actions'] ?? '[]', true) ?: [];
        $plans[$row['student_id']] = ['total' => count($actions), 'done' => count(array_filter($actions, fn($a) => !empty($a['done'])))];
    }

    $goals = [];
    foreach ($pdo->query("SELECT student_id, COUNT(*) AS total, SUM(status = 'atteint') AS atteints FROM goals GROUP BY student_id") as $row) {
        $goals[$row['student_id']] = ['total' => (int)$row['total'], 'atteints' => (int)$row['atteints']];
    }

    $revisions = [];
    foreach ($pdo->query("SELECT student_id, COUNT(*) AS recent FROM revision_sessions WHERE session_date > (NOW() - INTERVAL 7 DAY) GROUP BY student_id") as $row) {
        $revisions[$row['student_id']] = (int)$row['recent'];
    }

    $habits = [];
    foreach ($pdo->query("SELECT student_id, days FROM habits") as $row) {
        $daysDone = count(array_filter(json_decode($row['days'] ?? '[]', true) ?: []));
        if (!isset($habits[$row['student_id']])) $habits[$row['student_id']] = ['count' => 0, 'daysDone' => 0];
        $habits[$row['student_id']]['count']++;
        $habits[$row['student_id']]['daysDone'] += $daysDone;
    }

    $overview = array_map(function ($s) use ($plans, $goals, $revisions, $habits) {
        $id = $s['id'];
        $plan = $plans[$id] ?? ['total' => 0, 'done' => 0];
        $goal = $goals[$id] ?? ['total' => 0, 'atteints' => 0];
        $habit = $habits[$id] ?? ['count' => 0, 'daysDone' => 0];
        return [
            'studentId' => (int)$id,
            'name' => $s['name'],
            'username' => $s['username'],
            'package' => $s['package'],
            'planActionsTotal' => $plan['total'],
            'planActionsDone' => $plan['done'],
            'goalsTotal' => $goal['total'],
            'goalsAtteints' => $goal['atteints'],
            'revisionsLast7d' => $revisions[$id] ?? 0,
            'habitCount' => $habit['count'],
            'habitConsistencyPct' => $habit['count'] > 0 ? round(($habit['daysDone'] / ($habit['count'] * 7)) * 100) : null,
        ];
    }, $students);

    echo json_encode($overview);
    exit;
}

// 26. FEEDBACK — coach/admin messages to a student
if ($request_uri === '/api/feedback' && $method == 'GET') {
    $user = requireStudentOrAdmin($secret_key);
    $studentId = resolveStudentId($user);
    $stmt = $pdo->prepare("SELECT * FROM feedback WHERE student_id = ? ORDER BY created_at DESC");
    $stmt->execute([$studentId]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/feedback' && $method == 'POST') {
    $admin = requireAdmin($secret_key);
    $studentId = $input['studentId'] ?? null;
    $message = trim($input['message'] ?? '');
    $appointmentId = $input['appointmentId'] ?? null;

    if (!$studentId || $message === '') {
        http_response_code(400);
        echo json_encode(['message' => 'studentId and message are required']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT name FROM students WHERE id = ?");
    $stmt->execute([$studentId]);
    $studentName = $stmt->fetch()['name'] ?? null;
    if (!$studentName) {
        http_response_code(404);
        echo json_encode(['message' => 'Student not found']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$admin['id']]);
    $authorName = $stmt->fetch()['username'] ?? 'Admin';

    try {
        $stmt = $pdo->prepare("INSERT INTO feedback (student_id, appointment_id, message, author_name) VALUES (?, ?, ?, ?)");
        $stmt->execute([$studentId, $appointmentId ?: null, $message, $authorName]);
        $newId = $pdo->lastInsertId();
        logActivity($pdo, $admin, 'feedback_sent', 'feedback', $studentName, ['message' => mb_substr($message, 0, 120)]);
        http_response_code(201);
        echo json_encode(['id' => $newId, 'message' => 'Feedback sent']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Save feedback failed: ' . $e->getMessage());
    }
    exit;
}

if ($request_uri === '/api/admin/feedback' && $method == 'GET') {
    requireAdmin($secret_key);
    $stmt = $pdo->query("SELECT f.*, s.name, s.username FROM feedback f JOIN students s ON f.student_id = s.id ORDER BY f.created_at DESC LIMIT 200");
    echo json_encode($stmt->fetchAll());
    exit;
}

// 27. COLLECTIVE SESSIONS (Sessions collectives)
if ($request_uri === '/api/collective-sessions' && $method == 'GET') {
    $user = requireAuth($secret_key);
    if (($user['role'] ?? '') === 'student') {
        $stmt = $pdo->prepare("SELECT cs.*,
                (SELECT COUNT(*) FROM collective_session_registrations r WHERE r.session_id = cs.id) AS registered_count,
                EXISTS(SELECT 1 FROM collective_session_registrations r WHERE r.session_id = cs.id AND r.student_id = ?) AS my_registration
            FROM collective_sessions cs WHERE cs.status != 'cancelled' ORDER BY cs.date ASC");
        $stmt->execute([$user['id']]);
    } else {
        $stmt = $pdo->query("SELECT cs.*,
                (SELECT COUNT(*) FROM collective_session_registrations r WHERE r.session_id = cs.id) AS registered_count
            FROM collective_sessions cs ORDER BY cs.date ASC");
    }
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($request_uri === '/api/collective-sessions' && $method == 'POST') {
    $admin = requireAdmin($secret_key);
    $id = $input['id'] ?? null;
    $title = $input['title'] ?? '';
    $description = $input['description'] ?? null;
    $date = $input['date'] ?? '';
    $time = $input['time'] ?? '';
    $capacity = $input['capacity'] ?? null;
    $meetingLink = $input['meetingLink'] ?? null;
    $status = $input['status'] ?? 'scheduled';

    try {
        if ($id) {
            $stmt = $pdo->prepare("UPDATE collective_sessions SET title=?, description=?, date=?, time=?, capacity=?, meeting_link=?, status=? WHERE id=?");
            $stmt->execute([$title, $description, $date, $time, $capacity ?: null, $meetingLink, $status, $id]);
            echo json_encode(['id' => (int)$id, 'message' => 'Session updated']);
        } else {
            $stmt = $pdo->prepare("INSERT INTO collective_sessions (title, description, date, time, capacity, meeting_link, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $description, $date, $time, $capacity ?: null, $meetingLink, $status]);
            $newId = $pdo->lastInsertId();
            logActivity($pdo, $admin, 'collective_session_created', 'collective_session', $title, ['date' => $date, 'time' => $time]);
            http_response_code(201);
            echo json_encode(['id' => $newId, 'message' => 'Session created']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Database error']);
        error_log('Save collective session failed: ' . $e->getMessage());
    }
    exit;
}

if (preg_match('#^/api/collective-sessions/(\d+)$#', $request_uri, $matches) && $method == 'DELETE') {
    requireAdmin($secret_key);
    $stmt = $pdo->prepare("DELETE FROM collective_sessions WHERE id = ?");
    $stmt->execute([$matches[1]]);
    echo json_encode(['message' => 'Session deleted']);
    exit;
}

if (preg_match('#^/api/collective-sessions/(\d+)/registrations$#', $request_uri, $matches) && $method == 'GET') {
    requireAdmin($secret_key);
    $stmt = $pdo->prepare("SELECT r.*, s.name, s.username FROM collective_session_registrations r JOIN students s ON r.student_id = s.id WHERE r.session_id = ? ORDER BY r.registered_at ASC");
    $stmt->execute([$matches[1]]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if (preg_match('#^/api/collective-sessions/(\d+)/register$#', $request_uri, $matches) && $method == 'POST') {
    $user = requireStudent($secret_key);
    $sessionId = (int)$matches[1];

    $stmt = $pdo->prepare("SELECT capacity, (SELECT COUNT(*) FROM collective_session_registrations WHERE session_id = ?) AS registered FROM collective_sessions WHERE id = ?");
    $stmt->execute([$sessionId, $sessionId]);
    $session = $stmt->fetch();
    if (!$session) {
        http_response_code(404);
        echo json_encode(['message' => 'Session not found']);
        exit;
    }
    if ($session['capacity'] !== null && (int)$session['registered'] >= (int)$session['capacity']) {
        http_response_code(400);
        echo json_encode(['message' => 'Session complète']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO collective_session_registrations (session_id, student_id) VALUES (?, ?)");
        $stmt->execute([$sessionId, $user['id']]);
        http_response_code(201);
        echo json_encode(['message' => 'Registered']);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            echo json_encode(['message' => 'Already registered']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Database error']);
            error_log('Register for collective session failed: ' . $e->getMessage());
        }
    }
    exit;
}

if (preg_match('#^/api/collective-sessions/(\d+)/register$#', $request_uri, $matches) && $method == 'DELETE') {
    $user = requireStudent($secret_key);
    $stmt = $pdo->prepare("DELETE FROM collective_session_registrations WHERE session_id = ? AND student_id = ?");
    $stmt->execute([$matches[1], $user['id']]);
    echo json_encode(['message' => 'Unregistered']);
    exit;
}

if (preg_match('#^/api/collective-sessions/(\d+)/attendance$#', $request_uri, $matches) && $method == 'POST') {
    requireAdmin($secret_key);
    $studentId = $input['studentId'] ?? null;
    $attended = array_key_exists('attended', $input) ? (bool)$input['attended'] : null;
    if (!$studentId) {
        http_response_code(400);
        echo json_encode(['message' => 'studentId required']);
        exit;
    }
    $stmt = $pdo->prepare("UPDATE collective_session_registrations SET attended = ? WHERE session_id = ? AND student_id = ?");
    $stmt->execute([$attended, $matches[1], $studentId]);
    echo json_encode(['message' => 'Attendance updated']);
    exit;
}

// 404
http_response_code(404);
echo json_encode(['message' => 'Not Found']);
?>
