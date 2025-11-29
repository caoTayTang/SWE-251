import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Clock,
  MapPin,
  Users,
  BookOpen,
  Calendar,
  FileText,
  Star,
  X,
  Edit,
  Trash2,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import {
  getCourseById,
  enrollCourse,
  unenrollCourse,
  getMeetingRecords,
  createMeetingRecord,
  updateMeetingRecord,
  deleteMeetingRecord,
  getCourseEvaluations,
  createSessionEvaluation,
} from "../../../api/api";
import { useUser } from "../../../contexts/AuthContext";

const CourseDetailPage = () => {
  const user = useUser();
  const { id } = useParams();

  // Data State
  const [course, setCourse] = useState(null);
  const [records, setRecords] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  // UI State
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Modals management
  // 'record_list': View course-level meeting logs
  // 'record_form': Create/Edit record form
  // 'evaluate': Tutee evaluation form
  // 'view_evaluations': Tutor view evaluations
  const [activeModal, setActiveModal] = useState(null);

  // Selection State
  const [selectedSession, setSelectedSession] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  // Forms
  // REMOVED sessionId from state
  const [recordForm, setRecordForm] = useState({
    attendees: "",
    discussionPoints: "",
  });

  const [evalForm, setEvalForm] = useState({
    rating: 5,
    comment: "",
    isAnonymous: false,
  });

  // Roles
  const isTutor = user?.role === "tutor";
  const isTutee = user?.role === "tutee";

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const courseRes = await getCourseById(id);
        const courseData = courseRes.data?.course || courseRes.data;
        setCourse(courseData);

        // Fetch Records (Tutor or Enrolled Tutee)
        if (isTutor || (isTutee && courseData.is_enrolled)) {
          try {
            const recordRes = await getMeetingRecords(id);
            console.info("Fetched records", recordRes.data);
            setRecords(recordRes.data?.records || []);
          } catch (e) {
            console.log("No records fetched");
          }
        }

        // Fetch Evaluations (Tutor only)
        if (isTutor) {
          try {
            const evalRes = await getCourseEvaluations(id);
            setEvaluations(evalRes.data?.evaluations || []);
          } catch (e) {
            console.log("No evaluations fetched");
          }
        }
      } catch (error) {
        console.error("Failed to load course details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isTutor, isTutee]);

  // --- 2. HANDLERS: ENROLLMENT ---

  const handleEnroll = async () => {
    if (!window.confirm("Bạn muốn đăng ký khóa học này?")) return;
    try {
      setProcessing(true);
      await enrollCourse(id, user.id);
      window.location.reload();
    } catch (error) {
      alert(
        "Đăng ký thất bại: " + (error.response?.data?.detail || error.message)
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm("Bạn chắc chắn muốn hủy đăng ký?")) return;
    try {
      setProcessing(true);
      await unenrollCourse(parseInt(id), user.user_id);
      window.location.reload();
    } catch (error) {
      alert("Hủy đăng ký thất bại: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  // --- 3. HANDLERS: MEETING RECORD (COURSE LEVEL - NO SESSION ID) ---

  // Prepare Create Form
  const openCreateRecordModal = () => {
    setEditingRecord(null);
    setRecordForm({ attendees: "", discussionPoints: "" }); // Clean form
    setActiveModal("record_form");
  };

  // Prepare Edit Form
  const openEditRecordModal = (record) => {
    setEditingRecord(record);
    setRecordForm({
      attendees: record.attendees,
      // Map snake_case from DB to camelCase for UI state
      discussionPoints: record.discussion_points || record.discussionPoints,
    });
    setActiveModal("record_form");
  };

  // Submit Record
  const handleSubmitRecord = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (editingRecord) {
        // === UPDATE ===
        await updateMeetingRecord(editingRecord.id, {
          ...recordForm,
        });
        alert("Cập nhật biên bản thành công!");
      } else {
        // === CREATE ===
        await createMeetingRecord(id, {
          ...recordForm,
          // No session ID sent here
        });
        alert("Tạo biên bản mới thành công!");
      }

      // Refresh records
      const res = await getMeetingRecords(id);
      setRecords(res.data?.records || []);

      // Return to list view
      setActiveModal("record_list");
    } catch (error) {
      alert("Lỗi thao tác record: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa biên bản này?")) return;
    try {
      await deleteMeetingRecord(recordId);
      setRecords(records.filter((r) => r.id !== recordId));
    } catch (error) {
      alert("Xóa thất bại: " + error.message);
    }
  };

  // --- 4. HANDLERS: EVALUATION (Tutee) ---

  const handleSubmitEvaluation = async (e) => {
    e.preventDefault();
    try {
      await createSessionEvaluation({
        courseId: parseInt(id),
        sessionId: selectedSession.id,
        ...evalForm,
      });
      alert("Cảm ơn đánh giá của bạn!");
      setActiveModal(null);
    } catch (error) {
      alert("Gửi đánh giá thất bại");
    }
  };

  // --- 5. HELPERS ---
  const averageRating = evaluations.length
    ? (
        evaluations.reduce((acc, cur) => acc + cur.rating, 0) /
        evaluations.length
      ).toFixed(1)
    : 0;

  if (loading)
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (!course)
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy khóa học.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 font-sans">
      {/* === HEADER INFO === */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 relative overflow-hidden">
        <div className="flex justify-between items-start z-10 relative">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 text-lg max-w-3xl leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                {course.level?.toUpperCase() || "BEGINNER"}
              </span>
              <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Subject ID: {course.subject_id}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 items-end">
            {/* === BUTTON: MEETING LOG (Available for Tutor & Enrolled Tutee) === */}
            {isTutor && (
              <button
                onClick={() => setActiveModal("record_list")}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-200 transition-all"
              >
                <FileText className="w-5 h-5" />
                Quản lý meeting note
              </button>
            )}

            {/* === TUTOR: VIEW EVALUATIONS === */}
            {isTutor && (
              <>
                <div className="text-right mt-2">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-2xl font-bold text-gray-900">
                      {averageRating}
                    </span>
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <p className="text-xs text-gray-400">
                    ({evaluations.length} đánh giá)
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal("view_evaluations")}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 text-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Xem chi tiết
                </button>
              </>
            )}

            {/* === TUTEE: ENROLL BUTTON === */}
            {isTutee && !course.is_enrolled && (
              <button
                onClick={handleEnroll}
                disabled={
                  processing ||
                  (course.max_students !== -1 && course.available_slots <= 0)
                }
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-medium shadow-sm transition disabled:bg-gray-400 mt-2"
              >
                {processing ? "Đang xử lý..." : "Đăng ký ngay"}
              </button>
            )}
            {isTutee && course.is_enrolled && (
              <button
                onClick={handleUnenroll}
                className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-6 py-2 rounded-lg font-medium transition mt-2"
              >
                {processing ? "Đang xử lý..." : "Hủy đăng ký"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* === SESSIONS LIST === */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Lịch trình giảng dạy
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {course.sessions?.length > 0 ? (
            course.sessions.map((session) => (
              <div
                key={session.id}
                className="p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-md">
                        #{session.session_number}
                      </span>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {session.topic ||
                          `Buổi học số ${session.session_number}`}
                      </h3>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {session.session_date} •{" "}
                        {session.start_time?.slice(0, 5)} -{" "}
                        {session.end_time?.slice(0, 5)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {session.location} ({session.format})
                      </div>
                    </div>
                  </div>

                  {/* Tutee Actions (Evaluate) */}
                  {isTutee && course.is_enrolled && (
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <button
                        onClick={() => {
                          setSelectedSession(session);
                          setActiveModal("evaluate");
                        }}
                        className="w-full py-2 px-3 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition flex items-center justify-center gap-2"
                      >
                        <Star className="w-4 h-4" /> Đánh giá
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 italic">
              Chưa có lịch học nào.
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. RECORD LIST MODAL (COURSE LEVEL) */}
      {activeModal === "record_list" && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" /> Sổ theo dõi lớp
                học
              </h3>
              <div className="flex items-center gap-3">
                {isTutor && (
                  <button
                    onClick={openCreateRecordModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    <PlusCircle className="w-5 h-5" /> Ghi chú mới
                  </button>
                )}
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 bg-white rounded-full hover:bg-gray-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30 flex-1">
              {records.length > 0 ? (
                <div className="grid gap-4">
                  {records.map((record, index) => (
                    <div
                      key={record.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                            Record #{index + 1}
                          </span>
                          <span className="font-semibold text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(record.created_at).toLocaleDateString(
                              "vi-VN",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        {isTutor && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditRecordModal(record)}
                              className="text-blue-600 hover:bg-blue-50 p-1.5 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(record.id)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-800">
                          <span className="font-bold">Thành phần:</span>{" "}
                          {record.attendees}
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {record.discussion_points}
                          </p>
                        </div>
                      </div>
                      <div className="text-right mt-2 text-xs text-gray-400">
                        Cập nhật:{" "}
                        {new Date(record.updated_at).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Chưa có biên bản nào được ghi nhận.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. RECORD FORM MODAL (No Session ID) */}
      {activeModal === "record_form" && isTutor && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setActiveModal("record_list")}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {editingRecord ? "Cập nhật ghi chú" : "Thêm ghi chú mới"}
            </h3>

            <form onSubmit={handleSubmitRecord} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Thành phần tham dự / Tiêu đề
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={recordForm.attendees}
                  onChange={(e) =>
                    setRecordForm({ ...recordForm, attendees: e.target.value })
                  }
                  placeholder="VD: Cả lớp, Nhóm 1..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nội dung
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-2.5 h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={recordForm.discussionPoints}
                  onChange={(e) =>
                    setRecordForm({
                      ...recordForm,
                      discussionPoints: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveModal("record_list")}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                >
                  {processing ? "Đang lưu..." : "Lưu lại"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. EVALUATION LIST MODAL (TUTOR ONLY) */}
      {activeModal === "view_evaluations" && isTutor && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Đánh giá từ học viên
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tổng cộng {evaluations.length} lượt đánh giá
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              {evaluations.length > 0 ? (
                evaluations.map((evalItem, idx) => (
                  <div
                    key={evalItem.id || idx}
                    className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded text-xs">
                          Buổi {evalItem.session_number || "?"}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {evalItem.is_anonymous
                            ? "Học viên ẩn danh"
                            : evalItem.tutee_name || "Học viên"}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < evalItem.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg italic">
                      "{evalItem.comment || "Không có nhận xét chi tiết"}"
                    </p>
                    <p className="text-xs text-gray-400 mt-2 text-right">
                      {evalItem.created_at
                        ? new Date(evalItem.created_at).toLocaleDateString(
                            "vi-VN"
                          )
                        : ""}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500">
                    Chưa có đánh giá nào cho khóa học này.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. EVALUATE MODAL (TUTEE) */}
      {activeModal === "evaluate" && isTutee && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100 relative overflow-hidden">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Đánh giá buổi học {selectedSession?.session_number}
            </h3>

            <form onSubmit={handleSubmitEvaluation} className="space-y-6">
              <div className="flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Bạn cảm thấy buổi học thế nào?
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isActive = evalForm.rating >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setEvalForm({ ...evalForm, rating: star })
                        }
                        className={`p-1 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none ${
                          isActive
                            ? "text-yellow-500"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      >
                        <Star
                          className="w-10 h-10"
                          fill={isActive ? "currentColor" : "none"}
                          strokeWidth={1.5}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  {evalForm.rating === 5
                    ? "Tuyệt vời!"
                    : evalForm.rating === 4
                    ? "Rất tốt"
                    : evalForm.rating === 3
                    ? "Bình thường"
                    : evalForm.rating === 2
                    ? "Cần cải thiện"
                    : "Tệ"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nhận xét chi tiết (Tùy chọn)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-4 h-28 resize-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-gray-700 placeholder-gray-400"
                  placeholder="Hãy chia sẻ thêm về trải nghiệm của bạn..."
                  value={evalForm.comment}
                  onChange={(e) =>
                    setEvalForm({ ...evalForm, comment: e.target.value })
                  }
                />
              </div>

              <div
                className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 cursor-pointer"
                onClick={() =>
                  setEvalForm({
                    ...evalForm,
                    isAnonymous: !evalForm.isAnonymous,
                  })
                }
              >
                <input
                  type="checkbox"
                  id="anon"
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 pointer-events-none"
                  checked={evalForm.isAnonymous}
                  readOnly
                />
                <label
                  htmlFor="anon"
                  className="text-sm font-medium text-gray-700 pointer-events-none"
                >
                  Gửi đánh giá ẩn danh
                  <p className="text-xs font-normal text-gray-500">
                    Giảng viên sẽ không thấy tên của bạn
                  </p>
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors focus:ring-2 focus:ring-gray-200"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-4 focus:ring-orange-500/30"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
