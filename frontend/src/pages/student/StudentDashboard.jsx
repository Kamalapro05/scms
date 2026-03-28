import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/charts/StatsCard";
import { HiOutlineBookOpen, HiOutlineClipboardCheck, HiOutlineAcademicCap } from "react-icons/hi";

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    API.get("/api/dashboard/student/stats").then((res) => setStats(res.data));
  }, []);
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
      {stats && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-blue-800 font-medium">Welcome, {stats.student_name}!</p>
            <p className="text-blue-600 text-sm">Roll No: {stats.roll_no} | Year {stats.year} — Semester {stats.semester}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard title="Courses Enrolled" value={stats.courses_enrolled} icon={<HiOutlineBookOpen />} color="blue" />
            <StatsCard title="Overall Attendance" value={`${stats.overall_attendance}%`} icon={<HiOutlineClipboardCheck />} color={stats.overall_attendance >= 75 ? "green" : "red"} />
            <StatsCard title="Current Semester" value={`Sem ${stats.semester}`} icon={<HiOutlineAcademicCap />} color="purple" />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
