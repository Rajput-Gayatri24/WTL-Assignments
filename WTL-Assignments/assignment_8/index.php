<?php
require_once 'db.php';

// Search filter
$search = isset($_GET['search']) ? mysqli_real_escape_string($conn, $_GET['search']) : '';
$dept_filter = isset($_GET['dept']) ? mysqli_real_escape_string($conn, $_GET['dept']) : '';

$where_clauses = [];
if (!empty($search)) {
    $where_clauses[] = "(name LIKE '%$search%' OR prn LIKE '%$search%' OR email LIKE '%$search%')";
}
if (!empty($dept_filter) && $dept_filter !== 'All') {
    $where_clauses[] = "department = '$dept_filter'";
}

$where_sql = count($where_clauses) > 0 ? "WHERE " . implode(' AND ', $where_clauses) : "";
$sql = "SELECT * FROM students $where_sql ORDER BY id DESC";
$result = mysqli_query($conn, $sql);

// Summary count
$total_query = mysqli_query($conn, "SELECT COUNT(*) as total, AVG(gpa) as avg_gpa FROM students");
$summary = mysqli_fetch_assoc($total_query);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management CRUD | PHP & MySQL (Assignment 8)</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            padding: 30px 10px;
        }
        .main-card {
            background: white;
            border-radius: 18px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            overflow: hidden;
        }
        .header-section {
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            color: white;
            padding: 30px;
        }
    </style>
</head>
<body>
    <div class="container max-w-5xl">
        <div class="main-card mb-4">
            <div class="header-section d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                    <span class="badge bg-light text-primary fw-bold mb-2 px-3 py-2">WTL Assignment 8</span>
                    <h2 class="fw-bold mb-1">Student Management System (PHP CRUD)</h2>
                    <p class="mb-0 text-white-50">Create, Read, Update, Delete with MySQL Database through XAMPP</p>
                </div>
                <div>
                    <a href="create.php" class="btn btn-light text-primary fw-bold rounded-pill px-4 py-2 shadow-sm">
                        <i class="bi bi-person-plus-fill me-1"></i> Add New Student
                    </a>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="row g-0 border-bottom text-center bg-light">
                <div class="col-6 py-3 border-end">
                    <span class="text-muted small">Total Registered Students</span>
                    <h4 class="fw-bold text-primary mb-0"><?php echo $summary['total'] ?? 0; ?></h4>
                </div>
                <div class="col-6 py-3">
                    <span class="text-muted small">Average Academic GPA</span>
                    <h4 class="fw-bold text-success mb-0"><?php echo number_format($summary['avg_gpa'] ?? 0, 2); ?></h4>
                </div>
            </div>

            <!-- Filter & Search Controls -->
            <div class="p-4 border-bottom bg-white">
                <form method="GET" class="row g-2 align-items-center">
                    <div class="col-md-5">
                        <div class="input-group">
                            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
                            <input type="text" name="search" class="form-control border-start-0" placeholder="Search by PRN, Name, Email..." value="<?php echo htmlspecialchars($search); ?>">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <select name="dept" class="form-select">
                            <option value="All" <?php if($dept_filter==='All'||empty($dept_filter)) echo 'selected'; ?>>All Departments</option>
                            <option value="Computer" <?php if($dept_filter==='Computer') echo 'selected'; ?>>Computer</option>
                            <option value="IT" <?php if($dept_filter==='IT') echo 'selected'; ?>>IT</option>
                            <option value="AI&DS" <?php if($dept_filter==='AI&DS') echo 'selected'; ?>>AI&DS</option>
                            <option value="ENTC" <?php if($dept_filter==='ENTC') echo 'selected'; ?>>ENTC</option>
                        </select>
                    </div>
                    <div class="col-md-3 d-flex gap-2">
                        <button type="submit" class="btn btn-primary w-100 rounded-pill">Filter</button>
                        <?php if(!empty($search) || !empty($dept_filter)): ?>
                            <a href="index.php" class="btn btn-outline-secondary rounded-pill">Reset</a>
                        <?php endif; ?>
                    </div>
                </form>
            </div>

            <!-- Table -->
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light small">
                        <tr>
                            <th class="ps-4">PRN</th>
                            <th>Student Name</th>
                            <th>Email Address</th>
                            <th>Department</th>
                            <th>Semester</th>
                            <th>GPA</th>
                            <th class="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if(mysqli_num_rows($result) > 0): ?>
                            <?php while($row = mysqli_fetch_assoc($result)): ?>
                                <tr>
                                    <td class="ps-4 fw-bold text-dark"><?php echo htmlspecialchars($row['prn']); ?></td>
                                    <td class="fw-semibold"><?php echo htmlspecialchars($row['name']); ?></td>
                                    <td><small class="text-muted"><?php echo htmlspecialchars($row['email']); ?></small></td>
                                    <td><span class="badge bg-primary-subtle text-primary"><?php echo htmlspecialchars($row['department']); ?></span></td>
                                    <td>Sem <?php echo htmlspecialchars($row['semester']); ?></td>
                                    <td class="fw-bold text-success"><?php echo htmlspecialchars($row['gpa']); ?></td>
                                    <td class="text-end pe-4">
                                        <a href="edit.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-outline-primary rounded-pill me-1" title="Edit Student">
                                            <i class="bi bi-pencil-square"></i> Edit
                                        </a>
                                        <a href="delete.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-outline-danger rounded-pill" onclick="return confirm('Are you sure you want to delete this student record?');" title="Delete Student">
                                            <i class="bi bi-trash"></i> Delete
                                        </a>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="7" class="text-center py-5 text-muted">
                                    <i class="bi bi-folder-x fs-1 d-block mb-2 text-secondary"></i>
                                    No student records found in database. <a href="create.php" class="text-primary fw-semibold">Add a new student</a>.
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
