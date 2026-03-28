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

export default function FacultyManagement() {
  const [facultyList, setFacultyList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    email: "", password: "", first_name: "", last_name: "",
    employee_id: "", department_id: "", designation: "", phone: "", qualification: "",
  });

  const fetchFaculty = () => {
    API.get("/api/faculty/").then((res) => setFacultyList(res.data));
  };
  useEffect(() => { fetchFaculty(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/api/faculty/${editing.id}`, {
          first_name: form.first_name, last_name: form.last_name,
          department_id: parseInt(form.department_id),
          designation: form.designation, phone: form.phone, qualification: form.qualification,
        });
        toast.success("Faculty updated");
      } else {
        await API.post("/api/faculty/", { ...form, department_id: parseInt(form.department_id) });
        toast.success("Faculty created");
      }
      setShowModal(false); setEditing(null); fetchFaculty();
    } catch (err) { toast.error(err.response?.data?.detail || "Operation failed"); }
  };

  const handleDelete = async (fac) => {
    if (!window.confirm(`Delete ${fac.first_name} ${fac.last_name}?`)) return;
    try { await API.delete(`/api/faculty/${fac.id}`); toast.success("Deleted"); fetchFaculty(); }
    catch { toast.error("Delete failed"); }
  };

  const columns = [
    { key: "employee_id", label: "Employee ID" }, { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" }, { key: "department_name", label: "Department" },
    { key: "designation", label: "Designation" }, { key: "email", label: "Email" },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faculty Management</h1>
        <button onClick={() => {
          setEditing(null);
          setForm({ email: "", password: "", first_name: "", last_name: "", employee_id: "", department_id: "", designation: "", phone: "", qualification: "" });
          setShowModal(true);
        }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">+ Add Faculty</button>
      </div>
      <DataTable columns={columns} data={facultyList}
        onEdit={(fac) => { setEditing(fac); setForm({ ...fac, department_id: fac.department_id.toString(), password: "" }); setShowModal(true); }}
        onDelete={handleDelete} />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editing ? "Edit Faculty" : "Add Faculty"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editing && (
                <div className="grid grid-cols-2 gap-4">
                  <input type="email" placeholder="Email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="password" placeholder="Password" required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" required value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Last Name" required value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              {!editing && (
                <input type="text" placeholder="Employee ID" required value={form.employee_id}
                  onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              )}
              <select value={form.department_id} required onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <input type="text" placeholder="Designation" value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Qualification" value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
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
