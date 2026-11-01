# WTL Assignment 10: MongoDB Mongoose CRUD & Serverless Function

## Problem Statement
Connect a Node.js backend to MongoDB using Mongoose. Create a schema for student data and implement CRUD operations through Express.js routes. In addition, implement a serverless function (deployed on Vercel or Netlify) that connects to the same MongoDB database and provides read-only access to summary information, such as the total number of students or a list of top-performing students. This function should be accessible via a separate API endpoint and tested using Postman or browser.

## Project Structure:
- `models/Student.js` &bull; Mongoose Schema with validation and virtuals
- `routes/studentRoutes.js` &bull; Express RESTful CRUD API routes (`/api/students`)
- `api/summary.js` &bull; Serverless Function for Vercel/Netlify with DB connection pooling
- `server.js` &bull; Node.js Express server mounting CRUD routes and serverless summary endpoint
- `vercel.json` &bull; Configuration for Vercel serverless deployment
- `public/index.html` &bull; Interactive Web Dashboard
- `Assignment_10_Postman_Collection.json` &bull; Postman collection for all endpoints

## How to Run:
```bash
cd assignment-10-mongodb-mongoose
npm install
node server.js
```
Open `http://localhost:5000` in your browser.

## Endpoints:
1. `GET /api/students` &bull; Get all students
2. `POST /api/students` &bull; Create student
3. `GET /api/students/:idOrPrn` &bull; Get student by ID or PRN
4. `PUT /api/students/:id` &bull; Update student
5. `DELETE /api/students/:id` &bull; Delete student
6. `GET /api/summary` &bull; **Serverless Function Endpoint** providing aggregate metrics (total students, department breakdown, class average GPA, top-performing students)
