import React, { useState, useEffect } from "react";
import { Download, Check, X } from "lucide-react";
import {
  getAdminMeetingNotes,
  updateMeetingNoteStatus,
} from "../../../api/api";
export default function AdminMeetingNote() {
  const [reports, setReports] = useState([]); // 3. State rỗng
  const [loading, setLoading] = useState(true); // Loading trang
  const [actionLoading, setActionLoading] = useState(null); // Loading nút

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const response = await getAdminMeetingNotes();
        setReports(response.data);
      } catch (err) {
        console.error("Lỗi tải báo cáo:", err);
      }
      setLoading(false);
    };
    loadReports();
  }, []);

  const setStatus = async (id, s) => {
    setActionLoading(id); // Bật loading cho cụm nút này
    try {
      const response = await updateMeetingNoteStatus(id, s);
      // Cập nhật lại 1 item trong list
      setReports((r) => r.map((x) => (x.id === id ? response.data : x)));
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
    setActionLoading(null); // Tắt loading
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Báo cáo</h1>

      <div className="bg-white rounded-2xl shadow divide-y">
        {reports.map((r) => (
          <div key={r.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">
                {r.from} • {r.date}
              </div>
              <div className="font-medium text-gray-800">{r.type}</div>
            </div>

            {/* Hiển thị Status (cho đẹp) */}
            <div className="flex-shrink-0">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  r.status === "new"
                    ? "bg-blue-50 text-blue-700"
                    : r.status === "approved"
                      ? "bg-green-50 text-green-700"
                      : r.status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-50 text-gray-700"
                }`}
              >
                {r.status}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={r.url}
                className="text-sm text-blue-600 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Tải
              </a>
              {r.status === "new" && (
                <>
                  <button
                    onClick={() => setStatus(r.id, "approved")}
                    disabled={actionLoading === r.id}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> Duyệt
                  </button>
                  <button
                    onClick={() => setStatus(r.id, "rejected")}
                    disabled={actionLoading === r.id}
                    className="px-3 py-1 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" /> Từ chối
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
