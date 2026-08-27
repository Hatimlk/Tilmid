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
    -- Free-text coach name. No coaches table yet (single-admin-team scale) —
    -- kept as a plain label until a real Coach entity is introduced.
    -- Existing installs: ALTER TABLE students ADD COLUMN coach_name VARCHAR(255) DEFAULT NULL;
    coach_name VARCHAR(255) DEFAULT NULL
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    city VARCHAR(100),
    bac_year VARCHAR(20),
    regional_grade VARCHAR(20),
    pack VARCHAR(100),
    status ENUM('new', 'contacted', 'enrolled', 'archived') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login Attempts Table (basic rate limiting for /api/auth/login and /api/students/login)
CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_identifier_created (identifier, created_at)
);
