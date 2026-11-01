const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wtl_auth_db';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(` MongoDB Connected for JWT Auth System: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.warn(` MongoDB Connection Warning: ${err.message}`);
    console.warn('  Ensure mongod service is running locally or specify Atlas URI in .env');
  });

// 1. Mount Auth Routes (Public: Register & Login)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// 2. Mount Protected Routes (Requires JWT Bearer Token)
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/protected', protectedRoutes);

// Root route serves the interactive GUI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` WTL Assignment 11: JWT Authentication Server Active`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Register Endpoint: http://localhost:${PORT}/api/auth/register`);
  console.log(` Login Endpoint:    http://localhost:${PORT}/api/auth/login`);
  console.log(` Protected Profile: http://localhost:${PORT}/api/protected/profile`);
  console.log(`====================================================`);
});
