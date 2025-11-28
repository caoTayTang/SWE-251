import React, { useState, useEffect } from "react";
import SchedulePicker from "./SchedulePicker"; // Giả sử component này trả về object: { 2: {start: '08:00', end: '10:00'}, ... } (2 là thứ Hai)
import { createCourse, updateCourse } from "../../../api/api";

export default function CourseForm({
  view,
  course,
  setView,
  loadCourses,
  setSelectedCourse,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxStudents: "",
    location: "",
    startDate: "",
    endDate: "",
    subject_id: "", // Đổi thành subject_id để khớp backend
    level: "beginner",
    format: "offline",
    sessions: [], // <--- QUAN TRỌNG: Lưu danh sách buổi học ở đây
  });

  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  // Hàm giả lập fetch room (Thay bằng API thật của bạn)
  const CHANGEMEFUNCTION = async () => {
    // Ví dụ data trả về
    return [
      { id: 1, name: "GDH6" },
      { id: 2, name: "B1-201" },
      { id: 3, name: "C2-304" },
      { id: 4, name: "Online Room" },
    ];
  };
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await CHANGEMEFUNCTION();
        setRooms(data);
      } catch (error) {
        console.error("Lỗi fetch rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        maxStudents: course.maxStudents,
        location: course.location,
        startDate: course.startDate || "",
        endDate: course.endDate || "",
        subject_id: course.subject_id || "",
        level: course.level || "beginner",
        format: course.format || "offline",
        sessions: course.sessions || [],
      });
    }
  }, [course]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      maxStudents: "",
      location: "",
      startDate: "",
      endDate: "",
      subject_id: "",
      level: "beginner",
      format: "offline",
      sessions: [],
    });
    setSelectedCourse(null);
  };

  const handleSubmit = async () => {
    // 1. Validation
    if (formData.sessions.length === 0) {
      alert("Vui lòng thêm ít nhất 1 buổi học!");
      return;
    }

    // 2. Tự động tính Start Date và End Date cho courseData
    // (Lấy ngày của buổi đầu tiên và buổi cuối cùng)
    const sortedSessions = [...formData.sessions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // 3. Chuẩn bị Payload
    const courseDataPayload = {
      title: formData.title,
      subject_id: parseInt(formData.subject_id),
      max_students: parseInt(formData.maxStudents),
      description: formData.description,
      level: formData.level,
      status: formData.status,
      // Gửi ngầm start/end date
      // Backend có thể không cần lưu, nhưng nếu cần thì đây là cách lấy
    };

    // 4. Map sessions sang format backend cần
    const courseSessionsPayload = sortedSessions.map((s, index) => ({
      session_number: index + 1,
      session_date: s.date,
      start_time: s.start,
      end_time: s.end,
      format: "offline", // hoặc lấy từ state
      location: formData.location || "GDH6",
    }));

    try {
      setLoading(true);
      if (view === "create") {
        // Gửi đúng 2 cục data backend cần
        await createCourse(courseDataPayload, courseSessionsPayload);
        alert("Tạo khóa học thành công!");
      } else {
        // Update logic (có thể phức tạp hơn vì phải xử lý việc đổi lịch)
        const payload = {
          updatedData: courseDataPayload,
          updatedSessionData: courseSessionsPayload,
        };
        console.dir("Update course payload", course.id, payload);
        await updateCourse(course.id, payload);
        alert("Cập nhật khóa học thành công!");
      }
      resetForm();
      setView("list");
      await loadCourses();
    } catch (error) {
      console.error(error);
      alert(
        "Có lỗi xảy ra: " + (error.response?.data?.message || error.message)
      );
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {view === "create" ? "Tạo khóa học mới" : "Chỉnh sửa khóa học"}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Row 1: Tên + Subject ID */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên khóa học *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="VD: Giải tích 1"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject ID
            </label>
            <input
              type="number"
              value={formData.subject_id}
              onChange={(e) =>
                setFormData({ ...formData, subject_id: e.target.value })
              }
              placeholder="VD: 666"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Row 2: Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Mô tả chi tiết..."
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Row 3: Max Student, Dates */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số lượng tối đa
            </label>
            <input
              type="number"
              value={formData.maxStudents}
              onChange={(e) =>
                setFormData({ ...formData, maxStudents: e.target.value })
              }
              placeholder="25"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        {/* Row 4: Schedule Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lịch học trong tuần
          </label>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <SchedulePicker
              sessions={formData.sessions}
              setSessions={(newSessions) =>
                setFormData({ ...formData, sessions: newSessions })
              }
              defaultLocation={formData.location}
              // schedule={formData.schedule}
              // setSchedule={(sch) => setFormData({ ...formData, schedule: sch })}
            />
            <p className="text-xs text-gray-500 mt-2">
              Hệ thống sẽ tự động tạo các buổi học dựa trên ngày bắt đầu/kết
              thúc và lịch này.
            </p>
            {/* Hiển thị thông tin tóm tắt tự động */}
            {formData.sessions.length > 0 && (
              <p className="text-xs text-blue-600 mt-2">
                * Khóa học sẽ bắt đầu từ <b>{formData.sessions[0]?.date}</b> đến{" "}
                <b>{formData.sessions[formData.sessions.length - 1]?.date}</b>
              </p>
            )}
          </div>
        </div>

        {/* Row 5: Location, Level, Format */}
        <div className="grid grid-cols-3 gap-6">
          {/* 1. Chọn Hình thức trước để quyết định ô bên cạnh hiển thị gì */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình thức
            </label>
            <select
              value={formData.format}
              onChange={(e) => {
                // Reset location khi đổi hình thức để tránh data rác
                setFormData({
                  ...formData,
                  format: e.target.value,
                  location: "",
                });
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="offline">Offline (Tại trường)</option>
              <option value="online">Online (Trực tuyến)</option>
            </select>
          </div>

          {/* 2. Địa điểm (Biến đổi dựa theo Format) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.format === "offline" ? "Phòng học" : "Đường dẫn (Link)"}
            </label>

            {formData.format === "offline" ? (
              // CASE OFFLINE: Hiện Select Option chọn phòng
              <select
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Chọn phòng --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name}
                  </option>
                ))}
              </select>
            ) : (
              // CASE ONLINE: Hiện Input nhập Link
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="VD: https://meet.google.com/..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}
          </div>

          {/* 3. Trình độ (Giữ nguyên) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trình độ
            </label>
            <select
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t">
          <button
            onClick={() => {
              setView("list");
              resetForm();
            }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
          >
            {loading
              ? "Đang xử lý..."
              : view === "create"
              ? "Tạo khóa học"
              : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
}
