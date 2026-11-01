const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_wtl_db';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(` Connected to MongoDB successfully at: ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.warn(` MongoDB Connection Warning: ${err.message}`);
    console.warn('  Ensure MongoDB service is running (mongod) or provide Atlas connection string in .env');
  });

// 1. Mount Student CRUD Routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

// 2. Mount Serverless Function Endpoint (Accessible locally or via Vercel /api/summary)
const summaryHandler = require('./api/summary');
app.get('/api/summary', (req, res) => {
  summaryHandler(req, res);
});

// Root route serves the interactive GUI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` WTL Assignment 10: Express + Mongoose Server Active`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` CRUD Endpoint: http://localhost:${PORT}/api/students`);
  console.log(` Serverless Endpoint: http://localhost:${PORT}/api/summary`);
  console.log(`====================================================`);
});
