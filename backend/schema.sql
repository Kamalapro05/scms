-- ============================================
-- SMART COLLEGE MANAGEMENT SYSTEM — DATABASE
-- ============================================

CREATE DATABASE IF NOT EXISTS scms_db;
USE scms_db;

CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('admin', 'faculty', 'student') NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

CREATE TABLE departments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150) NOT NULL UNIQUE,
    code            VARCHAR(20) NOT NULL UNIQUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE students (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL UNIQUE,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    roll_no         VARCHAR(50) NOT NULL UNIQUE,
    department_id   INT NOT NULL,
    year            TINYINT NOT NULL CHECK (year BETWEEN 1 AND 4),
    semester        TINYINT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    date_of_birth   DATE,
    phone           VARCHAR(20),
    address         TEXT,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_students_roll (roll_no),
    INDEX idx_students_dept (department_id)
) ENGINE=InnoDB;

CREATE TABLE faculty (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL UNIQUE,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    employee_id     VARCHAR(50) NOT NULL UNIQUE,
    department_id   INT NOT NULL,
    designation     VARCHAR(100),
    phone           VARCHAR(20),
    qualification   VARCHAR(255),
    date_of_joining DATE DEFAULT (CURRENT_DATE),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_faculty_emp (employee_id),
    INDEX idx_faculty_dept (department_id)
) ENGINE=InnoDB;

CREATE TABLE courses (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    code            VARCHAR(30) NOT NULL UNIQUE,
    credits         TINYINT NOT NULL CHECK (credits BETWEEN 1 AND 6),
    department_id   INT NOT NULL,
    semester        TINYINT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_courses_code (code),
    INDEX idx_courses_dept_sem (department_id, semester)
) ENGINE=InnoDB;

CREATE TABLE faculty_courses (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id      INT NOT NULL,
    course_id       INT NOT NULL,
    academic_year   VARCHAR(9) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uk_faculty_course_year (faculty_id, course_id, academic_year),
    INDEX idx_fc_faculty (faculty_id),
    INDEX idx_fc_course (course_id)
) ENGINE=InnoDB;

CREATE TABLE enrollments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    student_id      INT NOT NULL,
    course_id       INT NOT NULL,
    academic_year   VARCHAR(9) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY uk_student_course_year (student_id, course_id, academic_year),
    INDEX idx_enroll_student (student_id),
    INDEX idx_enroll_course (course_id)
) ENGINE=InnoDB;

CREATE TABLE attendance (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id   INT NOT NULL,
    date            DATE NOT NULL,
    status          ENUM('present', 'absent', 'late', 'excused') NOT NULL DEFAULT 'absent',
    marked_by       INT NOT NULL,
    remarks         VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES faculty(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_attendance_date (enrollment_id, date),
    INDEX idx_attendance_date (date),
    INDEX idx_attendance_enrollment (enrollment_id)
) ENGINE=InnoDB;

CREATE TABLE exams (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    course_id       INT NOT NULL,
    name            VARCHAR(150) NOT NULL,
    exam_type       ENUM('midterm', 'final', 'quiz', 'assignment', 'practical') NOT NULL,
    total_marks     DECIMAL(5,2) NOT NULL,
    exam_date       DATE,
    academic_year   VARCHAR(9) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_exams_course (course_id)
) ENGINE=InnoDB;

CREATE TABLE marks (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    enrollment_id   INT NOT NULL,
    exam_id         INT NOT NULL,
    marks_obtained  DECIMAL(5,2) NOT NULL,
    grade           VARCHAR(5),
    uploaded_by     INT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES faculty(id) ON DELETE RESTRICT,
    UNIQUE KEY uk_marks_enrollment_exam (enrollment_id, exam_id),
    INDEX idx_marks_enrollment (enrollment_id),
    INDEX idx_marks_exam (exam_id)
) ENGINE=InnoDB;

-- ============================================
-- DEFAULT USERS
-- ============================================

-- Admin user | Password: Admin@123
INSERT INTO users (email, password_hash, role)
VALUES ('admin@scms.edu', '$bcrypt-sha256$v=2,t=2b,r=12$Z6B7Bd4JuNhAFLNksjcAuO$CMHSjlGIEJdsWqG6ONNDzsyZC6AG6Ym', 'admin');

-- Faculty user | Password: Faculty@123
INSERT INTO users (email, password_hash, role)
VALUES ('faculty@scms.edu', '$bcrypt-sha256$v=2,t=2b,r=12$VN29XmAp0vTgZQb/Y4FGuO$HEhoAj2OlbYF9jt2vSHDlM1qF6EX3/q', 'faculty');

-- ============================================
-- DEFAULT DEPARTMENTS
-- ============================================

INSERT INTO departments (name, code) VALUES
('Computer Science', 'CS'),
('Electrical Engineering', 'EE'),
('Mechanical Engineering', 'ME'),
('Civil Engineering', 'CE'),
('Mathematics', 'MATH');

-- ============================================
-- DEFAULT FACULTY PROFILE (linked to faculty@scms.edu)
-- ============================================

INSERT INTO faculty (user_id, first_name, last_name, employee_id, department_id, designation)
VALUES (2, 'Demo', 'Faculty', 'FAC001', 1, 'Assistant Professor');