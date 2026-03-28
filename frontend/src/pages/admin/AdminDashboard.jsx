import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/charts/StatsCard";
import { HiOutlineUsers, HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineClipboardCheck } from "react-icons/hi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/api/dashboard/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1,2,3,4].map((i) => <div key={i} className="bg-gray-200 h-28 rounded-xl" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Students" value={stats.total_students} icon={<HiOutlineUsers />} color="blue" />
        <StatsCard title="Total Faculty" value={stats.total_faculty} icon={<HiOutlineAcademicCap />} color="green" />
        <StatsCard title="Total Courses" value={stats.total_courses} icon={<HiOutlineBookOpen />} color="purple" />
        <StatsCard title="Attendance Rate" value={`${stats.attendance_rate}%`} icon={<HiOutlineClipboardCheck />} color="orange" />
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Students per Department</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.students_per_department}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
