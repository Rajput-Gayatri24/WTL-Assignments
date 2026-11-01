const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// =========================================================================
// WTL Assignment 11: Protected Routes (Requires valid JWT Token)
// =========================================================================

// 1. PROTECTED ROUTE: User Profile
// Accessible by ANY authenticated user (student, faculty, admin)
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected user profile accessed successfully via verified JWT token.',
    user: req.user,
    tokenIssuedAt: new Date(req.user.iat * 1000).toLocaleString(),
    tokenExpiresAt: new Date(req.user.exp * 1000).toLocaleString()
  });
});

// 2. PROTECTED ROUTE: Confidential Student Academic Records
// Accessible only by authenticated users
router.get('/academic-records', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Confidential academic data unlocked with JWT Bearer Token.',
    records: [
      { subject: 'Web Technology Lab (WTL)', marks: 95, grade: 'O', status: 'Passed' },
      { subject: 'Theory of Computation (TOC)', marks: 88, grade: 'A+', status: 'Passed' },
      { subject: 'Cyber Security (CS)', marks: 92, grade: 'O', status: 'Passed' },
      { subject: 'AMLIS', marks: 86, grade: 'A+', status: 'Passed' }
    ],
    requestedBy: req.user.email
  });
});

// 3. ROLE-PROTECTED ROUTE: Faculty / Admin Dashboard
// Accessible ONLY if JWT role is 'faculty' or 'admin'
router.get('/admin-dashboard', verifyToken, authorizeRoles('admin', 'faculty'), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Access granted to restricted Faculty/Admin portal for user: ${req.user.name} (${req.user.role})`,
    adminMetrics: {
      totalUsers: 142,
      activeSessions: 18,
      serverStatus: 'Healthy',
      securityAudit: '0 breaches detected'
    }
  });
});

module.exports = router;
