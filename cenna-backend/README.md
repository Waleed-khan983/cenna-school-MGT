# CENNA School & College Pabbi — Node.js Backend API

Full REST API backend for the CENNA School LMS system.  
**Stack:** Node.js, Express.js, MongoDB (Mongoose), JWT, Cloudinary, Nodemailer

---

## 📁 Project Structure

```
cenna-backend/
│
├── server.js                    ← Entry point
├── .env.example                 ← Environment variables template
├── .gitignore
│
├── config/
│   ├── db.js                    ← MongoDB connection
│   └── cloudinary.js            ← File upload config
│
├── models/
│   ├── User.js                  ← Base user (all roles)
│   ├── Student.js               ← Student profile
│   ├── Academic.js              ← Teacher, Parent, Class, Subject
│   ├── Academic2.js             ← Attendance, Result, Fee
│   └── LMS.js                   ← Lecture, Assignment, Quiz, Notification, News, Gallery, Admission
│
├── controllers/
│   ├── authController.js        ← Login, register, password reset
│   ├── studentController.js     ← Student CRUD
│   ├── academicController.js    ← Teacher, Parent, Class, Subject CRUD
│   ├── attendanceController.js  ← Mark, view, report attendance
│   ├── lmsController.js         ← Results, Fees, Assignments, Lectures, Quizzes
│   └── miscController.js        ← Notifications, News, Gallery, Dashboard, Admissions
│
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── teacherRoutes.js
│   ├── parentRoutes.js
│   ├── classRoutes.js
│   ├── subjectRoutes.js
│   ├── attendanceRoutes.js
│   ├── resultRoutes.js
│   ├── feeRoutes.js
│   ├── assignmentRoutes.js
│   ├── lectureRoutes.js
│   ├── quizRoutes.js
│   ├── notificationRoutes.js
│   ├── newsRoutes.js
│   ├── galleryRoutes.js
│   └── dashboardRoutes.js
│
├── middleware/
│   ├── auth.js                  ← JWT protect + role-based authorize
│   └── error.js                 ← Global error handler
│
└── utils/
    ├── helpers.js               ← Email, SMS, grade calc, pagination
    └── seeder.js                ← Seed database with demo data
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd cenna-backend
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env with your real values
```

### 3. Seed the Database
```bash
npm run seed
```

### 4. Start the Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 🔑 API Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Get the token by calling `POST /api/auth/login`.

---

## 📡 Complete API Reference

### 🔐 AUTH ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/login` | Public | Login (any role) |
| POST | `/api/auth/register` | Admin | Create user account |
| GET | `/api/auth/me` | Private | Get my profile |
| PUT | `/api/auth/update-profile` | Private | Update name/phone |
| PUT | `/api/auth/change-password` | Private | Change password |
| POST | `/api/auth/forgot-password` | Public | Send reset email |
| PUT | `/api/auth/reset-password/:token` | Public | Reset password |
| POST | `/api/auth/logout` | Private | Logout |

#### Login Request
```json
POST /api/auth/login
{
  "email": "ali@cennaschool.edu.pk",
  "password": "Student@123",
  "role": "student"
}
```
#### Login Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "...", "name": "Ali Hassan", "role": "student" },
  "profile": { "rollNumber": "2025-001", "class": { "displayName": "Grade 9A" } }
}
```

---

### 🎓 STUDENT ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/students` | Admin, Teacher | List all students |
| GET | `/api/students/me` | Student | My own profile |
| GET | `/api/students/:id` | Admin, Teacher | Get student by ID |
| GET | `/api/students/class/:classId` | Admin, Teacher | Students in a class |
| POST | `/api/students` | Admin | Create student + user account |
| PUT | `/api/students/:id` | Admin | Update student |
| DELETE | `/api/students/:id` | Admin | Delete student |

#### Create Student Body
```json
POST /api/students
{
  "name": "Muhammad Ali", "email": "m.ali@cennaschool.edu.pk",
  "phone": "03001234567", "fatherName": "Haji Khan",
  "dob": "2010-05-15", "gender": "Male", "classId": "<classId>",
  "section": "A", "parentId": "<parentId>", "address": "Pabbi"
}
```

---

