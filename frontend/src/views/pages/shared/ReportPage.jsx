// src/views/pages/shared/ReportPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { CheckCircle, AlertCircle, Send } from "lucide-react";
import { submitReport } from "../../../api/api";

export default function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !details.trim()) return;

    setLoading(true);
    setError(""); // Reset lỗi

    try {
      // Gọi API thật (giả lập)
      await submitReport({
        userId: user?.id,
        title: title,
        details: details,
      });

      // Thành công
      setDone(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      // Thất bại
      console.error("Lỗi gửi báo cáo:", err);
      setError("Gửi báo cáo thất bại. Vui lòng thử lại sau.");
    } finally {
      // Luôn tắt loading
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Báo cáo đã gửi!
          </h2>
          <p className="text-gray-600">Cảm ơn bạn đã phản hồi cho hệ thống.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Báo cáo sự cố</h1>
            <p className="text-sm text-gray-600">Xin chào, {user?.name}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Quay lại
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề báo cáo *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="VD: Lỗi không mở được trang khóa học"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chi tiết *
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              rows={6}
              placeholder="Mô tả chi tiết lỗi, bước tái hiện..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span>Báo cáo của bạn sẽ được xử lý trong thời gian sớm nhất.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Gửi báo cáo
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
