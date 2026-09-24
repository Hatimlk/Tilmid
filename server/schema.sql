-- Create Database (Run this only if you have permissions, otherwise create manually)
-- CREATE DATABASE IF NOT EXISTS tilmid_db;
-- USE tilmid_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    author_id INT,
    author_name VARCHAR(255) DEFAULT 'الأستاذ ياسين',
    author_avatar VARCHAR(255) DEFAULT '/assets/yassine-image-DgfyHuCr.png',
    image_url VARCHAR(255),
    category VARCHAR(100),
    status ENUM('published', 'draft') DEFAULT 'published',
    views INT DEFAULT 0,
    reading_time VARCHAR(50),
    file_url VARCHAR(255),
    content_type ENUM('html', 'file', 'text') DEFAULT 'html',
    sections JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Coaches Table — real coach entity (admin "Coachs" module). Students link to
-- one via coach_id below; coach_name is kept as a denormalized label for any
-- reader that hasn't been updated to the FK yet.
CREATE TABLE IF NOT EXISTS coaches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    specialty VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
-- NOTE: password_hash stores a bcrypt/password_hash() digest, never plaintext.
-- Existing installs: run server-php/migrate.php once to rename the old
-- plaintext `password` column and hash existing values in place.
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    email VARCHAR(255),
    grade VARCHAR(255),
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- pending_activation: created by admin but has never logged in yet.
    -- completed: finished their Mouwakaba program (kept for records, no longer active).
    -- archived: removed from active operations without deleting the row (prefer over DELETE).
    -- Existing installs: ALTER TABLE students MODIFY COLUMN status ENUM('active','pending_activation','suspended','completed','archived') DEFAULT 'active';
    status ENUM('active', 'pending_activation', 'suspended', 'completed', 'archived') DEFAULT 'active',
    avatar_url VARCHAR(255),
    -- Active Mouwakaba coaching pack, if any. NULL = no coaching pack (student
    -- area only, e.g. a Tilmid/Talib-program student not enrolled in Mouwakaba).
    -- Existing installs: ALTER TABLE students ADD COLUMN package ENUM('essentiel','boost','premium') DEFAULT NULL;
    package ENUM('essentiel', 'boost', 'premium') DEFAULT NULL,
    -- Denormalized coach label, kept in sync with coach_id below on every save.
    -- Existing installs: ALTER TABLE students ADD COLUMN coach_name VARCHAR(255) DEFAULT NULL;
    coach_name VARCHAR(255) DEFAULT NULL,
    -- Real coach link (admin "Coachs" module). NULL = unassigned.
    -- Existing installs: ALTER TABLE students ADD COLUMN coach_id INT DEFAULT NULL, ADD CONSTRAINT fk_students_coach FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE SET NULL;
    coach_id INT DEFAULT NULL,
    FOREIGN KEY (coach_id) REFERENCES coaches(id) ON DELETE SET NULL
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255),
    title VARCHAR(255),
    date DATE,
    time VARCHAR(50),
    -- Existing installs: ALTER TABLE appointments MODIFY COLUMN status ENUM('confirmed','pending','cancelled','completed') DEFAULT 'confirmed';
    status ENUM('confirmed', 'pending', 'cancelled', 'completed') DEFAULT 'confirmed',
    type ENUM('live', 'online') DEFAULT 'live',
    -- Existing installs: see migrate.php for the ALTER TABLE statements that add these three columns.
    student_id INT DEFAULT NULL,
    category VARCHAR(50) DEFAULT NULL, -- 'coaching' for an individual coaching session, NULL for a generic rendez-vous
    notes TEXT DEFAULT NULL,           -- admin's post-session notes (coaching sessions)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

-- Activity Log Table — powers the admin "Activité récente" widget with real
-- events instead of a fabricated feed. Append-only; never expose password/token
-- fields in `meta`.
-- Existing installs: run the CREATE TABLE below once (safe/idempotent, IF NOT EXISTS).
CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actor_name VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_label VARCHAR(255) NOT NULL,
    meta JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at)
);

