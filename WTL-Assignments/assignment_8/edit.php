<?php
require_once 'db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if ($id <= 0) {
    header("Location: index.php");
    exit;
}

// Fetch existing record
$stmt = mysqli_prepare($conn, "SELECT * FROM students WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$student = mysqli_fetch_assoc($result);

if (!$student) {
    die("Student record not found!");
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $prn        = trim($_POST['prn'] ?? '');
    $name       = trim($_POST['name'] ?? '');
    $email      = trim($_POST['email'] ?? '');
    $department = trim($_POST['department'] ?? '');
    $semester   = intval($_POST['semester'] ?? 5);
    $gpa        = floatval($_POST['gpa'] ?? 0.0);

    if (empty($prn) || empty($name) || empty($email)) {
        $error = "Please fill in all required fields.";
    } else {
        $update_stmt = mysqli_prepare($conn, "UPDATE students SET prn=?, name=?, email=?, department=?, semester=?, gpa=? WHERE id=?");
        mysqli_stmt_bind_param($update_stmt, "ssssidi", $prn, $name, $email, $department, $semester, $gpa, $id);

        if (mysqli_stmt_execute($update_stmt)) {
            header("Location: index.php?msg=updated");
            exit;
        } else {
            $error = "Error updating record: " . mysqli_error($conn);
        }
        mysqli_stmt_close($update_stmt);
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Student | WTL Assignment 8</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body class="bg-light py-5">
    <div class="container" style="max-width: 600px;">
        <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div class="card-header bg-warning text-dark p-4">
                <h4 class="mb-1 fw-bold"><i class="bi bi-pencil-square me-2"></i> Update Student Record</h4>
                <p class="mb-0 text-muted small">PHP MySQL UPDATE Operation</p>
            </div>
            <div class="card-body p-4">
                <?php if(!empty($error)): ?>
                    <div class="alert alert-danger py-2 small"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>

                <form method="POST">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">PRN <span class="text-danger">*</span></label>
                        <input type="text" name="prn" class="form-control" value="<?php echo htmlspecialchars($student['prn']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Full Name <span class="text-danger">*</span></label>
                        <input type="text" name="name" class="form-control" value="<?php echo htmlspecialchars($student['name']); ?>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                        <input type="email" name="email" class="form-control" value="<?php echo htmlspecialchars($student['email']); ?>" required>
                    </div>
                    <div class="row g-3 mb-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Department</label>
                            <select name="department" class="form-select">
                                <option value="Computer" <?php if($student['department']=='Computer') echo 'selected'; ?>>Computer</option>
                                <option value="IT" <?php if($student['department']=='IT') echo 'selected'; ?>>IT</option>
                                <option value="AI&DS" <?php if($student['department']=='AI&DS') echo 'selected'; ?>>AI&DS</option>
                                <option value="ENTC" <?php if($student['department']=='ENTC') echo 'selected'; ?>>ENTC</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">Semester</label>
                            <input type="number" name="semester" class="form-control" value="<?php echo htmlspecialchars($student['semester']); ?>" min="1" max="8">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label fw-semibold">GPA</label>
                            <input type="number" step="0.01" name="gpa" class="form-control" value="<?php echo htmlspecialchars($student['gpa']); ?>">
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <a href="index.php" class="btn btn-outline-secondary rounded-pill px-4">Cancel</a>
                        <button type="submit" class="btn btn-warning rounded-pill px-4 fw-bold">Update Record</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</body>
</html>
