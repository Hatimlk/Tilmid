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
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    email VARCHAR(255),
    grade VARCHAR(255),
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'suspended') DEFAULT 'active',
    avatar_url VARCHAR(255)
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255),
    title VARCHAR(255),
    date DATE,
    time VARCHAR(50),
    status ENUM('confirmed', 'pending', 'cancelled') DEFAULT 'confirmed',
    type ENUM('live', 'online') DEFAULT 'live',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

