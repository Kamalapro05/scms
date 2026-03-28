import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";

export default function UploadMarks() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});

  useEffect(() => { API.get("/api/courses/").then((res) => setCourses(res.data)); }, []);

  useEffect(() => {
    if (selectedCourse) {
      API.get(`/api/marks/exams/${selectedCourse}`).then((res) => setExams(res.data));
      API.get(`/api/attendance/summary/${selectedCourse}`)
        .then((res) => { setStudents(res.data); const m = {}; res.data.forEach((s) => { m[s.student_id] = ""; }); setMarksMap(m); })
        .catch(() => setStudents([]));
    }
  }, [selectedCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Marks upload functionality ready. Connect enrollment IDs to upload.");
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Marks</h1>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
            <select value={selectedCourse} onChange={(e) => { setSelectedCourse(e.target.value); setSelectedExam(""); }}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Select Course --</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam</label>
            <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Select Exam --</option>
              {exams.map((e) => <option key={e.id} value={e.id}>{e.name} (/{e.total_marks})</option>)}
            </select>
          </div>
        </div>
      </div>

      {students.length > 0 && selectedExam && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks Obtained</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{s.roll_no}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{s.student_name}</td>
                    <td className="px-6 py-4">
                      <input type="number" min="0" step="0.5" placeholder="0"
                        value={marksMap[s.student_id] || ""}
                        onChange={(e) => setMarksMap({ ...marksMap, [s.student_id]: e.target.value })}
                        className="w-24 px-2 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition">
            Upload Marks
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}
