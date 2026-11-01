// =========================================================================
// WTL Assignment 10: Serverless Function for Vercel / Netlify
// Read-Only Summary Analytics & Top-Performing Students Endpoint
// =========================================================================

const mongoose = require('mongoose');

// Cached MongoDB Connection for Serverless Execution Environment
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_wtl_db';

  const connection = await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false
  });

  cachedDb = connection;
  return cachedDb;
}

// Student Schema definition (self-contained for serverless compatibility)
const Student = mongoose.models.Student || mongoose.model('Student', new mongoose.Schema({
  name: String,
  prn: String,
  email: String,
  department: String,
  year: String,
  semester: Number,
  gpa: Number,
  skills: [String]
}, { timestamps: true }));

/**
 * Serverless Function Handler
 * Callable via: GET /api/summary (in Express or deployed on Vercel/Netlify)
 */
module.exports = async function handler(req, res) {
  // Set CORS headers for serverless
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow read-only GET requests as per syllabus requirement
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Serverless summary endpoint is read-only (GET).'
    });
  }

  try {
    await connectToDatabase();

    // 1. Total student count
    const totalStudents = await Student.countDocuments();

    // 2. Department-wise breakdown using MongoDB Aggregation Pipeline
    const departmentBreakdown = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          averageGpa: { $avg: '$gpa' }
        }
      },
      {
        $project: {
          department: '$_id',
          count: 1,
          averageGpa: { $round: ['$averageGpa', 2] },
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 3. Class-wide GPA Metrics
    const gpaMetrics = await Student.aggregate([
      {
        $group: {
          _id: null,
          avgGpa: { $avg: '$gpa' },
          maxGpa: { $max: '$gpa' },
          minGpa: { $min: '$gpa' }
        }
      }
    ]);

    // 4. Top-performing students (Top 5 sorted by GPA descending)
    const topPerformingStudents = await Student.find()
      .sort({ gpa: -1 })
      .limit(5)
      .select('name prn department gpa skills');

    // 5. Structure Summary Response
    return res.status(200).json({
      success: true,
      service: 'WTL Assignment 10 Serverless Analytics Function',
      environment: process.env.VERCEL ? 'Vercel Serverless' : 'Local Serverless Simulation',
      timestamp: new Date().toISOString(),
      summary: {
        totalStudents,
        classAverageGpa: gpaMetrics[0] ? parseFloat(gpaMetrics[0].avgGpa.toFixed(2)) : 0,
        highestGpa: gpaMetrics[0] ? gpaMetrics[0].maxGpa : 0,
        lowestGpa: gpaMetrics[0] ? gpaMetrics[0].minGpa : 0,
        departmentDistribution: departmentBreakdown,
        topPerformingStudents: topPerformingStudents.map((s, idx) => ({
          rank: idx + 1,
          name: s.name,
          prn: s.prn,
          department: s.department,
          gpa: s.gpa,
          skills: s.skills
        }))
      }
    });

  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate summary report from MongoDB',
      error: error.message
    });
  }
};
