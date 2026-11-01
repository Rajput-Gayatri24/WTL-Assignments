# WTL Assignment 9: Node.js & Express.js RESTful API

## Problem Statement
Write code using Node.js and Express.js to create a back-end server. Create basic routes to serve static files and JSON data, then extend it to include a RESTful API with GET, POST, PUT, and DELETE operations for a student data object. Test all routes using Postman.

## How to Run:
```bash
cd express-student-api
npm install
node server.js
```
The server will start on `http://localhost:3000`.

## Endpoints:
1. **Static Files:**
   - `GET /` &bull; Serves `public/index.html` (Interactive Web Dashboard)
   - `GET /style.css` &bull; Serves static CSS
2. **JSON Data Routes:**
   - `GET /api/info` &bull; Serves JSON information about college and subject
   - `GET /api/metadata` &bull; Serves server uptime and system metadata
3. **Student RESTful API (CRUD):**
   - `GET /api/students` &bull; Get all students (Supports optional query search `?search=aarav` or `?department=Computer`)
   - `GET /api/students/:id` &bull; Get single student by numeric ID
   - `POST /api/students` &bull; Create new student record (Body: `{ "name", "prn", "email", "department", "year", "gpa" }`)
   - `PUT /api/students/:id` &bull; Update existing student record
   - `DELETE /api/students/:id` &bull; Delete student record by ID

## Postman Testing:
Open Postman, click **Import**, select `Postman_Student_API_Collection.json`, and run the prepared requests to test all endpoints!
