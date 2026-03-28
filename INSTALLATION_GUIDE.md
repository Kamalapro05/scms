# 📚 SCMS — Smart College Management System
## Complete Installation Guide for VS Code

---

## 📋 Prerequisites

Install these before starting:

| Tool | Download |
|------|----------|
| Python 3.10+ | https://python.org |
| Node.js 18+ | https://nodejs.org |
| MySQL 8.0+ | https://dev.mysql.com/downloads/mysql/ |
| VS Code | https://code.visualstudio.com |
| Git (optional) | https://git-scm.com |

---

## 🗂️ Project Structure

```
scms/
├── backend/          ← FastAPI Python backend
│   ├── app/
│   ├── schema.sql
│   ├── requirements.txt
│   ├── .env
│   └── run.py
├── frontend/         ← React.js frontend
│   ├── src/
│   ├── package.json
│   └── index.html
└── INSTALLATION_GUIDE.md
```

---

## STEP 1 — Open in VS Code

1. Extract the ZIP file to a folder (e.g. `C:\Projects\scms` or `~/Projects/scms`)
2. Open **VS Code**
3. Go to **File → Open Folder** → select the `scms` folder
4. Install recommended VS Code extensions:
   - **Python** (ms-python.python)
   - **ES7+ React/Redux/React-Native Snippets**
   - **Tailwind CSS IntelliSense**
   - **Prettier - Code Formatter**

---

## STEP 2 — Set Up MySQL Database

### Option A — MySQL Workbench (GUI)
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Go to **File → Open SQL Script** → select `backend/schema.sql`
4. Click the ⚡ Execute button (or press Ctrl+Shift+Enter)

### Option B — MySQL Command Line
```bash
mysql -u root -p < backend/schema.sql
```

✅ This creates the `scms_db` database with all tables and seeds:
- Default admin user: `admin@scms.edu` / `Admin@123`
- 5 sample departments

---

## STEP 3 — Configure Backend (.env)

Open `backend/.env` and update your MySQL password:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/scms_db
SECRET_KEY=your-ultra-secret-key-change-in-production-abc123xyz
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=480
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

⚠️ Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password.

---

## STEP 4 — Install & Run Backend

### Open a new terminal in VS Code (Ctrl+`)

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python run.py
```

✅ Backend running at: **http://localhost:8000**
📖 API docs at: **http://localhost:8000/docs**

---

## STEP 5 — Install & Run Frontend

### Open a SECOND terminal in VS Code (click the + icon)

```bash
# Navigate to frontend folder
cd frontend

# Install Node.js dependencies
npm install

# Start the frontend dev server
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

---

## STEP 6 — Login & Test

Open your browser and go to: **http://localhost:3000**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@scms.edu | Admin@123 |

### First Steps as Admin:
1. **Login** with admin credentials
2. Go to **Courses** → Add some courses
3. Go to **Faculty** → Add faculty members
4. Go to **Students** → Add students
5. Use the API docs at `http://localhost:8000/docs` to:
   - Enroll students in courses (`POST /api/courses/enroll`)
   - Assign faculty to courses (`POST /api/faculty/assign-course`)

---

## 🔧 Troubleshooting

### ❌ "ModuleNotFoundError" in Python
```bash
# Make sure your virtual environment is active
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

### ❌ "Access denied for user 'root'" (MySQL)
- Check your password in `backend/.env`
- Make sure MySQL service is running

### ❌ "CORS error" in browser
- Confirm backend is running on port 8000
- Confirm the `.env` CORS_ORIGINS includes `http://localhost:3000`

### ❌ Frontend "npm install" fails
- Make sure Node.js 18+ is installed: `node --version`
- Try: `npm install --legacy-peer-deps`

### ❌ Port already in use
- Backend: Change port in `run.py` → `port=8001`
- Frontend: Change port in `vite.config.js` → `port: 3001`

---

## 📡 API Endpoints Summary

| Module | Endpoints |
|--------|-----------|
| Auth | POST /api/auth/login, GET /api/auth/me |
| Students | GET/POST /api/students/, PUT/DELETE /api/students/{id} |
| Faculty | GET/POST /api/faculty/, PUT/DELETE /api/faculty/{id} |
| Courses | GET/POST /api/courses/, POST /api/courses/enroll |
| Attendance | POST /api/attendance/mark, GET /api/attendance/summary/{id} |
| Marks | POST /api/marks/exams, POST /api/marks/upload, GET /api/marks/gradesheet/{id} |
| Dashboard | GET /api/dashboard/admin/stats, /faculty/stats, /student/stats |

---

## 🔒 Default Roles

| Role | Can Do |
|------|--------|
| **Admin** | Manage all students, faculty, courses, view all data |
| **Faculty** | Mark attendance, upload marks for assigned courses |
| **Student** | View own attendance, grades, enrolled courses |

---

## 📦 Tech Stack

- **Backend**: FastAPI + SQLAlchemy + MySQL + JWT Auth
- **Frontend**: React 18 + Vite + Tailwind CSS + Recharts
- **Database**: MySQL 8.0

