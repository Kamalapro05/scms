# 📚 SCMS — Smart College Management System

## 🚀 Quick Setup (Windows)

### Prerequisites - Install these first:
| Tool | Download |
|------|----------|
| Python 3.10+ | https://python.org |
| Node.js 18+ | https://nodejs.org |
| MySQL 8.0+ | https://dev.mysql.com/downloads/mysql/ |

---

## ⚡ One-Click Setup

1. **Download/Clone this project**
2. **Double-click `SETUP.bat`**
3. **Enter your MySQL password when asked**
4. Wait for setup to complete
5. **Double-click `START.bat`** to launch the app

That's it! 🎉

---

## 🌐 Login Details

| Field | Value |
|-------|-------|
| URL | http://localhost:3000 |
| Email | admin@scms.edu |
| Password | Admin@123 |

---

## 🔧 Manual Setup (if SETUP.bat fails)

### 1. Setup Database
```bash
mysql -u root -p < backend/schema.sql
```

### 2. Create .env file
Copy `backend/.env.example` to `backend/.env` and fill in your MySQL password.

### 3. Setup Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python run.py
```

### 4. Setup Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 Tech Stack
- **Backend**: FastAPI + SQLAlchemy + MySQL + JWT
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: MySQL 8.0

---

## ❓ Troubleshooting

| Error | Fix |
|-------|-----|
| MySQL access denied | Check password in `backend/.env` |
| Port 8000 in use | Change port in `backend/run.py` |
| Port 3000 in use | Change port in `frontend/vite.config.js` |
| npm install fails | Run `npm install --legacy-peer-deps` |