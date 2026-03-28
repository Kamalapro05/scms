import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import toast from "react-hot-toast";

const DEPARTMENTS = [
  { id: 1, name: "Computer Science" }, { id: 2, name: "Electrical Engineering" },
  { id: 3, name: "Mechanical Engineering" }, { id: 4, name: "Civil Engineering" },
  { id: 5, name: "Mathematics" },
];

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", code: "", credits: 3, department_id: "", semester: 1, description: "" });

  const fetchCourses = () => { API.get("/api/courses/").then((res) => setCourses(res.data)); };
  useEffect(() => { fetchCourses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, credits: parseInt(form.credits), department_id: parseInt(form.department_id), semester: parseInt(form.semester) };
      if (editing) { await API.put(`/api/courses/${editing.id}`, payload); toast.success("Course updated"); }
      else { await API.post("/api/courses/", payload); toast.success("Course created"); }
      setShowModal(false); setEditing(null); fetchCourses();
    } catch (err) { toast.error(err.response?.data?.detail || "Operation failed"); }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete course ${c.name}?`)) return;
    try { await API.delete(`/api/courses/${c.id}`); toast.success("Deleted"); fetchCourses(); }
    catch { toast.error("Delete failed"); }
  };

  const columns = [
    { key: "code", label: "Code" }, { key: "name", label: "Course Name" },
    { key: "credits", label: "Credits" }, { key: "department_name", label: "Department" },
    { key: "semester", label: "Semester" },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
        <button onClick={() => { setEditing(null); setForm({ name: "", code: "", credits: 3, department_id: "", semester: 1, description: "" }); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">+ Add Course</button>
      </div>
      <DataTable columns={columns} data={courses}
        onEdit={(c) => { setEditing(c); setForm({ ...c, department_id: c.department_id.toString() }); setShowModal(true); }}
        onDelete={handleDelete} />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editing ? "Edit Course" : "Add Course"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Course Name" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              {!editing && (
                <input type="text" placeholder="Course Code (e.g. CS101)" required value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              )}
              <div className="grid grid-cols-2 gap-4">
                <select value={form.credits} onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4,5,6].map((c) => <option key={c} value={c}>{c} Credits</option>)}
                </select>
                <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
              <select value={form.department_id} required onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <textarea placeholder="Description" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" rows="3" />
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
