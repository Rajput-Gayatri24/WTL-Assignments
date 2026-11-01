-- =========================================================================
-- WTL Assignment 8: Student Management CRUD Database Script
-- Import this script into phpMyAdmin (http://localhost/phpmyadmin)
-- =========================================================================

CREATE DATABASE IF NOT EXISTS wtl_student_db;
USE wtl_student_db;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prn VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    semester INT NOT NULL DEFAULT 5,
    gpa DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Initial Records for Testing
INSERT INTO students (prn, name, email, department, semester, gpa) VALUES
('2024CS101', 'Gaurav Rajput', 'gaurav.rajput@example.com', 'Computer', 5, 8.95),
('2024CS102', 'Aditya Patil', 'aditya.patil@example.com', 'Computer', 5, 8.40),
('2024IT201', 'Snehal Kulkarni', 'snehal.kulkarni@example.com', 'IT', 5, 9.15),
('2024AI301', 'Rohan Deshmukh', 'rohan.deshmukh@example.com', 'AI&DS', 5, 7.80)
ON DUPLICATE KEY UPDATE prn=prn;
