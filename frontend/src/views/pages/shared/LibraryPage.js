import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  File,
  User,
  Calendar,
  ChevronRight,
  ArrowLeft,
  Download,
  Share2,
  HardDrive,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  searchLibrary,
  getLibraryDocById,
  downloadLibraryDoc,
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

  const getFileIcon = (type) => {
    const t = type?.toLowerCase();
    if (t === "pdf") return <FileText className="w-6 h-6 text-red-500" />;
    if (t === "doc" || t === "docx")
      return <FileText className="w-6 h-6 text-blue-500" />;
    if (["jpg", "jpeg", "png"].includes(t))
      return <ImageIcon className="w-6 h-6 text-purple-500" />;
    return <File className="w-6 h-6 text-gray-400" />;
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleSearch = async (
    overrideMode = mode,
    overrideKeyword = keyword
  ) => {
    setLoading(true);
    setError("");
    try {
      console.log("Searching library:", overrideMode, overrideKeyword);
      const response = await searchLibrary(overrideMode, overrideKeyword);
      console.log("Search results:", response.data.resources);
      setDocs(response.data.resources);
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
      console.error(response.data);
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
      console.log("Downloaded file", response.data);
      alert("Đã tải xuống: " + response.data.resource.name);
    } catch (err) {
      console.error(err);
      alert("Tải thất bại. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  const handleAttach = async (id) => {
    console.log("Attach function is currently disabled.");
  };
  // const handleAttach = async (id) => {
  //   const className = prompt("Nhập tên lớp:");
  //   if (!className) return;

  //   setLoading(true);
  //   try {
  //     const response = await attachDocToClass(id, className, user.id);
  //     alert(
  //       `Đã đính kèm ${response.data.docName} cho lớp ${response.data.className}`
  //     );
  //     setAttachedClass(response.data.className);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Đính kèm thất bại.");
  //   }
  //   setLoading(false);
  // };

  // Giao diện chọn loại
  if (!mode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-[400px]">
          <h1 className="text-xl font-bold text-[#002855] mb-4">
            Truy cập thư viện
          </h1>
          <p className="text-gray-600 mb-6">Chọn loại học liệu bạn muốn tải:</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setMode("material");
                handleSearch("material", "");
              }}
              className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900"
            >
              Tài liệu học
            </button>
            <button
              onClick={() => {
                setMode("exam");
                handleSearch("exam", "");
              }}
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
    console.log("Selected doc:", selected);
    const selectedDoc = selected.resource;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* 1. Header Navigation */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center text-gray-500 hover:text-[#002855] transition-colors font-medium group"
            >
              <div className="p-2 rounded-full group-hover:bg-gray-100 mr-2 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              Quay lại thư viện
            </button>
          </div>
        </div>

        {/* 2. Main Content */}
        <div className="flex-1 max-w-4xl mx-auto w-full p-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Top Section: File Preview / Icon */}
            <div className="bg-gradient-to-b from-gray-50 to-white p-10 flex flex-col items-center justify-center border-b border-gray-100">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center mb-6">
                {/* Reuse getFileIcon or use a larger version here */}
                <FileText className="w-12 h-12 text-[#002855]" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 text-center max-w-2xl leading-tight">
                {selectedDoc.name}
              </h1>

              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wide rounded-full">
                  {selectedDoc.file_type}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {selectedDoc.resource_type === "material"
                    ? "Tài liệu học"
                    : "Đề thi"}
                </span>
              </div>
            </div>

            {/* Middle Section: Metadata Grid */}
            <div className="p-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">
                Thông tin chi tiết
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {/* Kích thước */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-lg text-gray-500">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">
                      Kích thước file
                    </p>
                    <p className="font-semibold text-gray-900">
                      {selectedDoc.file_size}
                    </p>
                  </div>
                </div>

                {/* Người đăng */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-lg text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">Người đăng</p>
                    <p className="font-semibold text-gray-900">
                      {selectedDoc.uploader_name}
                    </p>
                  </div>
                </div>

                {/* Ngày đăng */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-lg text-gray-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">Ngày tải lên</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedDoc.uploaded_at).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* ID tham chiếu */}
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-gray-50 rounded-lg text-gray-500">
                    <File className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">ID Tài liệu</p>
                    <p className="font-mono font-medium text-gray-900">
                      #{selectedDoc.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attached Class Info (Nếu có) */}
              {attachedClass && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm">
                    Đã đính kèm tài liệu này vào lớp học:{" "}
                    <strong>{attachedClass}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Section: Actions */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end items-center">
              {/* Nút dành cho Tutor */}
              {user?.role === "tutor" && (
                <button
                  onClick={() => handleAttach(selectedDoc.id)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-gray-700 border border-gray-300 font-medium rounded-xl hover:bg-gray-50 hover:text-[#002855] hover:border-blue-200 transition-all shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Đính kèm vào lớp
                </button>
              )}

              {/* Nút Tải xuống (Primary) */}
              <button
                onClick={() => handleDownload(selectedDoc.id)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-[#002855] text-white font-semibold rounded-xl hover:bg-blue-900 shadow-lg shadow-blue-900/20 transform hover:-translate-y-0.5 transition-all"
              >
                <Download className="w-4 h-4" />
                Tải xuống ngay
              </button>
            </div>
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
          onClick={() => handleSearch(mode, keyword)}
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
                className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-blue-100 transition-all duration-200 cursor-pointer flex items-center gap-4"
              >
                {/* 1. File Type Icon Container */}
                <div className="w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center flex-shrink-0 transition-colors">
                  {getFileIcon(d.file_type)}
                </div>

                {/* 2. Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-base truncate pr-2 group-hover:text-[#002855] transition-colors">
                      {d.name}
                    </h3>
                    {/* File extension badge */}
                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                      {d.file_type}
                    </span>
                  </div>

                  {/* 3. Metadata Row */}
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
                    {/* Uploader */}
                    <div
                      className="flex items-center gap-1.5"
                      title="Người đăng"
                    >
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate max-w-[100px]">
                        {d.uploader_name}
                      </span>
                    </div>

                    {/* Date */}
                    <div
                      className="flex items-center gap-1.5"
                      title="Ngày đăng"
                    >
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatDate(d.uploaded_at)}</span>
                    </div>

                    {/* Size */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100">
                      <span className="font-medium text-gray-600">
                        {d.file_size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Action Arrow (Visible on Hover usually, or always) */}
                <div className="pl-2 text-gray-300 group-hover:text-blue-600 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
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
