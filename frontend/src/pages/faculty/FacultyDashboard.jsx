import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatsCard from "../../components/charts/StatsCard";
import { HiOutlineBookOpen, HiOutlineUsers } from "react-icons/hi";

export default function FacultyDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    API.get("/api/dashboard/faculty/stats").then((res) => setStats(res.data));
  }, []);
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Faculty Dashboard</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Welcome" value={stats.faculty_name} icon="👋" color="blue" />
          <StatsCard title="Assigned Courses" value={stats.assigned_courses} icon={<HiOutlineBookOpen />} color="green" />
          <StatsCard title="Total Students" value={stats.total_students} icon={<HiOutlineUsers />} color="purple" />
        </div>
      )}
    </DashboardLayout>
  );
}
