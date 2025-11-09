import React, { useState } from "react";
import { Download, Eye, Check, X } from "lucide-react";

const mockReports = [
  { id: 1, from: "Tutor: Nguyễn Văn A", type: "Tiến độ học tập", date: "2025-10-25", status: "new", url: "#" },
  { id: 2, from: "Tutee: Lê Văn C", type: "Báo cáo điểm danh", date: "2025-10-20", status: "review", url: "#" },
];

export default function AdminReports() {
  const [reports, setReports] = useState(mockReports);

  const setStatus = (id, s) => setReports(r => r.map(x => x.id === id ? { ...x, status: s } : x));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Báo cáo</h1>

      <div className="bg-white rounded-2xl shadow divide-y">
        {reports.map(r => (
          <div key={r.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">{r.from} • {r.date}</div>
              <div className="font-medium text-gray-800">{r.type}</div>
            </div>
            <div className="flex items-center gap-3">
              <a href={r.url} className="text-sm text-blue-600 flex items-center gap-2"><Download className="w-4 h-4" />Tải</a>
              <button onClick={() => setStatus(r.id, "approved")} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg flex items-center gap-2"><Check className="w-4 h-4" />Duyệt</button>
              <button onClick={() => setStatus(r.id, "rejected")} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"><X className="w-4 h-4" />Từ chối</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
