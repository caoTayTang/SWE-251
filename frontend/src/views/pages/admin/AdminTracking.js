import React, { useState } from "react";
import { Search } from "lucide-react";

const mockStudents = [
  { id: 1, name: "Trần Thị B", class: "K61-CNTT", progress: "70%" },
  { id: 2, name: "Lê Văn C", class: "K61-CNTT", progress: "45%" },
];

export default function AdminTracking() {
  const [mode, setMode] = useState("tutee"); // tutee | class
  const [query, setQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("K61-CNTT");

  const filtered = mockStudents.filter(s => {
    if(mode === "tutee") return s.name.toLowerCase().includes(query.toLowerCase());
    return s.class === selectedClass;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Theo dõi học tập</h1>

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <div className="flex gap-3 items-center">
          <button onClick={()=>setMode("tutee")} className={`px-4 py-2 rounded ${mode==="tutee" ? "bg-blue-600 text-white": "bg-gray-50"}`}>Theo Tutee</button>
          <button onClick={()=>setMode("class")} className={`px-4 py-2 rounded ${mode==="class" ? "bg-blue-600 text-white": "bg-gray-50"}`}>Theo Lớp</button>
        </div>

        <div className="mt-4">
          {mode === "tutee" ? (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm theo tên tutee..." className="pl-10 pr-3 py-2 border rounded w-full"/>
            </div>
          ) : (
            <select value={selectedClass} onChange={e=>setSelectedClass(e.target.value)} className="px-3 py-2 border rounded">
              <option>K61-CNTT</option>
              <option>K60-CNTT</option>
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
            {filtered.map(s => (
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
