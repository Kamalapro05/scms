import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function MyAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => { API.get("/api/courses/").then((res) => setCourses(res.data)); }, []);

  useEffect(() => {
    if (selectedCourse) {
      API.get(`/api/attendance/summary/${selectedCourse}`)
        .then((res) => setSummary(res.data[0] || null))
        .catch(() => setSummary(null));
    }
  }, [selectedCourse]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Attendance</h1>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full max-w-md px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">-- Select Course --</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
        </select>
      </div>

      {summary && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{summary.course_name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: "Total Classes", value: summary.total_classes, color: "bg-gray-100 text-gray-800" },
              { label: "Present", value: summary.present, color: "bg-green-100 text-green-800" },
              { label: "Absent", value: summary.absent, color: "bg-red-100 text-red-800" },
              { label: "Late", value: summary.late, color: "bg-yellow-100 text-yellow-800" },
              { label: "Excused", value: summary.excused, color: "bg-blue-100 text-blue-800" },
            ].map((item) => (
              <div key={item.label} className={`${item.color} rounded-lg p-4 text-center`}>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs font-medium mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-4">
              <div className="bg-blue-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(summary.percentage, 100)}%` }} />
            </div>
            <span className={`text-lg font-bold ${summary.percentage >= 75 ? "text-green-600" : "text-red-600"}`}>
              {summary.percentage}%
            </span>
          </div>
          {summary.percentage < 75 && (
            <p className="text-red-600 text-sm mt-2">⚠️ Attendance below 75% requirement</p>
          )}
        </div>
      )}

      {selectedCourse && !summary && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
          No attendance data found for this course.
        </div>
      )}
    </DashboardLayout>
  );
}