### 👨‍🏫 TEACHER ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/teachers` | Admin, Teacher | List all teachers |
| GET | `/api/teachers/me` | Teacher | My teacher profile |
| GET | `/api/teachers/:id` | Admin, Teacher | Get teacher |
| POST | `/api/teachers` | Admin | Create teacher |
| PUT | `/api/teachers/:id` | Admin | Update teacher |
| DELETE | `/api/teachers/:id` | Admin | Delete teacher |

---

### 👨‍👩‍👧 PARENT ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/parents` | Admin | List all parents |
| GET | `/api/parents/me` | Parent | My parent profile + children |
| GET | `/api/parents/:id` | Admin | Get parent |
| POST | `/api/parents` | Admin | Create parent |
| PUT | `/api/parents/:id` | Admin, Parent | Update parent |
| DELETE | `/api/parents/:id` | Admin | Delete parent |

---

### 🏫 CLASS & SUBJECT ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/classes` | All | List all classes |
| GET | `/api/classes/:id` | All | Get class details |
| POST | `/api/classes` | Admin | Create class |
| PUT | `/api/classes/:id` | Admin | Update class |
| DELETE | `/api/classes/:id` | Admin | Deactivate class |
| GET | `/api/subjects` | All | List all subjects |
| POST | `/api/subjects` | Admin | Create subject |
| PUT | `/api/subjects/:id` | Admin | Update subject |
| DELETE | `/api/subjects/:id` | Admin | Deactivate subject |

---

### 📊 ATTENDANCE ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/attendance/mark` | Teacher, Admin | Mark bulk attendance |
| GET | `/api/attendance/me` | Student | My attendance record |
| GET | `/api/attendance/class/:classId` | Teacher, Admin | Class attendance by date |
| GET | `/api/attendance/student/:studentId` | Admin, Parent, Teacher | Student attendance |
| GET | `/api/attendance/report/monthly` | Teacher, Admin | Monthly report |

#### Mark Attendance Body
```json
POST /api/attendance/mark
{
  "classId": "<classId>",
  "date": "2025-03-01",
  "records": [
    { "studentId": "<id>", "status": "Present", "remark": "" },
    { "studentId": "<id>", "status": "Absent",  "remark": "Sick" },
    { "studentId": "<id>", "status": "Late",    "remark": "10 min late" }
  ]
}
```

---

### 🏆 RESULT ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/results` | Teacher, Admin | Enter/update marks |
| GET | `/api/results` | Teacher, Admin | Get class results |
| GET | `/api/results/me` | Student | My results |
| GET | `/api/results/student/:studentId` | Admin, Parent, Teacher | Student results |

#### Enter Results Body
```json
POST /api/results
{
  "studentId": "<id>", "classId": "<id>",
  "examType": "Mid-Term", "session": "2024-25",
  "examMonth": "February 2025",
  "marks": [
    { "subject": "<mathId>",    "maxMarks": 100, "obtained": 82 },
    { "subject": "<englishId>", "maxMarks": 100, "obtained": 88 },
    { "subject": "<physicsId>", "maxMarks": 75,  "obtained": 60 }
  ]
}
```

---

### 💰 FEE ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/fees/generate` | Admin | Generate fee challan |
| PUT | `/api/fees/collect/:id` | Admin | Mark fee as collected |
| GET | `/api/fees` | Admin | All fees (with filters) |
| GET | `/api/fees/me` | Student | My fee history |
| GET | `/api/fees/defaulters` | Admin | Unpaid fees list |
| GET | `/api/fees/student/:studentId` | Admin, Parent | Student fee history |

#### Generate Challan Body
```json
POST /api/fees/generate
{
  "studentId": "<id>", "month": "March 2025",
  "year": 2025, "monthNum": 3,
  "monthlyFee": 2000, "examFee": 0, "admissionFee": 0,
  "dueDate": "2025-03-10"
}
```

---

### 📝 ASSIGNMENT ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/assignments` | Teacher, Admin | Create assignment |
| GET | `/api/assignments` | All | List assignments |
| POST | `/api/assignments/:id/submit` | Student | Submit assignment |
| PUT | `/api/assignments/:id/mark` | Teacher, Admin | Mark assignment |

---

### 📹 LECTURE ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/lectures` | Teacher, Admin | Upload lecture |
| GET | `/api/lectures` | All | List lectures |
| GET | `/api/lectures/my-progress` | Student | My watch progress |
| PUT | `/api/lectures/:id/progress` | Student | Update watch progress |

---

