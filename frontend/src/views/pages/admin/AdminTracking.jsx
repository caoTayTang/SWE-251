import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getAdminAllTutees, getAdminAcademicClasses } from "../../../api/api";

export default function AdminTracking() {
  const [mode, setMode] = useState("tutee"); // tutee | class
  const [query, setQuery] = useState("");

  const [students, setStudents] = useState([]); // Thay cho mockStudents
  const [classes, setClasses] = useState([]); // State cho list <select>
  const [selectedClass, setSelectedClass] = useState(""); // State cho giá trị <select>

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        // 6. Dùng Promise.all để gọi song song
        const [studentsRes, classesRes] = await Promise.all([
          getAdminAllTutees(),
          getAdminAcademicClasses(),
        ]);

        setStudents(studentsRes.data);
        setClasses(classesRes.data);

        // Tự động chọn class đầu tiên trong list (nếu có)
        if (classesRes.data.length > 0) {
          setSelectedClass(classesRes.data[0]);
        }
      } catch (err) {
        console.error("Lỗi tải data tracking:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = students.filter((s) => {
    if (mode === "tutee")
      return s.name.toLowerCase().includes(query.toLowerCase());
    return s.class === selectedClass;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-red-500">{error}</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Theo dõi học tập</h1>

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setMode("tutee")}
            className={`px-4 py-2 rounded ${mode === "tutee" ? "bg-blue-600 text-white" : "bg-gray-50"}`}
          >
            Theo Tutee
          </button>
          <button
            onClick={() => setMode("class")}
            className={`px-4 py-2 rounded ${mode === "class" ? "bg-blue-600 text-white" : "bg-gray-50"}`}
          >
            Theo Lớp
          </button>
        </div>

        <div className="mt-4">
          {mode === "tutee" ? (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên tutee..."
                className="pl-10 pr-3 py-2 border rounded w-full"
              />
            </div>
          ) : (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-700">
              <th className="py-3">Tên</th>
              <th>Lớp</th>
              <th>Tiến độ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b text-gray-600">
                <td className="py-3">{s.name}</td>
                <td>{s.class}</td>
                <td>{s.progress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
