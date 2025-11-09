import React, { useState } from "react";
import { Star, Save } from "lucide-react";

const mock = [
  { id: 1, name: "Nguyễn Văn A (Tutor)", type: "tutor", rating: 4.5, notes: "" },
  { id: 2, name: "Trần Thị B (Tutee)", type: "tutee", rating: 4.0, notes: "" },
];

export default function AdminEvaluations() {
  const [items, setItems] = useState(mock);

  const update = (id, changes) => setItems(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Đánh giá người dùng</h1>

      <div className="bg-white rounded-2xl shadow p-4 space-y-4">
        {items.map(it => (
          <div key={it.id} className="flex items-start justify-between">
            <div>
              <div className="font-medium text-gray-800">{it.name}</div>
              <div className="text-sm text-gray-500">Role: {it.type}</div>

              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-5 h-5" /> <span className="font-semibold">{it.rating}</span>
                </div>
                <input type="range" min="1" max="5" step="0.5" value={it.rating} onChange={e=>update(it.id,{rating: parseFloat(e.target.value)})} className="w-48"/>
              </div>

              <textarea value={it.notes} onChange={e=>update(it.id,{notes:e.target.value})} placeholder="Ghi chú..." className="mt-3 p-2 border rounded w-full" />
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={()=>alert("Save mock")} className="px-3 py-2 bg-blue-600 text-white rounded flex items-center gap-2"><Save className="w-4 h-4"/> Lưu</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
