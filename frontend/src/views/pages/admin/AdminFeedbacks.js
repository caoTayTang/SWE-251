import React, { useState } from "react";
import { MessageSquare, Check, CornerDownLeft } from "lucide-react";

const mock = [
  { id: 1, user: "Tutee: Trần Thị B", topic: "Báo lỗi hệ thống", body: "Không upload được file", status: "new", created: "2025-10-27" },
  { id: 2, user: "Tutor: Nguyễn Văn A", topic: "Yêu cầu tính năng mới", body: "Thêm filter theo level", status: "inprogress", created: "2025-10-26" },
];

export default function AdminFeedbacks() {
  const [items, setItems] = useState(mock);
  const [reply, setReply] = useState("");
  const [selected, setSelected] = useState(null);

  const mark = (id, s) => setItems((it) => it.map(i => i.id === id ? { ...i, status: s } : i));

  const handleReply = (id) => {
    if (!reply.trim()) return alert("Nhập nội dung trả lời");
    // mock append: in real: send to API
    alert("Đã gửi trả lời (mock): " + reply);
    setReply("");
    mark(id, "resolved");
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Feedback — Duyệt & trả lời</h1>

      <div className="bg-white rounded-2xl shadow p-4 divide-y">
        {items.map(it => (
          <div key={it.id} className="py-4 flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">{it.user} • {it.created}</div>
              <div className="font-medium text-gray-800">{it.topic}</div>
              <div className="text-gray-600 mt-1 text-sm">{it.body}</div>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className={`px-2 py-1 rounded-full text-xs ${it.status === "new" ? "bg-blue-50 text-blue-700" : it.status === "inprogress" ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"}`}>
                  {it.status}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => setSelected(it)} className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg"><MessageSquare className="w-4 h-4 inline" /> Trả lời</button>
                <button onClick={() => mark(it.id, "resolved")} className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-lg"><Check className="w-4 h-4 inline" /> Đánh dấu xong</button>
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
              <h4 className="text-lg font-semibold">Trả lời: {selected.topic}</h4>
              <button onClick={() => setSelected(null)} className="text-gray-500">Đóng</button>
            </div>
            <textarea value={reply} onChange={(e)=>setReply(e.target.value)} rows={4} className="w-full border rounded-lg p-3 mb-3" placeholder="Viết trả lời..."/>
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-gray-100 rounded-lg">Hủy</button>
              <button onClick={() => handleReply(selected.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Gửi trả lời</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
