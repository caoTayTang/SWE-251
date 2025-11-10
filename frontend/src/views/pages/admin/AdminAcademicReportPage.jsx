// src/views/pages/admin/AdminAcademicReportPage.js
import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { getAdminAcademicOverview } from "../../../api/api";

export default function AdminAcademicReportPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getAdminAcademicOverview();
        setData(response.data);
      } catch (err) {
        console.error("Lỗi tải báo cáo:", err);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleGeneratePDF = () => {
    // Logic giả lập tạo file
    alert("Đã tạo file PDF (mock)!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Báo cáo học thuật (Evaluate Tutee){" "}
        </h1>
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Tải về PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        {loading ? (
          <p>Đang tính toán dữ liệu...</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-700">
                <th className="py-3">Tên Tutee</th>
                <th className="py-3">Lớp (chính quy)</th>
                <th className="py-3">Số khóa học</th>
                <th className="py-3">Tiến độ TB</th>
                <th className="py-3">Rating TB (từ Tutee)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tutee) => (
                <tr key={tutee.id} className="border-b text-gray-600">
                  <td className="py-3 font-medium">{tutee.name}</td>
                  <td>{tutee.class}</td>
                  <td>{tutee.coursesTaken}</td>
                  <td>{tutee.avgProgress}%</td>
                  <td>{tutee.avgRating} / 5.0</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
