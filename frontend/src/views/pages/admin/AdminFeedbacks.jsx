import React, { useState, useEffect } from "react";
import { MessageSquare, Check } from "lucide-react";
import {
  getAdminFeedbacks,
  updateFeedbackStatus,
  replyToFeedback,
} from "../../../api/api";
import { useAuth } from "../../../contexts/AuthContext"; // 3. Import useAuth

export default function AdminFeedbacks() {
  const { user } = useAuth(); // 4. Lấy admin user (để gửi reply)
  const [items, setItems] = useState([]); // 5. Khởi tạo rỗng
  const [loading, setLoading] = useState(true); // Loading trang
  const [reply, setReply] = useState("");
  const [selected, setSelected] = useState(null);

  const [actionLoading, setActionLoading] = useState(null); // Sẽ chứa ID của item

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getAdminFeedbacks();
        setItems(response.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const mark = async (id, status) => {
    setActionLoading(id);
    try {
      const response = await updateFeedbackStatus(id, status);
      // Cập nhật lại 1 item trong list
      setItems((prev) => prev.map((i) => (i.id === id ? response.data : i)));
    } catch (err) {
      alert("Cập nhật thất bại");
    }
    setActionLoading(null);
  };
  const handleReply = async (id) => {
    if (!reply.trim()) return alert("Nhập nội dung trả lời");

    setActionLoading(id); // Bật loading
    try {
      // API sẽ tự động set status "resolved"
      const response = await replyToFeedback(id, reply, user.id);
      // Cập nhật lại item
      setItems((prev) => prev.map((i) => (i.id === id ? response.data : i)));
      setReply("");
      setSelected(null); // Đóng panel
    } catch (err) {
      alert("Gửi trả lời thất bại");
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
      <h1 className="text-2xl font-bold mb-6">Feedback — Duyệt & trả lời</h1>

      <div className="bg-white rounded-2xl shadow p-4 divide-y">
        {items.map((it) => (
          <div key={it.id} className="py-4 flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">
                {it.user} • {new Date(it.createdAt).toLocaleDateString("vi-VN")}
              </div>
              <div className="font-medium text-gray-800">{it.topic}</div>
              <div className="text-gray-600 mt-1 text-sm">{it.body}</div>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${it.status === "new" ? "bg-blue-50 text-blue-700" : it.status === "inprogress" ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"}`}
                >
                  {it.status}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => setSelected(it)}
                  disabled={actionLoading === it.id} // Disable khi đang action
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4 inline" /> Trả lời
                </button>
                {it.status !== "resolved" && (
                  <button
                    onClick={() => mark(it.id, "resolved")}
                    disabled={actionLoading === it.id}
                    className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-lg disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 inline" /> Đánh dấu xong
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
          <div className="w-full max-w-2xl bg-white rounded-t-2xl shadow-xl p-4 pointer-events-auto">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-lg font-semibold">
                Trả lời: {selected.topic}
              </h4>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500"
              >
                Đóng
              </button>
            </div>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Viết trả lời..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={() => handleReply(selected.id)}
                disabled={actionLoading === selected.id}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
              >
                {actionLoading === selected.id
                  ? "Đang gửi..."
                  : "Gửi trả lời"}{" "}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