-- Success Stories Table
CREATE TABLE IF NOT EXISTS success_stories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255),
    grade VARCHAR(255),
    story_text TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    type VARCHAR(100),
    message TEXT,
    status ENUM('new', 'read', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources Table
CREATE TABLE IF NOT EXISTS resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    type VARCHAR(50),
    url VARCHAR(255),
    subject VARCHAR(100),
    file_size VARCHAR(50),
    download_count INT DEFAULT 0,
    icon_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timetable Tasks Table
CREATE TABLE IF NOT EXISTS timetable_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject VARCHAR(100),
    day VARCHAR(20),
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Coaching Requests Table
CREATE TABLE IF NOT EXISTS coaching_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    grade VARCHAR(100),
    status ENUM('new', 'contacted', 'enrolled', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orientation Requests Table
CREATE TABLE IF NOT EXISTS orientation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    filiere VARCHAR(100),
    school_type VARCHAR(20),
    city VARCHAR(100),
    bac_year VARCHAR(20),
    regional_grade VARCHAR(20),
    pack VARCHAR(100),
    status ENUM('new', 'contacted', 'enrolled', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Self-guided plan Table — one row per student (Mon Plan). `actions` is a JSON
-- array of {id,text,done}; `habits` is a JSON array of strings. Written by the
-- student, read by admin (StudentDetail "Plan" tab) for real-time visibility.
CREATE TABLE IF NOT EXISTS self_guided_plans (
    student_id INT PRIMARY KEY,
    objective VARCHAR(500) DEFAULT '',
    start_date VARCHAR(50) DEFAULT '',
    obstacles TEXT,
    actions JSON DEFAULT NULL,
    habits JSON DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Goals Table (Objectifs, in Mes outils)
CREATE TABLE IF NOT EXISTS goals (
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
);

-- Revision sessions Table (Suivi des révisions, in Mes outils)
CREATE TABLE IF NOT EXISTS revision_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(255),
    duration_min INT DEFAULT 0,
    technique VARCHAR(100),
    understanding INT DEFAULT 3,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Habits Table (Habit tracker, in Mes outils). `days` is a JSON array of 7 booleans (Mon->Sun).
CREATE TABLE IF NOT EXISTS habits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    days JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Check-ins Table (self-log, Boost/Premium)
CREATE TABLE IF NOT EXISTS checkins (
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
);

-- Course modules Table — the 5 fixed Mouwakaba modules shown in "Mes contenus".
-- Rows are seeded once (by slug) and never created/deleted from the app; the
-- admin only attaches a video to each (external link OR an uploaded file).
CREATE TABLE IF NOT EXISTS course_modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    position INT DEFAULT 0,
    -- video_url holds either the external link (YouTube/Vimeo/...) or the
    -- /api/uploads/videos/... path of an uploaded file, depending on video_source.
    video_url VARCHAR(500) DEFAULT NULL,
    video_source ENUM('link', 'upload') DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO course_modules (slug, title, description, position) VALUES
    ('diagnostic-objectifs', 'Faire le point & définir ses objectifs', 'Diagnostic de votre situation actuelle et définition de vos objectifs.', 1),
    ('planning-efficace', 'Construire un planning efficace', 'Organisation et création d''un programme hebdomadaire.', 2),
    ('procrastination', 'Vaincre la procrastination', 'Lutte contre la procrastination et les distractions.', 3),
    ('revisions-efficaces', 'Réviser plus efficacement', 'Techniques de révision et d''apprentissage.', 4),
    ('preparation-examens', 'Préparer les examens & gérer la pression', 'Préparation aux examens et gestion de la pression.', 5);

-- Feedback Table — short messages a coach/admin sends a student after a
-- session or Check-in (Feedback tab/page). appointment_id is an optional
-- link back to the coaching session the feedback is about.
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    appointment_id INT DEFAULT NULL,
    checkin_id INT DEFAULT NULL,
    message TEXT NOT NULL,
    author_name VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    FOREIGN KEY (checkin_id) REFERENCES checkins(id) ON DELETE SET NULL
);

-- Collective sessions Table (Sessions collectives) — group sessions any
-- Mouwakaba student can register for, independent of individual coaching.
CREATE TABLE IF NOT EXISTS collective_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    capacity INT DEFAULT NULL,
    meeting_link VARCHAR(500) DEFAULT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations for the above — join table, one row per student per session.
CREATE TABLE IF NOT EXISTS collective_session_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    student_id INT NOT NULL,
    attended BOOLEAN DEFAULT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES collective_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_session_student (session_id, student_id)
);

-- Tool Options Table — admin-editable reference lists for "Mes outils" (used by
-- the revision tracker's subject/technique dropdowns). Replaces two previously
-- hardcoded, slightly-diverged const arrays in MesOutils.tsx and Planning.tsx.
CREATE TABLE IF NOT EXISTS tool_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category ENUM('subject', 'technique') NOT NULL,
    label VARCHAR(100) NOT NULL,
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO tool_options (id, category, label, position) VALUES
    (1, 'subject', 'Mathématiques', 1),
    (2, 'subject', 'Physique-Chimie', 2),
    (3, 'subject', 'SVT', 3),
    (4, 'subject', 'Français', 4),
    (5, 'subject', 'Philosophie', 5),
    (6, 'subject', 'Langues', 6),
    (7, 'subject', 'Autre', 7),
    (8, 'technique', 'Rappel actif', 1),
    (9, 'technique', 'Questions', 2),
    (10, 'technique', 'Flashcards', 3),
    (11, 'technique', 'Exercices', 4),
    (12, 'technique', 'Feynman', 5),
    (13, 'technique', 'Révision espacée', 6),
    (14, 'technique', 'Fiches de synthèse', 7);

-- Platform Settings Table — single row (id=1), admin "Paramètres" module.
-- Read publicly (Footer needs it for unauthenticated visitors); written admin-only.
CREATE TABLE IF NOT EXISTS platform_settings (
    id INT PRIMARY KEY DEFAULT 1,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    whatsapp_number VARCHAR(50),
    instagram_url VARCHAR(255),
    tiktok_url VARCHAR(255),
    facebook_url VARCHAR(255),
    youtube_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT IGNORE INTO platform_settings (id) VALUES (1);

-- Notifications Table — in-app student notifications (admin "Notifications"
-- module). One row per recipient; a broadcast is fanned out to N rows at
-- creation time (see /api/notifications POST).
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Login Attempts Table (basic rate limiting for /api/auth/login and /api/students/login)
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_identifier_created (identifier, created_at)
);
