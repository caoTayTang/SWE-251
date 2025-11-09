import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { 
  searchLibrary, 
  getLibraryDocById, 
  downloadLibraryDoc, 
  attachDocToClass 
} from "../../../api/api";


export default function LibraryPage() {
  const { user } = useAuth();
  const [mode, setMode] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [attachedClass, setAttachedClass] = useState("");
  const [error, setError] = useState(""); // Thêm state lỗi

  // Mock function
  const fakeDelay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await searchLibrary(mode, keyword);
      setDocs(response.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tìm kiếm.");
    }
    setLoading(false);
  };

  const handleSelect = async (id) => {
    setLoading(true);
    setError("");
    setAttachedClass(""); // Reset state
    try {
      const response = await getLibraryDocById(id);
      setSelected(response.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải chi tiết.");
    }
    setLoading(false);
  };

  const handleDownload = async (id) => {
    setLoading(true);
    try {
      const response = await downloadLibraryDoc(id);
      alert(response.data.message); // Lấy message từ API
    } catch (err) {
      console.error(err);
      alert("Tải thất bại. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  const handleAttach = async (id) => {
    const className = prompt("Nhập tên lớp:");
    if (!className) return;
    
    setLoading(true);
    try {
      const response = await attachDocToClass(id, className, user.id);
      alert(`Đã đính kèm ${response.data.docName} cho lớp ${response.data.className}`);
      setAttachedClass(response.data.className);
    } catch (err) {
      console.error(err);
      alert("Đính kèm thất bại.");
    }
    setLoading(false);
  };

  // Giao diện chọn loại
  if (!mode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-[400px]">
          <h1 className="text-xl font-bold text-[#002855] mb-4">Truy cập thư viện</h1>
          <p className="text-gray-600 mb-6">Chọn loại học liệu bạn muốn tải:</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setMode("material")}
              className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900"
            >
              Tài liệu học
            </button>
            <button
              onClick={() => setMode("exam")}
              className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900"
            >
              Đề thi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Giao diện xem chi tiết
  if (selected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#002855]">
              Thông tin {mode === "material" ? "tài liệu" : "đề thi"}
            </h1>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-blue-700 hover:underline"
            >
              ← Quay lại danh sách
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto p-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <p><b>Tên:</b> {selected.name}</p>
            <p><b>Loại:</b> {selected.type}</p>
            <p><b>Kích thước:</b> {selected.size}</p>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => handleDownload(selected.id)}
                className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900"
              >
                Tải xuống
              </button>

              {user?.role === "tutor" && (
                <button
                  onClick={() => handleAttach(selected.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Đính kèm vào lớp
                </button>
              )}
            </div>

            {attachedClass && (
              <p className="mt-4 text-sm text-gray-600">
                ✅ Đã đính kèm cho lớp <b>{attachedClass}</b>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Giao diện danh sách
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">
            {mode === "material" ? "Tài liệu học" : "Đề thi"}
          </h1>
          <button
            onClick={() => setMode(null)}
            className="text-sm text-blue-700 hover:underline"
          >
            ← Chọn loại khác
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6 bg-white p-4 rounded-xl shadow-sm flex gap-3">
        <input
          type="text"
          placeholder="Nhập từ khóa..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900"
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : docs.length > 0 ? (
          <ul className="divide-y">
            {docs.map((d) => (
              <li
                key={d.id}
                onClick={() => handleSelect(d.id)}
                className="py-3 flex justify-between cursor-pointer hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-800">{d.name}</p>
                  <p className="text-sm text-gray-500">
                    {d.type} • {d.size}
                  </p>
                </div>
                <span className="text-blue-700 text-sm hover:underline">
                  Xem chi tiết →
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 mt-8">
            Nhập từ khóa và nhấn "Tìm kiếm" để xem danh sách học liệu.
          </p>
        )}
      </div>
    </div>
  );
}
