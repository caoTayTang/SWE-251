// src/views/pages/tutor/CreateMeetingNotePage.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { createMeetingNote } from "../../../api/api";
import { Send, CheckCircle, FileText } from "lucide-react";

export default function CreateMeetingNotePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Lấy thông tin khóa học từ URL (Tutor bấm nút "Tạo note" từ CourseCard)
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const courseId = parseInt(query.get("courseId"));
  const courseName = query.get("courseName");

  // 2. State cho form
  const [type, setType] = useState("Tiến độ học tập");
  const [noteBody, setNoteBody] = useState("");
  const [fileUrl, setFileUrl] = useState(""); // Giả lập link GDocs/PDF

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !noteBody.trim()) {
      setError("Vui lòng nhập loại và nội dung biên bản.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createMeetingNote({
        tutorId: user.id,
        courseId: courseId,
        type: type, // "Tiến độ học tập", "Báo cáo điểm danh"
        date: new Date().toISOString().split("T")[0], // Ngày nộp
        url: fileUrl || "#", // Link file (nếu có)
        details: noteBody, // Nội dung note (lưu vào DB)
      });

      setDone(true);
      setTimeout(() => navigate("/tutor/courses"), 2000); // Quay về ds khóa học
    } catch (err) {
      setError("Nộp biên bản thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Đã nộp biên bản!</h2>
        <p className="text-gray-600">
          Admin sẽ duyệt trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Tạo Biên bản cuộc họp
        </h1>
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600">
          ← Quay lại
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Cho khóa học:{" "}
        <span className="font-semibold">{courseName || "N/A"}</span>
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại biên bản *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Tiến độ học tập</option>
            <option>Báo cáo điểm danh</option>
            <option>Biên bản họp đột xuất</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung biên bản *
          </label>
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            rows={8}
            required
            placeholder="Nội dung chính của buổi họp, các vấn đề đã giải quyết, tiến độ của Tutee..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link tài liệu đính kèm (nếu có)
          </label>
          <input
            type="text"
            value={fileUrl}
            placeholder="https://docs.google.com/..."
            onChange={(e) => setFileUrl(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:bg-gray-400"
        >
          {loading ? (
            "Đang nộp..."
          ) : (
            <>
              <Send className="w-5 h-5" /> Nộp cho Admin duyệt
            </>
          )}
        </button>
      </form>
    </div>
  );
}
