const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// =========================================================================
// WTL Assignment 10: Express.js CRUD Routes for Mongoose Student Model
// =========================================================================

// 1. GET ALL STUDENTS (With optional department filter, search & sort)
router.get('/', async (req, res) => {
  try {
    const { department, search, sort } = req.query;
    let query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { prn: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'gpa_desc') sortOption = { gpa: -1 };
    if (sort === 'gpa_asc') sortOption = { gpa: 1 };
    if (sort === 'name') sortOption = { name: 1 };

    const students = await Student.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students from MongoDB',
      error: error.message
    });
  }
});

// 2. GET SINGLE STUDENT BY ID OR PRN
router.get('/:idOrPrn', async (req, res) => {
  try {
    const { idOrPrn } = req.params;
    let student;

    // Check if valid ObjectId, else query by PRN
    if (idOrPrn.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(idOrPrn);
    } else {
      student = await Student.findOne({ prn: idOrPrn.toUpperCase() });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with identifier '${idOrPrn}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student record',
      error: error.message
    });
  }
});

// 3. POST - CREATE NEW STUDENT RECORD
router.post('/', async (req, res) => {
  try {
    const { name, prn, email, department, year, semester, gpa, skills } = req.body;

    // Check if PRN or Email already exists
    const existing = await Student.findOne({
      $or: [{ prn: prn?.toUpperCase() }, { email: email?.toLowerCase() }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A student with this PRN or Email already exists in MongoDB'
      });
    }

    const student = new Student({
      name,
      prn,
      email,
      department,
      year: year || 'TY',
      semester: semester || 5,
      gpa: Number(gpa),
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : [])
    });

    const savedStudent = await student.save();

    res.status(201).json({
      success: true,
      message: 'Student record created successfully in MongoDB',
      data: savedStudent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed while creating student',
      error: error.message
    });
  }
});

// 4. PUT - UPDATE EXISTING STUDENT RECORD
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.prn) updateData.prn = updateData.prn.toUpperCase();
    if (updateData.email) updateData.email = updateData.email.toLowerCase();

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update student record',
      error: error.message
    });
  }
});

// 5. DELETE - DELETE STUDENT RECORD
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Student '${deletedStudent.name}' (PRN: ${deletedStudent.prn}) deleted from MongoDB`,
      data: deletedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete student record',
      error: error.message
    });
  }
});

// 6. SEED DEMO DATA ROUTE
router.post('/seed/demo', async (req, res) => {
  try {
    const count = await Student.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: `Database already contains ${count} records. Seeding skipped.`,
        count
      });
    }

    const demoStudents = [
      {
        name: "Gaurav Rajput",
        prn: "2024CS101",
        email: "gaurav.rajput@example.com",
        department: "Computer",
        year: "TY",
        semester: 5,
        gpa: 9.45,
        skills: ["React", "Node.js", "Express", "MongoDB", "TypeScript"]
      },
      {
        name: "Aditya Patil",
        prn: "2024CS102",
        email: "aditya.patil@example.com",
        department: "Computer",
        year: "TY",
        semester: 5,
        gpa: 8.80,
        skills: ["Java", "Spring Boot", "MySQL", "Docker"]
      },
      {
        name: "Snehal Kulkarni",
        prn: "2024IT201",
        email: "snehal.kulkarni@example.com",
        department: "IT",
        year: "TY",
        semester: 5,
        gpa: 9.20,
        skills: ["Python", "Flask", "MongoDB", "Cyber Security"]
      },
      {
        name: "Rohan Deshmukh",
        prn: "2024AI301",
        email: "rohan.deshmukh@example.com",
        department: "AI&DS",
        year: "TY",
        semester: 5,
        gpa: 8.65,
        skills: ["TensorFlow", "PyTorch", "Python", "Data Science"]
      },
      {
        name: "Ananya Joshi",
        prn: "2024CS103",
        email: "ananya.joshi@example.com",
        department: "Computer",
        year: "TY",
        semester: 5,
        gpa: 9.70,
        skills: ["React", "Tailwind", "Next.js", "GraphQL"]
      }
    ];

    const inserted = await Student.insertMany(demoStudents);
    res.status(201).json({
      success: true,
      message: 'Demo students seeded successfully into MongoDB',
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Seeding failed',
      error: error.message
    });
  }
});

module.exports = router;
