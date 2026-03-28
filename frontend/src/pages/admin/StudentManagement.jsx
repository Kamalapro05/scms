import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import DataTable from "../../components/common/DataTable";
import toast from "react-hot-toast";

const DEPARTMENTS = [
  { id: 1, name: "Computer Science" },
  { id: 2, name: "Electrical Engineering" },
  { id: 3, name: "Mechanical Engineering" },
  { id: 4, name: "Civil Engineering" },
  { id: 5, name: "Mathematics" },
];

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    email: "", password: "", first_name: "", last_name: "",
    roll_no: "", department_id: "", year: 1, semester: 1, phone: "",
  });

  const fetchStudents = () => {
    API.get("/api/students/", { params: { search: search || undefined } })
      .then((res) => setStudents(res.data))
      .catch(() => toast.error("Failed to load students"));
  };

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => {
    const timer = setTimeout(fetchStudents, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const resetForm = () => {
    setForm({ email: "", password: "", first_name: "", last_name: "", roll_no: "", department_id: "", year: 1, semester: 1, phone: "" });
    setEditingStudent(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await API.put(`/api/students/${editingStudent.id}`, {
          first_name: form.first_name, last_name: form.last_name,
          department_id: parseInt(form.department_id),
          year: parseInt(form.year), semester: parseInt(form.semester), phone: form.phone,
        });
        toast.success("Student updated");
      } else {
        await API.post("/api/students/", { ...form, department_id: parseInt(form.department_id), year: parseInt(form.year), semester: parseInt(form.semester) });
        toast.success("Student created");
      }
      setShowModal(false); resetForm(); fetchStudents();
    } catch (err) { toast.error(err.response?.data?.detail || "Operation failed"); }
  };

  const handleEdit = (s) => {
    setEditingStudent(s);
    setForm({ email: s.email || "", password: "", first_name: s.first_name, last_name: s.last_name,
      roll_no: s.roll_no, department_id: s.department_id.toString(), year: s.year, semester: s.semester, phone: s.phone || "" });
    setShowModal(true);
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete student ${s.first_name} ${s.last_name}?`)) return;
    try { await API.delete(`/api/students/${s.id}`); toast.success("Deleted"); fetchStudents(); }
    catch { toast.error("Delete failed"); }
  };

  const columns = [
    { key: "roll_no", label: "Roll No" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "department_name", label: "Department" },
    { key: "year", label: "Year" },
    { key: "semester", label: "Semester" },
    { key: "email", label: "Email" },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">+ Add Student</button>
      </div>
      <div className="mb-4">
        <input type="text" placeholder="Search by name or roll number..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
      </div>
      <DataTable columns={columns} data={students} onEdit={handleEdit} onDelete={handleDelete} />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingStudent ? "Edit Student" : "Add New Student"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingStudent && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="email" placeholder="Email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="password" placeholder="Password" required value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <input type="text" placeholder="Roll Number" required value={form.roll_no}
                    onChange={(e) => setForm({ ...form, roll_no: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" required value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Last Name" required value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <select value={form.department_id} required onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <select value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
                <select value={form.semester} onChange={(e) => setForm({ ...form, semester: parseInt(e.target.value) })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Sem {s}</option>)}
                </select>
              </div>
              <input type="text" placeholder="Phone" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  {editingStudent ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
