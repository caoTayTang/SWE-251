import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";

import { useNavigate } from "react-router-dom";
import { Send, AlertCircle, CheckCircle } from "lucide-react";
import { getFeedbackTopics, submitFeedback } from "../../../api/api";

export default function FeedbackPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [topicLoading, setTopicLoading] = useState(true);
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await getFeedbackTopics();
        setTopics(response.data);
      } catch (err) {
        console.error("Lỗi tải chủ đề:", err);
        setError("Không thể tải danh sách chủ đề.");
      } finally {
        setTopicLoading(false);
      }
    };
    loadTopics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic || !content.trim()) return;

    setLoading(true);
    setError(""); // Reset lỗi cũ

    try {
      // Gọi API thật (giả lập)
      await submitFeedback({
        userId: user?.id, // Gửi kèm ID người gửi
        topic: topic,
        content: content,
      });

      // Nếu thành công:
      setDone(true);
      setTimeout(() => navigate(-1), 2000);
    } catch (err) {
      // Nếu lỗi:
      console.error("Lỗi gửi feedback:", err);
      setError("Gửi thất bại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Gửi thành công!
          </h2>
          <p className="text-gray-600">
            Cảm ơn bạn đã góp ý. Hệ thống sẽ quay lại trang trước...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ------- Header (re-use same style) ------- */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Phản hồi / Đánh giá
            </h1>
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

      {/* ------- Form ------- */}
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
              Chọn chủ đề <span className="text-red-500">*</span>
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              disabled={topicLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">
                {topicLoading ? "Đang tải chủ đề..." : "-- Vui lòng chọn --"}
              </option>

              {/* Render topics từ state */}
              {!topicLoading &&
                topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung phản hồi <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
              placeholder="Nhập chi tiết nội dung bạn muốn gửi..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-600">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <span>
              Phản hồi của bạn sẽ được ban quản trị xem xét và phản hồi trong
              thời gian sớm nhất.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Gửi phản hồi
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
