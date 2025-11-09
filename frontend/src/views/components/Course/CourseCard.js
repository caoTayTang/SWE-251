import MeetingNoteButton from "./MeetingNoteButton";

export default function CourseCard({ course, onEdit, onDelete, isTutor }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 p-5 flex flex-col justify-between h-full">
      {/* Header & Info */}
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
            {course.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            course.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}>
            {course.status === "active" ? "Đang hoạt động" : "Đã đóng"}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-5 mt-5 border-t border-gray-100">
        <button
          onClick={() => onEdit(course)}
          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition-colors"
        >
          Sửa
        </button>

        <button
          onClick={() => onDelete(course.id)}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium transition-colors"
        >
          Xóa
        </button>

        {/* Meeting Note chỉ hiện cho tutor */}
        {isTutor && (
          <MeetingNoteButton
            courseId={course.id}
            className="flex-1"
          />
        )}
      </div>
    </div>
  );
}
