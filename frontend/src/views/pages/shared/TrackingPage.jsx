// src/views/pages/shared/TrackingPage.js
import React, { useState, useEffect } from "react";
import {
  getTrackingClassList,
  getTrackingTuteeList,
  getTrackingClassDetails,
  getTrackingTuteeDetails,
} from "../../../api/api";
import { useAuth } from "../../../contexts/AuthContext";

export default function TrackingPage() {
  const { user } = useAuth();

  // State chính
  const [mode, setMode] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [listData, setListData] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mode || !user) return; // Chỉ chạy khi có mode và user

    const loadList = async () => {
      setLoading(true);
      setError("");
      setSelectedId(null); // Reset detail
      setDetailData(null); // Reset detail

      try {
        const apiCall =
          mode === "tutee"
            ? getTrackingTuteeList(user.id)
            : getTrackingClassList(user.id);

        const response = await apiCall;
        setListData(response.data);
      } catch (err) {
        setError("Lỗi tải danh sách.");
        console.error(err);
      }
      setLoading(false);
    };

    loadList();
  }, [mode, user]);

  useEffect(() => {
    if (!selectedId || !mode) return;

    const loadDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const apiCall =
          mode === "tutee"
            ? getTrackingTuteeDetails(selectedId)
            : getTrackingClassDetails(selectedId);

        const response = await apiCall;
        setDetailData(response.data);
      } catch (err) {
        setError("Lỗi tải chi tiết.");
        console.error(err);
      }
      setLoading(false);
    };

    loadDetail();
  }, [selectedId, mode]);

  const handleSetMode = (newMode) => {
    setLoading(true); // Set loading ngay khi bấm
    setMode(newMode);
  };

  // 1️⃣ Chưa chọn loại theo dõi
  if (!mode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px] text-center">
          <h1 className="text-xl font-semibold text-[#002855] mb-4">
            Chọn loại theo dõi
          </h1>
          <p className="text-gray-600 mb-6">
            Vui lòng chọn bạn muốn theo dõi theo <b>Tutee</b> hay <b>Lớp</b>
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleSetMode("tutee")}
              className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
            >
              Theo dõi Tutee
            </button>
            <button
              onClick={() => handleSetMode("class")}
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
  if (!selectedId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#002855]">
              {mode === "tutee" ? "Danh sách Tutee" : "Danh sách Lớp"}
            </h1>
            <button
              onClick={() => {
                setMode(null);
                setListData([]);
              }}
              className="text-sm text-blue-700 hover:underline"
            >
              ← Quay lại chọn loại
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-4">
          {loading && <p className="text-center">Đang tải danh sách...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && listData.length === 0 && (
            <p className="text-center text-gray-500">Không tìm thấy dữ liệu.</p>
          )}

          {!loading &&
            listData.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setLoading(true);
                  setSelectedId(item.id);
                }}
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

  if (loading || !detailData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">...</div>
        <p className="text-center p-10">Đang tải chi tiết...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">...</div>
        <p className="text-center p-10 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#002855]">
            {mode === "tutee"
              ? `Thông tin Tutee: ${detailData.name}`
              : `Chi tiết lớp: ${detailData.name}`}
          </h1>
          <button
            onClick={() => setSelectedId(null)}
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
              <p>
                <b>Tên:</b> {detailData.name}
              </p>
              <p>
                <b>Tiến độ:</b> {detailData.progress}
              </p>
              <p>
                <b>Hoạt động gần nhất:</b> {detailData.lastActive}
              </p>
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
                {detailData.tutees.map((t, i) => (
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
