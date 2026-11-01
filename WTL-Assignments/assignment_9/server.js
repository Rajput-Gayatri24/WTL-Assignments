const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. MIDDLEWARES
// ==========================================
// Enable CORS for all origins
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Serve Static Files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 2. IN-MEMORY DATASET (STUDENT OBJECTS)
// ==========================================
let students = [
  {
    id: 1,
    name: "Aarav Sharma",
    prn: "2024CS101",
    email: "aarav.sharma@example.com",
    department: "Computer Science",
    year: "TY",
    gpa: 3.85,
    skills: ["React", "Node.js", "Python"]
  },
  {
    id: 2,
    name: "Ananya Patel",
    prn: "2024IT102",
    email: "ananya.patel@example.com",
    department: "Information Technology",
    year: "TY",
    gpa: 3.92,
    skills: ["Java", "SQL", "Spring Boot"]
  },
  {
    id: 3,
    name: "Rohan Verma",
    prn: "2024ENTC103",
    email: "rohan.verma@example.com",
    department: "Electronics & Telecom",
    year: "SY",
    gpa: 3.60,
    skills: ["C++", "Embedded C", "IoT"]
  }
];

let nextStudentId = 4;

// ==========================================
// 3. BASIC ROUTES (Static & Simple JSON)
// ==========================================

// Serve static HTML landing page explicitly (or default index.html via express.static)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve Basic Server Info in JSON format
app.get('/api/info', (req, res) => {
  res.json({
    status: "success",
    serverName: "Student Data REST API Server",
    version: "1.0.0",
    environment: "development",
    timestamp: new Date().toISOString(),
    endpoints: {
      static: "/",
      serverInfo: "/api/info",
      studentsAPI: "/api/students"
    }
  });
});

// Serve JSON metadata / config demo
app.get('/api/metadata', (req, res) => {
  res.json({
    app: "SCOE Student Portal Backend",
    maintainedBy: "Node.js & Express.js Engine",
    departmentsAvailable: ["Computer Science", "Information Technology", "Electronics & Telecom", "Mechanical"],
    academicYears: ["FE", "SE", "TY", "BTech"],
    totalRegisteredStudents: students.length
  });
});

// ==========================================
// 4. RESTful API FOR STUDENT OBJECTS (CRUD)
// ==========================================

/**
 * @route   GET /api/students
 * @desc    Fetch all students (Supports search & department query params)
 * @access  Public
 */
app.get('/api/students', (req, res) => {
  const { department, search } = req.query;
  let result = [...students];

  if (department) {
    result = result.filter(
      (s) => s.department.toLowerCase() === department.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.prn.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    status: "success",
    count: result.length,
    data: result
  });
});

/**
 * @route   GET /api/students/:id
 * @desc    Fetch a single student by ID
 * @access  Public
 */
app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({
      status: "fail",
      error: "Student Not Found",
      message: `No student found with ID: ${id}`
    });
  }

  res.status(200).json({
    status: "success",
    data: student
  });
});

/**
 * @route   POST /api/students
 * @desc    Create / Add a new student object
 * @access  Public
 */
app.post('/api/students', (req, res) => {
  const { name, prn, email, department, year, gpa, skills } = req.body;

  // Validation
  if (!name || !prn || !email || !department) {
    return res.status(400).json({
      status: "fail",
      error: "Validation Error",
      message: "Please provide name, prn, email, and department."
    });
  }

  // Check duplicate PRN or Email
  const existingPRN = students.find((s) => s.prn.toLowerCase() === prn.toLowerCase());
  if (existingPRN) {
    return res.status(400).json({
      status: "fail",
      error: "Conflict Error",
      message: `Student with PRN '${prn}' already exists.`
    });
  }

  const newStudent = {
    id: nextStudentId++,
    name: name.trim(),
    prn: prn.trim().toUpperCase(),
    email: email.trim().toLowerCase(),
    department: department.trim(),
    year: year || "TY",
    gpa: parseFloat(gpa) || 0.0,
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
  };

  students.push(newStudent);

  res.status(201).json({
    status: "success",
    message: "Student record created successfully!",
    data: newStudent
  });
});

/**
 * @route   PUT /api/students/:id
 * @desc    Update an existing student object by ID
 * @access  Public
 */
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      status: "fail",
      error: "Student Not Found",
      message: `Cannot update. Student with ID ${id} does not exist.`
    });
  }

  const { name, prn, email, department, year, gpa, skills } = req.body;
  const currentStudent = students[studentIndex];

  // Create updated student object
  const updatedStudent = {
    ...currentStudent,
    name: name !== undefined ? name.trim() : currentStudent.name,
    prn: prn !== undefined ? prn.trim().toUpperCase() : currentStudent.prn,
    email: email !== undefined ? email.trim().toLowerCase() : currentStudent.email,
    department: department !== undefined ? department.trim() : currentStudent.department,
    year: year !== undefined ? year : currentStudent.year,
    gpa: gpa !== undefined ? parseFloat(gpa) : currentStudent.gpa,
    skills: skills !== undefined 
      ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()))
      : currentStudent.skills
  };

  students[studentIndex] = updatedStudent;

  res.status(200).json({
    status: "success",
    message: `Student ID ${id} updated successfully!`,
    data: updatedStudent
  });
});

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete a student record by ID
 * @access  Public
 */
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({
      status: "fail",
      error: "Student Not Found",
      message: `Cannot delete. Student with ID ${id} does not exist.`
    });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];

  res.status(200).json({
    status: "success",
    message: `Student ID ${id} deleted successfully!`,
    data: deletedStudent
  });
});

// ==========================================
// 5. ERROR HANDLING & FALLBACK ROUTE
// ==========================================

// Handle 404 Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    statusCode: 404,
    message: `Cannot ${req.method} ${req.originalUrl}. Route not found.`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error Stack:", err.stack);
  res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal Server Error",
    error: err.message
  });
});

// ==========================================
// 6. START EXPRESS SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Express RESTful Server listening on port ${PORT}`);
  console.log(`🌐 Static Web Dashboard: http://localhost:${PORT}`);
  console.log(`📡 JSON Metadata Route:  http://localhost:${PORT}/api/info`);
  console.log(`🎓 Student REST API:      http://localhost:${PORT}/api/students`);
  console.log(`=================================================`);
});
