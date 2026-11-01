# WTL Assignment 11: Server-Side JWT Authentication & Protected Routes

## Problem Statement
Implement server-side user authentication with JWT and protected routes using Node.js, Express, MongoDB.

## Architecture & Features:
- **Password Security:** Passwords hashed with `bcryptjs` (salt rounds = 10) before persisting to MongoDB. Plain-text passwords never stored.
- **JWT Generation:** Token signed using `HS256` HMAC algorithm with secret key `JWT_SECRET` and expiration (`24h`).
- **Token Verification:** Middleware extracts `Authorization: Bearer <token>`, validates signature & expiry, and attaches user payload.
- **Role-Based Authorization:** Custom `authorizeRoles()` middleware protecting faculty/admin specific endpoints.
- **Postman Testing:** Pre-configured collection `Assignment_11_JWT_Postman_Collection.json`.
- **Interactive UI:** Open `http://localhost:5001` to test Register, Login, Token generation, and Protected route access visually.

## How to Run:
```bash
cd assignment-11-jwt-auth
npm install
node server.js
```
Open `http://localhost:5001` in your browser.

## API Endpoints:
1. `POST /api/auth/register` &bull; Register new user (Body: `{ name, email, password, role }`)
2. `POST /api/auth/login` &bull; Authenticate credentials & issue JWT token
3. `GET /api/protected/profile` &bull; Protected endpoint returning authenticated user's profile
4. `GET /api/protected/academic-records` &bull; Protected endpoint returning academic grades
5. `GET /api/protected/admin-dashboard` &bull; Role-protected route (Admin / Faculty only)
