<?php
require_once 'db.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $prn        = trim($_POST['prn'] ?? '');
    $name       = trim($_POST['name'] ?? '');
    $email      = trim($_POST['email'] ?? '');
    $department = trim($_POST['department'] ?? '');
    $semester   = intval($_POST['semester'] ?? 5);
    $gpa        = floatval($_POST['gpa'] ?? 0.0);

    if (empty($prn) || empty($name) || empty($email) || empty($department)) {
        $error = "All required fields must be filled.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } else {
        // Prepare INSERT statement
        $stmt = mysqli_prepare($conn, "INSERT INTO students (prn, name, email, department, semester, gpa) VALUES (?, ?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "ssssid", $prn, $name, $email, $department, $semester, $gpa);

        if (mysqli_stmt_execute($stmt)) {
            header("Location: index.php?msg=created");
            exit;
        } else {
            $error = "Error inserting record: " . mysqli_error($conn);
        }
        mysqli_stmt_close($stmt);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add New Student | WTL Assignment 8</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body class="bg-light py-5">
    <div class="container" style="max-width: 600px;">
        <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div class="card-header bg-primary text-white p-4">
                <h4 class="mb-1 fw-bold"><i class="bi bi-person-plus-fill me-2"></i> Add Student Record</h4>
                <p class="mb-0 text-white-50 small">PHP MySQL INSERT (Create) Operation</p>
            </div>
            <div class="card-body p-4">
                <?php if(!empty($error)): ?>
                    <div class="alert alert-danger py-2 small"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>

                <form method="POST">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">PRN (Student Roll No) <span class="text-danger">*</span></label>
                        <input type="text" name="prn" class="form-control" placeholder="e.g. 2024CS105" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Full Name <span class="text-danger">*</span></label>
                        <input type="text" name="name" class="form-control" placeholder="e.g. Priya Sharma" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email Address <span class="text-danger">*</span></label>
                        <input type="email" name="email" class="form-control" placeholder="e.g. priya.sharma@example.com" required>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Department <span class="text-danger">*</span></label>
                            <select name="department" class="form-select" required>
                                <option value="Computer">Computer</option>
                                <option value="IT">IT</option>
                                <option value="AI&DS">AI&DS</option>
                                <option value="ENTC">ENTC</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Semester</label>
                            <input type="number" name="semester" class="form-control" value="5" min="1" max="8">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">GPA</label>
                            <input type="number" step="0.01" name="gpa" class="form-control" placeholder="0.00 - 10.00" value="8.50">
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <a href="index.php" class="btn btn-outline-secondary rounded-pill px-4">Cancel</a>
                        <button type="submit" class="btn btn-primary rounded-pill px-4 fw-semibold">Save Student Record</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
