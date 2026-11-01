# WTL Assignment 8: Student Management System (PHP & MySQL CRUD)

## Problem Statement
Create a simple PHP application that manages a list of students using CRUD operations (Create, Read, Update, Delete) and interact with a MySQL database through XAMPP.

## How to Run in XAMPP:
1. Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
2. Open your browser and go to `http://localhost/phpmyadmin`.
3. Click on the **SQL** tab, copy the contents of `database.sql` and click **Go** to create the `wtl_student_db` database and `students` table.
4. Copy the `assignment-8-php-crud` folder into your XAMPP `htdocs` directory (e.g. `C:\xampp\htdocs\assignment-8-php-crud`).
5. Open your browser and visit: `http://localhost/assignment-8-php-crud/index.php`.

## CRUD Operations Provided:
- **Create (C):** `create.php` (Add new student with PRN, Name, Email, Department, GPA)
- **Read (R):** `index.php` (Display student list, department filter, and search bar)
- **Update (U):** `edit.php` (Update existing student details prefilled from database)
- **Delete (D):** `delete.php` (Delete student record with instant confirmation)
