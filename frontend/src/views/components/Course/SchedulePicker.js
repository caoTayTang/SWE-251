import React, { useState } from "react";
import { Trash2, Plus, Calendar } from "lucide-react"; // Cần cài lucide-react hoặc dùng icon khác

export default function SchedulePicker({
  sessions,
  setSessions,
  defaultLocation,
}) {
  // State cho việc thêm 1 buổi lẻ
  const [single, setSingle] = useState({
    date: "",
    start: "07:00",
    end: "09:00",
    location: defaultLocation || "",
  });

  // State cho việc generate hàng loạt
  const [bulk, setBulk] = useState({
    startDate: "",
    endDate: "",
    days: [], // [1, 3, 5] (Thứ 2, 4, 6)
    start: "07:00",
    end: "09:00",
  });

  const [mode, setMode] = useState("single"); // 'single' | 'bulk'

  // --- LOGIC 1: Thêm 1 buổi lẻ ---
  const addSingleSession = () => {
    if (!single.date) return alert("Chọn ngày đi bro");

    const newSession = {
      id: Date.now(), // ID tạm để render key
      date: single.date,
      start: single.start,
      end: single.end,
      location: single.location || defaultLocation,
    };

    // Sắp xếp lại theo thời gian tăng dần
    const newSessions = [...sessions, newSession].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setSessions(newSessions);
  };

  // --- LOGIC 2: Generate hàng loạt (Repeat) ---
  const handleBulkGenerate = () => {
    if (!bulk.startDate || !bulk.endDate || bulk.days.length === 0) {
      return alert("Điền đủ Từ ngày, Đến ngày và chọn Thứ");
    }

    const generated = [];
    let current = new Date(bulk.startDate);
    const stop = new Date(bulk.endDate);
    const dayMap = [0, 1, 2, 3, 4, 5, 6]; // Mapping JS Day index

    while (current <= stop) {
      const dayIdx = current.getDay();
      // Kiểm tra xem thứ của ngày hiện tại có trong list user chọn không
      if (bulk.days.includes(dayIdx)) {
        generated.push({
          id: Date.now() + Math.random(),
          date: current.toISOString().split("T")[0], // YYYY-MM-DD
          start: bulk.start,
          end: bulk.end,
          location: defaultLocation,
        });
      }
      current.setDate(current.getDate() + 1);
    }

    // Merge với list cũ và sort lại
    const merged = [...sessions, ...generated].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setSessions(merged);
    alert(`Đã thêm ${generated.length} buổi học!`);
  };

  // Helper toggle thứ cho bulk
  const toggleDay = (dayIdx) => {
    setBulk((prev) => ({
      ...prev,
      days: prev.days.includes(dayIdx)
        ? prev.days.filter((d) => d !== dayIdx)
        : [...prev.days, dayIdx],
    }));
  };

  const removeSession = (index) => {
    const newSessions = sessions.filter((_, i) => i !== index);
    setSessions(newSessions);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      {/* Tabs chuyển chế độ */}
      <div className="flex gap-4 mb-4 border-b pb-2">
        <button
          onClick={() => setMode("single")}
          className={`text-sm font-medium ${
            mode === "single"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Thêm từng buổi
        </button>
        <button
          onClick={() => setMode("bulk")}
          className={`text-sm font-medium ${
            mode === "bulk"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Tạo tự động (Lặp lại)
        </button>
      </div>

      {/* INPUT AREA */}
      <div className="mb-6">
        {mode === "single" ? (
          <div className="flex gap-2 items-end">
            <div>
              <label className="text-xs text-gray-500">Ngày</label>
              <input
                type="date"
                value={single.date}
                onChange={(e) => setSingle({ ...single, date: e.target.value })}
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Bắt đầu</label>
              <input
                type="time"
                value={single.start}
                onChange={(e) =>
                  setSingle({ ...single, start: e.target.value })
                }
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Kết thúc</label>
              <input
                type="time"
                value={single.end}
                onChange={(e) => setSingle({ ...single, end: e.target.value })}
                className="border p-2 rounded w-full text-sm"
              />
            </div>
            <button
              onClick={addSingleSession}
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 h-[38px]"
            >
              <Plus size={18} />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 1. Chọn Ngày bắt đầu - Ngày kết thúc */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={bulk.startDate}
                  onChange={(e) =>
                    setBulk({ ...bulk, startDate: e.target.value })
                  }
                  className="border p-2 rounded w-full text-sm"
                />
              </div>
              <span className="self-center pt-5">➜</span>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={bulk.endDate}
                  onChange={(e) =>
                    setBulk({ ...bulk, endDate: e.target.value })
                  }
                  className="border p-2 rounded w-full text-sm"
                />
              </div>
            </div>

            {/* 2. THÊM MỚI: Chọn Giờ bắt đầu - Giờ kết thúc cho loạt bài học này */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">
                  Giờ bắt đầu
                </label>
                <input
                  type="time"
                  value={bulk.start}
                  onChange={(e) => setBulk({ ...bulk, start: e.target.value })}
                  className="border p-2 rounded w-full text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">
                  Giờ kết thúc
                </label>
                <input
                  type="time"
                  value={bulk.end}
                  onChange={(e) => setBulk({ ...bulk, end: e.target.value })}
                  className="border p-2 rounded w-full text-sm"
                />
              </div>
            </div>

            {/* 3. Chọn Thứ trong tuần */}
            <div>
              <label className="text-xs text-gray-500 block mb-2">
                Lặp lại vào các thứ
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                  <button
                    key={d}
                    type="button" // Quan trọng: Thêm type button để không submit form
                    onClick={() => toggleDay(d)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                      bulk.days.includes(d)
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {d === 0 ? "CN" : `T${d + 1}`}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Nút Generate */}
            <button
              type="button"
              onClick={handleBulkGenerate}
              className="w-full bg-blue-100 text-blue-700 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors mt-2"
            >
              Tạo lịch học tự động
            </button>
          </div>
        )}
      </div>

      {/* DANH SÁCH SESSIONS ĐÃ TẠO */}
      <div className="bg-white rounded border overflow-hidden">
        <div className="bg-gray-100 p-2 text-xs font-bold text-gray-600 flex justify-between">
          <span>Danh sách buổi học ({sessions.length})</span>
          <span
            className="text-red-500 cursor-pointer"
            onClick={() => setSessions([])}
          >
            Xóa hết
          </span>
        </div>
        <div className="max-h-48 overflow-y-auto divide-y">
          {sessions.length === 0 && (
            <p className="p-4 text-center text-gray-400 text-sm">
              Chưa có buổi học nào
            </p>
          )}
          {sessions.map((s, idx) => (
            <div
              key={idx}
              className="p-2 flex justify-between items-center hover:bg-gray-50"
            >
              <div className="text-sm">
                <span className="font-medium text-gray-800">
                  Buổi {idx + 1}:
                </span>{" "}
                {s.date}
                <span className="text-gray-500 text-xs ml-2">
                  ({s.start} - {s.end})
                </span>
              </div>
              <button
                onClick={() => removeSession(idx)}
                className="text-red-400 hover:text-red-600"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
