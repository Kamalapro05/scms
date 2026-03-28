import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  HiOutlineHome, HiOutlineUsers, HiOutlineAcademicCap,
  HiOutlineBookOpen, HiOutlineClipboardCheck, HiOutlineChartBar, HiOutlineLogout,
} from "react-icons/hi";

const menuItems = {
  admin: [
    { to: "/admin", label: "Dashboard", icon: <HiOutlineHome /> },
    { to: "/admin/students", label: "Students", icon: <HiOutlineUsers /> },
    { to: "/admin/faculty", label: "Faculty", icon: <HiOutlineAcademicCap /> },
    { to: "/admin/courses", label: "Courses", icon: <HiOutlineBookOpen /> },
  ],
  faculty: [
    { to: "/faculty", label: "Dashboard", icon: <HiOutlineHome /> },
    { to: "/faculty/attendance", label: "Attendance", icon: <HiOutlineClipboardCheck /> },
    { to: "/faculty/marks", label: "Upload Marks", icon: <HiOutlineChartBar /> },
  ],
  student: [
    { to: "/student", label: "Dashboard", icon: <HiOutlineHome /> },
    { to: "/student/attendance", label: "My Attendance", icon: <HiOutlineClipboardCheck /> },
    { to: "/student/grades", label: "My Grades", icon: <HiOutlineChartBar /> },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const items = menuItems[user?.role] || [];
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 text-white flex flex-col z-40">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">📚 SCMS</h1>
        <p className="text-sm text-gray-400 mt-1 capitalize">{user?.role} Portal</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === `/${user?.role}`}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-6 py-3 text-sm transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }>
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={logout}
          className="flex items-center space-x-3 px-2 py-2 w-full text-gray-300 hover:text-red-400 transition-colors text-sm">
          <HiOutlineLogout className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
