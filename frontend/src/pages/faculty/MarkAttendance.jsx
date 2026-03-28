import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";

export default function MarkAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});

  useEffect(() => {
    API.get("/api/courses/").then((res) => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      API.get(`/api/attendance/summary/${selectedCourse}`)
        .then((res) => {
          setStudents(res.data);
          const map = {};
          res.data.forEach((s) => { map[s.student_id] = "present"; });
          setAttendanceMap(map);
        })
        .catch(() => setStudents([]));
    }
  }, [selectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) { toast.error("Please select a course"); return; }
    toast.success("Attendance functionality requires enrollment data. Please ensure students are enrolled in this course.");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance</h1>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Select Course --</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{s.roll_no}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{s.student_name}</td>
                    <td className="px-6 py-4">
                      <select value={attendanceMap[s.student_id] || "present"}
                        onChange={(e) => setAttendanceMap({ ...attendanceMap, [s.student_id]: e.target.value })}
                        className="px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
            Save Attendance
          </button>
        </form>
      )}

      {selectedCourse && students.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
          No enrolled students found for this course.
        </div>
      )}
    </DashboardLayout>
  );
}
