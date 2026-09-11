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

// 10. Student module tables — Mon Plan, Mes outils (habitudes, error log,
// révisions, objectifs), Check-ins, Planning. Previously local-only
// (browser localStorage), now synced so the admin can see a student's real
// work in near real time (see AdminStudentDetail.tsx).
$pdo->exec("CREATE TABLE IF NOT EXISTS self_guided_plans (
    student_id INT PRIMARY KEY,
    objective VARCHAR(500) DEFAULT '',
    start_date VARCHAR(50) DEFAULT '',
    obstacles TEXT,
    actions JSON DEFAULT NULL,
    habits JSON DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
)");
$log[] = 'self_guided_plans table ensured';

$pdo->exec("CREATE TABLE IF NOT EXISTS goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    target_date VARCHAR(50),
    progress INT DEFAULT 0,
    status VARCHAR(30) DEFAULT 'a_demarrer',
    next_action VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
)");
$log[] = 'goals table ensured';

$pdo->exec("CREATE TABLE IF NOT EXISTS revision_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(255),
    duration_min INT DEFAULT 0,
    technique VARCHAR(100),
    understanding INT DEFAULT 3,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
)");
$log[] = 'revision_sessions table ensured';

$pdo->exec("CREATE TABLE IF NOT EXISTS habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    days JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
)");
$log[] = 'habits table ensured';

$pdo->exec("CREATE TABLE IF NOT EXISTS error_log_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(255),
    mistake TEXT NOT NULL,
    reason TEXT,
    correct_method TEXT,
    review_date VARCHAR(50),
    status VARCHAR(30) DEFAULT 'a_revoir',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
)");
$log[] = 'error_log_entries table ensured';

$pdo->exec("CREATE TABLE IF NOT EXISTS checkins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    adherence INT,
    days_respected INT,
    obstacle VARCHAR(500),
    concentration INT,
    success TEXT,
    needs_adjustment BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
)");
$log[] = 'checkins table ensured';

$pdo->exec("CREATE TABLE IF NOT EXISTS timetable_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject VARCHAR(100),
    day VARCHAR(20),
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
)");
$log[] = 'timetable_tasks table ensured';

// 11. course_modules table — the 5 fixed "Mes contenus" modules, seeded once
// by slug so the admin can attach a video (link or upload) to each.
$pdo->exec("CREATE TABLE IF NOT EXISTS course_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    position INT DEFAULT 0,
    video_url VARCHAR(500) DEFAULT NULL,
    video_source ENUM('link', 'upload') DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)");
$log[] = 'course_modules table ensured';

$pdo->exec("INSERT IGNORE INTO course_modules (slug, title, description, position) VALUES
    ('diagnostic-objectifs', 'Faire le point & définir ses objectifs', 'Diagnostic de votre situation actuelle et définition de vos objectifs.', 1),
    ('planning-efficace', 'Construire un planning efficace', 'Organisation et création d''un programme hebdomadaire.', 2),
    ('procrastination', 'Vaincre la procrastination', 'Lutte contre la procrastination et les distractions.', 3),
    ('revisions-efficaces', 'Réviser plus efficacement', 'Techniques de révision et d''apprentissage.', 4),
    ('preparation-examens', 'Préparer les examens & gérer la pression', 'Préparation aux examens et gestion de la pression.', 5)");
$log[] = 'course_modules seeded';

// 12. appointments: add student_id / category / notes for coaching-session tracking
$apptCols = $pdo->query("SHOW COLUMNS FROM appointments")->fetchAll(PDO::FETCH_COLUMN);
if (!in_array('student_id', $apptCols, true)) {
    $pdo->exec("ALTER TABLE appointments ADD COLUMN student_id INT DEFAULT NULL");
    $pdo->exec("ALTER TABLE appointments ADD CONSTRAINT fk_appointments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL");
    $log[] = 'added appointments.student_id column + FK';
} else {
    $log[] = 'appointments.student_id already present';
}
if (!in_array('category', $apptCols, true)) {
    $pdo->exec("ALTER TABLE appointments ADD COLUMN category VARCHAR(50) DEFAULT NULL");
    $log[] = 'added appointments.category column';
} else {
    $log[] = 'appointments.category already present';
}
if (!in_array('notes', $apptCols, true)) {
    $pdo->exec("ALTER TABLE appointments ADD COLUMN notes TEXT DEFAULT NULL");
    $log[] = 'added appointments.notes column';
} else {
    $log[] = 'appointments.notes already present';
}

// 13. feedback table (Feedback tab/page — coach messages to a student)
$pdo->exec("CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    appointment_id INT DEFAULT NULL,
    message TEXT NOT NULL,
    author_name VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL
)");
$log[] = 'feedback table ensured';

// 14. collective sessions + registrations (Sessions collectives)
$pdo->exec("CREATE TABLE IF NOT EXISTS collective_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    capacity INT DEFAULT NULL,
    meeting_link VARCHAR(500) DEFAULT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)");
$log[] = 'collective_sessions table ensured';

$pdo->exec("CREATE TABLE IF NOT EXISTS collective_session_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    student_id INT NOT NULL,
    attended BOOLEAN DEFAULT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES collective_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_session_student (session_id, student_id)
)");
$log[] = 'collective_session_registrations table ensured';

echo json_encode(['message' => 'Migration complete', 'log' => $log, 'next_step' => 'Delete this file from the server now.']);
