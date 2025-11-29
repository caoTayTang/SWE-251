import React, { useMemo } from "react";
// import MeetingNoteButton from "./MeetingNoteButton";
import {
  Calendar,
  MapPin,
  Wifi,
  BarChart,
  Users,
  MonitorPlay,
  LogOut, // Icon cho Unenroll
  UserPlus, // Icon cho Enroll
  Edit,
  Trash2,
} from "lucide-react";

export default function CourseCard({
  course,
  isTutor,
  // Actions cho Tutor
  onEdit,
  onDelete,
  // Actions cho Tutee
  onEnroll,
  onUnenroll,
}) {
  // --- LOGIC XỬ LÝ DỮ LIỆU (Giữ nguyên như cũ) ---
  const courseInfo = useMemo(() => {
    const sessions = course.sessions || [];

    if (sessions.length === 0) {
      return {
        startDate: null,
        endDate: null,
        location: course.location || "Chưa cập nhật",
        format: course.format || "offline",
        formatLabel: "Chưa xác định",
      };
    }

    const sortedSessions = [...sessions].sort(
      (a, b) => new Date(a.session_date) - new Date(b.session_date)
    );

    const startDate = sortedSessions[0].session_date;
    const endDate = sortedSessions[sortedSessions.length - 1].session_date;

    const hasOnline = sessions.some((s) => s.format === "online");
    const hasOffline = sessions.some((s) => s.format === "offline");

    let format = "offline";
    let formatLabel = "Offline";
    let locationDisplay = sortedSessions[0].location;

    if (hasOnline && hasOffline) {
      format = "hybrid";
      formatLabel = "Blended";
      const offlineSession = sessions.find((s) => s.format === "offline");
      locationDisplay = offlineSession
        ? `${offlineSession.location} & Online`
        : "Nhiều địa điểm";
    } else if (hasOnline) {
      format = "online";
      formatLabel = "Online";
      locationDisplay = "Google Meet / Zoom";
    }

    return {
      startDate,
      endDate,
      location: locationDisplay,
      format,
      formatLabel,
    };
  }, [course]);

  // Format Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatLevel = (level) => {
    const map = {
      beginner: "Cơ bản",
      intermediate: "Trung cấp",
      advanced: "Nâng cao",
    };
    return map[level] || level;
  };
  // ------------------------------------------------

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
      {/* --- PHẦN NỘI DUNG (Giống cũ) --- */}
      <div className="p-5 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition line-clamp-2">
            {course.title}
          </h3>
          <span
            className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              course.status === "open"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {course.status === "open" ? "Mở" : "Đóng"}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
          {course.description}
        </p>

        {/* Info Grid */}
        <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div className="flex items-center gap-2">
            {courseInfo.format === "online" ? (
              <Wifi size={16} className="text-blue-500" />
            ) : courseInfo.format === "hybrid" ? (
              <MonitorPlay size={16} className="text-indigo-500" />
            ) : (
              <MapPin size={16} className="text-red-500" />
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-xs text-gray-700">
                {courseInfo.formatLabel}
              </span>
              <span
                className="truncate text-xs text-gray-500"
                title={courseInfo.location}
              >
                {courseInfo.location}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-1">
            <div className="flex items-center gap-2">
              <BarChart size={16} className="text-purple-500" />
              <span className="capitalize">{formatLevel(course.level)}</span>
            </div>
            {course.max_students && (
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Users size={14} />
                <span>
                  {course.enrolled_students || 0}/{course.max_students}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200 mt-1">
            <Calendar size={16} className="text-orange-500" />
            <span className="text-xs font-medium text-gray-700">
              {formatDate(courseInfo.startDate)} -{" "}
              {formatDate(courseInfo.endDate)}
            </span>
          </div>
        </div>
      </div>

      {/* --- FOOTER ACTIONS (Phân quyền Tutor/Tutee) --- */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        {isTutor ? (
          /* ================= GIAO DIỆN TUTOR ================= */
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(course);
              }}
              className="flex items-center justify-center gap-2 bg-white border hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-gray-600 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Edit size={14} /> Sửa
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(course.id);
              }}
              className="flex items-center justify-center gap-2 bg-white border hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Trash2 size={14} /> Xóa
            </button>

            {/* <div className="col-span-2">
              <MeetingNoteButton courseId={course.id} className="w-full" />
            </div> */}
          </div>
        ) : (
          /* ================= GIAO DIỆN TUTEE ================= */
          <div className="w-full">
            {course.is_enrolled ? (
              // Trạng thái: ĐÃ ĐĂNG KÝ -> Hiện nút Hủy
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    window.confirm("Bạn có chắc muốn hủy đăng ký khóa học này?")
                  ) {
                    onUnenroll && onUnenroll(course.id);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <LogOut size={16} />
                Hủy đăng ký
              </button>
            ) : (
              // Trạng thái: CHƯA ĐĂNG KÝ -> Hiện nút Đăng ký
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnroll && onEnroll(course.id);
                }}
                disabled={course.enrolled_students >= course.max_students} // Disable nếu full slot
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm text-white
                  ${
                    course.enrolled_students >= course.max_students
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                  }`}
              >
                {course.enrolled_students >= course.max_students ? (
                  "Đã đủ sĩ số"
                ) : (
                  <>
                    <UserPlus size={16} />
                    Đăng ký ngay
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
