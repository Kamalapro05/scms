import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentManagement from "./pages/admin/StudentManagement";
import FacultyManagement from "./pages/admin/FacultyManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import MarkAttendance from "./pages/faculty/MarkAttendance";
import UploadMarks from "./pages/faculty/UploadMarks";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyAttendance from "./pages/student/MyAttendance";
import MyGrades from "./pages/student/MyGrades";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StudentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/faculty" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FacultyManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CourseManagement />
            </ProtectedRoute>
          } />

          {/* Faculty Routes */}
          <Route path="/faculty" element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <FacultyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/faculty/attendance" element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <MarkAttendance />
            </ProtectedRoute>
          } />
          <Route path="/faculty/marks" element={
            <ProtectedRoute allowedRoles={["faculty"]}>
              <UploadMarks />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/student/attendance" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyAttendance />
            </ProtectedRoute>
          } />
          <Route path="/student/grades" element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MyGrades />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
