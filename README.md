# 📚 SCMS — Smart College Management System

A full-stack college management system built with FastAPI, React, and MySQL.

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + SQLAlchemy + JWT Auth |
| Frontend | React 18 + Vite + Tailwind CSS |
| Database | MySQL 8.0 |

---

## ✅ Prerequisites

Install these before starting:

| Tool | Download |
|------|----------|
| Python 3.10+ | https://python.org |
| Node.js 18+ | https://nodejs.org |
| MySQL 8.0+ | https://dev.mysql.com/downloads/mysql/ |
| Git | https://git-scm.com |

---

## ⚡ Quick Setup (Windows — One Click)

### Step 1 — Clone the project
Open a terminal and run:
```bash
git clone https://github.com/Kamalapro05/Scms.git
cd Scms
```

### Step 2 — Run SETUP.bat
Double-click `SETUP.bat` OR run in terminal:
```bat
.\SETUP.bat
```
When asked, enter your **MySQL root password**.

Wait for it to finish ✅

### Step 3 — Run START.bat
Double-click `START.bat` OR run in terminal:
```bat
.\START.bat
```

Browser will open automatically at **http://localhost:3000** 🎉

---

## 🔑 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@scms.edu | Admin@123 |

---

## ⚠️ Important Notes

### If your MySQL password contains special characters like @
The SETUP.bat handles this automatically.
- Password `kamala@123` is stored as `kamala%40123` in the .env file
- This is normal and required for database URLs

### If SETUP.bat fails — run these manually in PowerShell:

**1. Drop old database:**
```powershell
mysql -u root -pYOUR_PASSWORD -e "DROP DATABASE IF EXISTS scms_db;"
```

**2. Create database:**
```powershell
Get-Content backend\schema.sql | mysql -u root -pYOUR_PASSWORD
```

**3. Create backend\.env file with this content:**
```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/scms_db
SECRET_KEY=your-ultra-secret-key-change-in-production-abc123xyz
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```
Note: If your password has @ symbol, replace it with %40 in DATABASE_URL only.
Example: kamala@123 becomes kamala%40123

**4. Setup backend:**
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

**5. Setup frontend:**
```powershell
cd frontend
npm install
cd ..
```

---

## 🚀 Starting the App Manually

**Terminal 1 — Backend:**
```bash
cd backend
venv\Scripts\activate
python run.py
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open browser at **http://localhost:3000**

---

## 🔧 Troubleshooting

| Error | Fix |
|-------|-----|
| Access denied for user root | Wrong MySQL password in .env |
| Can't connect to MySQL server on 123@localhost | Replace @ with %40 in DATABASE_URL |
| Table already exists | Run DROP DATABASE scms_db in MySQL then setup again |
| ERR_CONNECTION_REFUSED on port 8000 | Backend is not running, start with python run.py |
| npm install fails | Run npm install --legacy-peer-deps |
| Port 8000 already in use | Change port in backend/run.py |
| Port 3000 already in use | Change port in frontend/vite.config.js |

---

## 📡 API Endpoints

| Module | Endpoints |
|--------|-----------|
| Auth | POST /api/auth/login, GET /api/auth/me |
| Students | GET/POST /api/students/, PUT/DELETE /api/students/{id} |
| Faculty | GET/POST /api/faculty/, PUT/DELETE /api/faculty/{id} |
| Courses | GET/POST /api/courses/, POST /api/courses/enroll |
| Attendance | POST /api/attendance/mark, GET /api/attendance/summary/{id} |
| Marks | POST /api/marks/exams, POST /api/marks/upload, GET /api/marks/gradesheet/{id} |
| Dashboard | GET /api/dashboard/admin/stats, /faculty/stats, /student/stats |

API docs available at: http://localhost:8000/docs

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| Admin | Manage all students, faculty, courses, view all data |
| Faculty | Mark attendance, upload marks for assigned courses |
| Student | View own attendance, grades, enrolled courses |