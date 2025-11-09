// src/views/pages/shared/TrackingPage.js
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function TrackingPage() {
  const { user } = useAuth();

  // State chính
  const [mode, setMode] = useState(null); // "tutee" | "class"
  const [selected, setSelected] = useState(null);

  // Mock data (sau này gọi API)
  const classList = [
    { id: 1, name: "Lớp Giải tích 1", tuteeCount: 12 },
    { id: 2, name: "Lớp Lập trình C++", tuteeCount: 8 },
  ];

  const tuteeList = [
    { id: 1, name: "Nguyễn Văn A", class: "Giải tích 1" },
    { id: 2, name: "Trần Thị B", class: "Lập trình C++" },
  ];

  const tuteeDetails = {
    1: { name: "Nguyễn Văn A", progress: "Hoàn thành 70%", lastActive: "2025-10-25" },
    2: { name: "Trần Thị B", progress: "Hoàn thành 45%", lastActive: "2025-10-26" },
  };

  const classDetails = {
    1: {
      name: "Giải tích 1",
      tutees: [
        { name: "Nguyễn Văn A", progress: "70%" },
        { name: "Phạm C", progress: "60%" },
      ],
    },
    2: {
      name: "Lập trình C++",
      tutees: [
        { name: "Trần Thị B", progress: "45%" },
        { name: "Lê D", progress: "90%" },
      ],
    },
  };

  // 1️⃣ Chưa chọn loại theo dõi
  if (!mode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px] text-center">
          <h1 className="text-xl font-semibold text-[#002855] mb-4">Chọn loại theo dõi</h1>
          <p className="text-gray-600 mb-6">
            Vui lòng chọn bạn muốn theo dõi theo <b>Tutee</b> hay <b>Lớp</b>
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setMode("tutee")}
              className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
            >
              Theo dõi Tutee
            </button>
            <button
              onClick={() => setMode("class")}
              className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
            >
              Theo dõi Lớp
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2️⃣ Chọn danh sách Tutee / Lớp
  if (!selected) {
    const list = mode === "tutee" ? tuteeList : classList;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#002855]">
              {mode === "tutee" ? "Danh sách Tutee" : "Danh sách Lớp"}
            </h1>
            <button
              onClick={() => setMode(null)}
              className="text-sm text-blue-700 hover:underline"
            >
              ← Quay lại chọn loại
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-4">
          {list.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item.id)}
              className="bg-white shadow hover:shadow-md border rounded-xl p-4 cursor-pointer transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === "tutee"
                  ? `Thuộc lớp: ${item.class}`
                  : `Số lượng học viên: ${item.tuteeCount}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3️⃣ Hiển thị thông tin chi tiết
  const detail =
    mode === "tutee" ? tuteeDetails[selected] : classDetails[selected];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#002855]">
            {mode === "tutee"
              ? `Thông tin Tutee: ${detail.name}`
              : `Chi tiết lớp: ${detail.name}`}
          </h1>
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-blue-700 hover:underline"
          >
            ← Quay lại danh sách
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          {mode === "tutee" ? (
            <>
              <p><b>Tên:</b> {detail.name}</p>
              <p><b>Tiến độ:</b> {detail.progress}</p>
              <p><b>Hoạt động gần nhất:</b> {detail.lastActive}</p>
            </>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-700">
                  <th className="py-3">Tên học viên</th>
                  <th className="py-3">Tiến độ</th>
                </tr>
              </thead>
              <tbody>
                {detail.tutees.map((t, i) => (
                  <tr key={i} className="border-b text-gray-600">
                    <td className="py-3">{t.name}</td>
                    <td className="py-3">{t.progress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