### ❓ QUIZ ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/quizzes` | Teacher, Admin | Create quiz |
| GET | `/api/quizzes` | All | List quizzes |
| GET | `/api/quizzes/:id/take` | Student | Get quiz (no answers) |
| POST | `/api/quizzes/:id/submit` | Student | Submit quiz (auto-checked) |
| GET | `/api/quizzes/:id/results` | Teacher, Admin | Quiz results |

#### Submit Quiz Body
```json
POST /api/quizzes/:id/submit
{
  "answers": [1, 0, 2, 1, 3],
  "timeTaken": 480
}
```

---

### 🔔 NOTIFICATION ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/notifications` | Teacher, Admin | Send notification |
| GET | `/api/notifications` | Admin | All notifications |
| GET | `/api/notifications/me` | All | My notifications |
| PUT | `/api/notifications/:id/read` | All | Mark as read |
| PUT | `/api/notifications/read-all` | All | Mark all read |

---

### 📰 NEWS & GALLERY ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/news` | Public | List published news |
| GET | `/api/news/:id` | Public | Get news item |
| POST | `/api/news` | Admin | Create news |
| PUT | `/api/news/:id` | Admin | Update news |
| DELETE | `/api/news/:id` | Admin | Delete news |
| GET | `/api/gallery` | Public | Gallery items |
| POST | `/api/gallery` | Admin | Upload gallery item |
| DELETE | `/api/gallery/:id` | Admin | Delete gallery item |

---

### 📊 DASHBOARD ROUTES
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/admin` | Admin | Admin dashboard stats |
| GET | `/api/dashboard/student` | Student | Student dashboard |
| GET | `/api/dashboard/teacher` | Teacher | Teacher dashboard |
| GET | `/api/dashboard/parent` | Parent | Parent dashboard |
| POST | `/api/dashboard/admission` | Public | Submit admission form |
| GET | `/api/dashboard/admission` | Admin | List admissions |
| PUT | `/api/dashboard/admission/:id` | Admin | Approve/reject admission |

---

## 🌐 Deployment Guide

### Option 1: Railway (Easiest — Free Tier)
1. Go to https://railway.app → Sign up with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select your backend repo
4. Add environment variables from `.env.example`
5. Railway auto-detects Node.js and deploys
6. Get your live URL instantly

### Option 2: Render (Free Tier)
1. Go to https://render.com → New → Web Service
2. Connect GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add env variables in the dashboard
6. Deploy

### Option 3: Heroku
```bash
heroku create cenna-school-api
heroku config:set MONGO_URI=your_uri JWT_SECRET=your_secret
git push heroku main
```

### Option 4: VPS (DigitalOcean / Linode)
```bash
# On your server
git clone <your-repo>
cd cenna-backend
npm install
cp .env.example .env
nano .env            # Fill in values
npm run seed         # Seed database
npm install -g pm2
pm2 start server.js --name cenna-api
pm2 save
pm2 startup
```

### MongoDB Atlas (Free Cloud Database)
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Add database user
4. Whitelist IP: `0.0.0.0/0` (all IPs)
5. Copy connection string → paste in `.env` as `MONGO_URI`

---

## 🔗 Connect Frontend to Backend

In your frontend HTML files, replace the demo alerts with real API calls:

```javascript
// Login
const res = await fetch('https://your-api.railway.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, role })
});
const data = await res.json();
localStorage.setItem('token', data.token);

// Authenticated request
const token = localStorage.getItem('token');
const dashboard = await fetch('https://your-api.railway.app/api/dashboard/student', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🔒 Security Features
- ✅ JWT Authentication (30-day expiry)
- ✅ bcrypt Password Hashing (12 rounds)
- ✅ Role-Based Access Control (Admin/Teacher/Student/Parent)
- ✅ Rate Limiting (100 req/15min global, 10 req/15min login)
- ✅ Helmet.js Security Headers
- ✅ MongoDB Injection Prevention (mongo-sanitize)
- ✅ CORS Protection
- ✅ Input Validation
- ✅ Global Error Handler (no stack traces in production)

---

## 🧪 Test Credentials (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cennaschool.edu.pk | Admin@123 |
| Teacher | fatima@cennaschool.edu.pk | Teacher@123 |
| Student | ali@cennaschool.edu.pk | Student@123 |
| Parent | parent1@cennaschool.edu.pk | Parent@123 |

---

**Built for:** CENNA School & College Pabbi  
**Developer:** MERN Stack Developer  
**Year:** 2026
