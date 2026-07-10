# HR Module Backend

A RESTful backend API for a basic HR Management system, built as part of an internship project. It supports user authentication, role-based access control (Admin/Employee), employee record management, department management, and email-based password recovery.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (stored in httpOnly cookies)
- **Validation:** Zod
- **Password Hashing:** bcrypt
- **Email Service:** Resend (SMTP-based password reset)
- **Deployment:** Railway

## Features

- User registration and login with hashed passwords (bcrypt, 10 salt rounds)
- JWT-based authentication via httpOnly cookies
- Role-based access control (`admin`, `employee`)
- Email-based forgot password flow (6-digit verification code sent to real inbox)
- Employee CRUD operations with pagination
- Department CRUD operations
- Self-service profile updates (name/email) for logged-in users
- Ownership-based access control (employees can only view/manage their own records)
- Centralized request validation using Zod schemas
- Consistent error handling with appropriate HTTP status codes

## Project Structure
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.routes.js
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   └── auth.validation.js
│   ├── employees/
│   │   ├── employee.routes.js
│   │   ├── employee.controller.js
│   │   ├── employee.service.js
│   │   └── employee.validation.js
│   └── departments/
│       ├── department.routes.js
│       ├── department.controller.js
│       ├── department.service.js
│       └── department.validation.js
├── middlewares/
│   ├── auth.middleware.js
│   └── validate.middleware.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── mailer.js
├── prismaClient.js
└── server.js
```

## Database Schema

**User** — id, name, email, password, role, resetToken, resetTokenExpiry, createdAt
**Department** — id, name
**Employee** — id, userId, departmentId, salary, position, createdAt

**Relations:**
- User ↔ Employee — one-to-one
- Department ↔ Employee — one-to-many

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/wajiha0101/Employee-Management.git
cd hr-module-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:
DATABASE_URL="postgresql://user:password@host:5432/hr_module_db?schema=public"
JWT_SECRET="your_long_random_secret"
JWT_EXPIRES_IN="1d"
PORT=5000
NODE_ENV="development"
COOKIE_SECURE=false
RESEND_API_KEY="your_resend_api_key"
### 4. Run database migrations
```bash
npx prisma generate --schema=src/prisma/schema.prisma
npx prisma migrate dev --schema=src/prisma/schema.prisma
```

### 5. Seed initial departments
```bash
npm run seed
```
Creates 4 default departments: HR, IT, Finance, Marketing.

### 6. Start the server
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

## API Routes

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user |
| POST | `/auth/login` | Public | Login and receive a JWT cookie |
| POST | `/auth/logout` | Public | Clear the auth cookie |
| POST | `/auth/forgot-password` | Public | Request a password reset code via email |
| POST | `/auth/reset-password` | Public | Submit code + new password to reset |
| PUT | `/auth/profile` | Logged-in user | Update own name/email |

### Employees
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/employees?page=&limit=` | Admin | List all employees (paginated) |
| POST | `/employees` | Admin | Create an employee profile |
| GET | `/employees/:id` | Admin or owner | View an employee's profile |
| PUT | `/employees/:id` | Admin | Update salary, position, department |
| DELETE | `/employees/:id` | Admin | Delete an employee record |
| GET | `/employees/:id/salary` | Admin or owner | View an employee's salary |

### Departments
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/departments` | Admin | List all departments |
| POST | `/departments` | Admin | Create a department |
| PUT | `/departments/:id` | Admin | Update a department |
| DELETE | `/departments/:id` | Admin | Delete a department |

## Authorization Model

- `restrictToLoggedInUserOnly` — verifies the JWT cookie and attaches the decoded user to `req.user`.
- `restrictTo(...roles)` — a reusable middleware that accepts any number of allowed roles and checks `req.user.role` against them.
- Ownership checks (e.g., an employee viewing their own record) are enforced at the service layer by comparing `req.user.id` against the record's `userId`, rather than hardcoded into route structure.

## Error Handling

All endpoints follow a consistent response shape and use standard HTTP status codes:
- `200` – Success
- `201` – Resource created
- `400` – Validation error / bad request
- `401` – Not authenticated
- `403` – Not authorized (wrong role or not the resource owner)
- `404` – Resource not found
- `500` – Unexpected server error

## Author

Wajiha Naseer — Backend Development Internship Project






















