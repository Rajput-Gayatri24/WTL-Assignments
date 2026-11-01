<?php
// =========================================================================
// WTL Assignment 8: Database Connection Configuration
// =========================================================================

$host     = "localhost";
$username = "root";
$password = "";          // Default XAMPP MySQL password is blank
$database = "wtl_student_db";

// Connect to MySQL database
$conn = mysqli_connect($host, $username, $password, $database);

// Check connection
if (!$conn) {
    die("<div style='font-family:sans-serif; padding:20px; background:#fee2e2; color:#991b1b; border-radius:8px;'>
        <h3>Database Connection Failed!</h3>
        <p>" . mysqli_connect_error() . "</p>
        <p>Make sure MySQL is running in XAMPP Control Panel and database <code>wtl_student_db</code> has been imported.</p>
    </div>");
}
?>
