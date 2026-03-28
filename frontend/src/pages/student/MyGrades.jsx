import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function MyGrades() {
  const [gradeSheet, setGradeSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    API.get("/api/students/")
      .then(() => {})
      .catch(() => {});
    API.get(`/api/marks/gradesheet/me`)
      .then((res) => { setGradeSheet(res.data); setLoading(false); })
      .catch(() => { setError("Grade sheet not available yet."); setLoading(false); });
  }, []);

  const gradeColor = (grade) => {
    const map = { "A+": "text-green-600", "A": "text-green-500", "B+": "text-blue-600",
      "B": "text-blue-500", "C": "text-yellow-600", "D": "text-orange-500", "F": "text-red-600" };
    return map[grade] || "text-gray-600";
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Grades</h1>
      {loading && <div className="text-center text-gray-500 py-8">Loading grade sheet...</div>}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-800">
          <p>{error}</p>
          <p className="text-sm mt-2">Please ensure you are enrolled in courses and marks have been uploaded by your faculty.</p>
        </div>
      )}
      {gradeSheet && (
        <>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-xs text-gray-500 uppercase">Student</p><p className="font-semibold">{gradeSheet.student_name}</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Roll No</p><p className="font-semibold">{gradeSheet.roll_no}</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Department</p><p className="font-semibold">{gradeSheet.department}</p></div>
              <div><p className="text-xs text-gray-500 uppercase">Semester</p><p className="font-semibold">{gradeSheet.semester}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Course", "Code", "Credits", "Marks", "Percentage", "Grade"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gradeSheet.courses.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{c.course_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.course_code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{c.credits}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{c.marks_obtained}/{c.total_marks}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{c.percentage}%</td>
                    <td className={`px-6 py-4 text-sm font-bold ${gradeColor(c.grade)}`}>{c.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Overall Performance</p>
              <p className="text-3xl font-bold text-gray-800">{gradeSheet.overall_percentage}%</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">Overall Grade</p>
              <p className={`text-5xl font-bold ${gradeColor(gradeSheet.overall_grade)}`}>{gradeSheet.overall_grade}</p>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
