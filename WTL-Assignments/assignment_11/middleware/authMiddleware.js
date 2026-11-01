const jwt = require('jsonwebtoken');
const User = require('../models/User');

// =========================================================================
// WTL Assignment 11: JWT Authentication & Authorization Middleware
// =========================================================================

const JWT_SECRET = process.env.JWT_SECRET || 'wtl_secret_jwt_key_sanjivani_2026_super_secure';

/**
 * Middleware to verify JSON Web Token (JWT) on protected routes
 */
exports.verifyToken = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check for token in Authorization Header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      // Fallback: Check token in query param for testing in browser
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access Denied! No JWT token provided in Authorization header (Bearer <token>).'
      });
    }

    // 2. Verify Token with JWT Secret
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Attach decoded user payload to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'JWT Token has expired! Please log in again to obtain a new token.',
        error: error.message
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid JWT Token! Token signature verification failed.',
      error: error.message
    });
  }
};

/**
 * Middleware for Role-Based Access Control (RBAC)
 */
exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user?.role || 'Guest'}' is not authorized to access this resource. Required: [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
};
