import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-700">Smart College Management System</h2>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{user?.email}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
          {user?.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
