import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * [GET] Lấy danh sách các role có thể đăng nhập
 * Endpoint: GET /api/auth/roles
 */
export const getAuthRoles = () => {
  // return simulateDelay(mockRoles);
  return api.get("/auth/roles");
};

/**
 * [POST] Đăng nhập
 * Endpoint: POST /api/auth/login
 * @param {string} username - (Là BKNetID cũ của bạn)
 * @param {string} password
 * @param {string} role - Role mà user chọn lúc login
 */
export const login = (username, password, role) => {
  return api.post("/auth/login", {
    username,
    password,
    role,
  });
};

/**
 * Tai vi doi qua session based auth cho nen phai co them ham nay
 */
export const me = () => {
  return api.get("/auth/me");
};

export const logout = () => {
  return api.post("/auth/logout");
};

/**
 * [GET] Lấy danh sách khóa học của tutor
 * Endpoint: GET /api/tutor/courses
 */
export const getMyCourses = (tutorId) => {
  return api.get("/tutor/courses", { tutorId });
};

/**
 * [POST] Tạo một khóa học mới
 * Endpoint: POST /api/courses
 * @param {object} courseData - Data của khóa học mới
 */
export const createCourse = (courseData, courseSessions) => {
  return api.post("/courses", {
    courseData,
    courseSessions,
  });
};

/**
 * [GET] Lay 1 khoa hoc
 * Endpoint: GET /api/courses/:id
 * @param {number} id - ID của khóa học
 */
export const getCourseById = (id) => {
  return api.get(`/courses/${id}`);
};

/**
 * [PUT] Cập nhật khóa học
 * Endpoint: PUT /api/courses/:id
 * @param {number} id - ID của khóa học
 * @param {object} updatedData - Data cập nhật
 */
export const updateCourse = (id, payload) => {
  return api.put("/courses", {
    id,
    ...payload,
  });
};

/**
 * [DELETE] Xóa một khóa học
 * Endpoint: DELETE /api/courses/:id
 * @param {number} id - ID của khóa học
 */
export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`);
};

/**
 * [GET] Lấy danh sách khóa học (cho Tutee)
 * Endpoint: GET /api/courses
 */
export const getCoursesForTutee = (tuteeId) => {
  return api.get("/courses", { tuteeId });
};

/**
 * [POST] Tutee đăng ký khóa học
 * Endpoint: POST /api/enrollments
 * @param {number} courseId - ID của khóa học
 * @param {number} tuteeId - ID của tutee (người dùng hiện tại)
 */
export const enrollCourse = (courseId, tuteeId) => {
  return api.post("/enrollments", {
    courseId,
    tuteeId,
  });
};

/**
 * [DELETE] Tutee hủy đăng ký khóa học
 * Endpoint: DELETE /api/enrollments/:courseId
 * @param {number} courseId - ID của khóa học
 * @param {number} tuteeId - ID của tutee (người dùng hiện tại)
 */
export const unenrollCourse = (courseId, tuteeId) => {
  return api.delete("/enrollments", {
    data: {
      courseId,
      tuteeId,
      reason: "",
    },
  });
};

/**
 * [GET] Lấy thông báo của user
 * Endpoint: GET /api/notifications
 */
export const getNotifications = () => {
  return api.get("/notifications");
};

/**
 * [POST] Đánh dấu đã đọc thông báo
 * @param noti id or markAll: true
 * Endpoint: POST /api/notifications/read
 */
export const markNotificationsAsRead = (noti_id = null) => {
  const payload = noti_id ? { id: noti_id } : { markAll: true };
  return api.post("/notifications/read", payload);
};

/**
 * [GET] Lấy danh sách chủ đề feedback
 * Endpoint: GET /api/feedback/topics
 */
export const getFeedbackTopics = () => {
  return api.get("/feedback/topics");
};

/**
 * [POST] Gửi feedback mới
 * Endpoint: POST /api/feedback
 * @param {object} feedbackData - { userId, topic, content }
 */
export const submitFeedback = (feedbackData) => {
  return api.post("/feedback", {
    feedbackData,
  });
};

/**
 * [GET] Tìm kiếm tài liệu
 * Endpoint: GET /api/library?type={mode}&q={keyword}
 */
export const searchLibrary = (type, q) => {
  return api.get("/library", {
    params: {
      type: type,
      q: q,
    },
  });
};

/**
 * [GET] Lấy chi tiết tài liệu
 * Endpoint: GET /api/library/:id
 */
export const getLibraryDocById = (id) => {
  return api.get(`/library/${id}`);
};

/**
 * [POST] Tải tài liệu
 * Endpoint: POST /api/library/:id/download
 */
export const downloadLibraryDoc = (id) => {
  return api.get(`/library/${id}`);
};

// TODO! CAI NAY TUTU LAM TUTOR MOI DC ATTACH NMA TUTOR LAM GI VIEW LIB
// /**
//  * [POST] Đính kèm tài liệu vào lớp
//  * Endpoint: POST /api/library/attach
//  * @param {number} docId - ID tài liệu
//  * @param {string} className - Tên lớp (hoặc classId)
//  * @param {number} tutorId - ID của tutor
//  */
// export const attachDocToClass = (docId, className, tutorId) => {
//   const all = [...mockLibrary.material, ...mockLibrary.exam];
//   const doc = all.find((d) => d.id === docId);
//   console.log(
//     `FAKE API: Tutor ${tutorId} đính kèm ${doc.name} vào lớp ${className}`
//   );

//   return simulateDelay({
//     success: true,
//     docName: doc.name,
//     className: className,
//   });
// };

// TODO! THANG NAY XAI O DAU
// /**
//  * [POST] Gửi báo cáo sự cố/tiến độ
//  * Endpoint: POST /api/reports
//  * @param {object} reportData - { userId, title, details }
//  */
// export const submitReport = (reportData) => {
//   console.log("FAKE API: Nhận báo cáo:", reportData);

//   // Giả lập backend tạo 1 report mới
//   const newReport = {
//     id: Date.now(),
//     reporterId: reportData.userId,
//     title: reportData.title,
//     details: reportData.details,
//     status: "new",
//     createdAt: new Date().toISOString(),
//   };

//   // Backend sẽ lưu vào DB và trả về data đã tạo
//   return simulateDelay(newReport);
// };

/**
 * [GET] Lấy danh sách LỚP của Tutor
 * Endpoint: GET /api/tutor/tracking/classes
 */
export const getTrackingClassList = (tutorId) => {
  return api.get("/tutor/tracking/classes");
};

/**
 * [GET] Lấy danh sách TUTEE của Tutor
 * Endpoint: GET /api/tutor/tracking/tutees
 */
export const getTrackingTuteeList = (tutorId) => {
  return api.get("/tutor/tracking/tutees", { tutorId });
};

/**
 * [GET] Lấy chi tiết LỚP (danh sách Tutee trong lớp)
 * Endpoint: GET /api/tutor/tracking/classes/:id
 */
export const getTrackingClassDetails = (classId) => {
  return api.get(`/tutor/tracking/classes/${classId}`);
};

/**
 * [GET] Lấy chi tiết TUTEE
 * Endpoint: GET /api/tutor/tracking/tutees/:id
 */
export const getTrackingTuteeDetails = (tuteeId) => {
  return api.get(`/tutor/tracking/tutees/${tuteeId}`);
};
// ==================== MEETING RECORDS ====================

export const getMeetingRecords = (courseId) => {
  return api.get(`/courses/${courseId}/records`);
};

export const createMeetingRecord = (courseId, recordData) => {
  // recordData structure: { sessionId, attendees, discussionPoints, ... }
  return api.post(`/courses/${courseId}/records`, { recordData });
};

export const updateMeetingRecord = (recordId, updatedData) => {
  return api.put(`/records/${recordId}`, { updatedData });
};

export const deleteMeetingRecord = (recordId) => {
  return api.delete(`/records/${recordId}`);
};

// ==================== SESSION EVALUATIONS ====================

export const createSessionEvaluation = (evaluationData) => {
  // evaluationData: { sessionId, courseId, rating, comment, isAnonymous }
  return api.post(`/session-evaluations`, { evaluationData });
};

export const getCourseEvaluations = (courseId) => {
  return api.get(`/session-evaluations/course/${courseId}`);
};

// --- ADMIN API ---

// /**
//  * [GET] Lấy data biểu đồ
//  * Endpoint: GET /api/admin/chart
//  */
// export const getAdminDashboardChart = () => {
//   return simulateDelay(mockAdminChartData);
// };

// /**
//  * [GET] Lấy các chỉ số thống kê (ĐÃ FIX - Bỏ Meeting chờ)
//  * Endpoint: GET /api/admin/stats
//  */
// export const getAdminDashboardStats = () => {
//   // --- Giả lập Backend TÍNH TOÁN ---

//   // 1. Đếm Users (trừ admin)
//   const userCount = mockUsers.filter((u) => u.role !== "admin").length;

//   // 2. Đếm Feedback mới (UC-11)
//   const feedbackCount = mockFeedbacks.filter((f) => f.status === "new").length;

//   // 3. Đếm "Báo cáo" (Biên bản) mới (UC-13)
//   const reportCount = mockMeetingNotes.filter((r) => r.status === "new").length;

//   // (Đã bỏ meetingCount)

//   // --- Backend trả về JSON đã TÍNH TOÁN ---
//   const calculatedStats = [
//     { id: 1, title: "Người dùng", value: userCount },
//     { id: 2, title: "Feedback mới", value: feedbackCount },
//     { id: 3, title: "Meeting Note mới", value: reportCount },
//   ];

//   return simulateDelay(calculatedStats);
// };

// --- ADMIN FEEDBACK API ---

// TODO! FOR ADMIN TODO TODO
/**
 * [GET] Lấy tất cả feedback (Join với Users)
 * Endpoint: GET /api/admin/feedbacks
 */
// export const getAdminFeedbacks = () => {
//   console.log("FAKE API: Đang lấy feedbacks + JOIN với Users...");
//   // Giả lập Backend "JOIN" 2 bảng
//   const feedbacksWithUserData = mockFeedbacks.map((fb) => {
//     const user = mockUsers.find((u) => u.id === fb.userId);
//     return {
//       ...fb, // Gồm: id, userId, topic, body, status, createdAt, replies
//       // Data "join" thêm:
//       user: user ? `${user.fullName} (${user.role})` : "Người dùng đã xóa",
//     };
//   });

//   // Sắp xếp cái mới nhất lên đầu
//   return simulateDelay(
//     feedbacksWithUserData.sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     )
//   );
// };

/**
 * [PATCH] Cập nhật status của feedback
 * Endpoint: PATCH /api/admin/feedbacks/:id
 */
// export const updateFeedbackStatus = (id, status) => {
//   console.log(`FAKE API: Cập nhật Feedback ${id} sang status ${status}`);
//   // Giả lập backend trả về data đã cập nhật (đã "join")
//   const original = mockFeedbacks.find((fb) => fb.id === id);
//   const user = mockUsers.find((u) => u.id === original.userId);

//   const updatedResponse = {
//     ...original,
//     status: status, // Cập nhật status
//     user: user ? `${user.fullName} (${user.role})` : "N/A",
//   };
//   return simulateDelay(updatedResponse);
// };

// -- MEETING NOTE --

// TODO! FOR ADMIN TODO TODO
/**
 * [GET] Admin lấy danh sách biên bản (Đã "Join")
 * (Dùng cho AdminReports.js - Mockup 47)
 * Endpoint: GET /api/admin/meeting-notes
 */
// export const getAdminMeetingNotes = () => {
//   console.log("FAKE API: Admin lấy Meeting Notes (JOIN Users, Courses)...");

//   // Giả lập Backend "JOIN" 3 bảng (Notes, Users, Courses)
//   const notesWithData = mockMeetingNotes.map((note) => {
//     const user = mockUsers.find((u) => u.id === note.reporterId);
//     const course = mockCourses.find((c) => c.id === note.courseId);

//     // "Realistic" data trả về
//     const from = user ? `${user.fullName} (${user.role})` : "Không rõ";
//     const courseName = course ? course.title : "N/A";

//     return {
//       ...note, // Gồm: id, type, date, status, url, details...
//       from: from, // Data "join" thêm
//       courseName: courseName, // Data "join" thêm
//     };
//   });

//   // Sắp xếp cái mới nhất lên đầu
//   return simulateDelay(
//     notesWithData.sort((a, b) => new Date(b.date) - new Date(a.date))
//   );
// };

/**
 * [PATCH] Admin cập nhật status (Duyệt/Từ chối)
 * (Dùng cho AdminReports.js - Mockup 47)
 * Endpoint: PATCH /api/admin/meeting-notes/:id
 */
// export const updateMeetingNoteStatus = (id, status) => {
//   console.log(
//     `FAKE API: Admin cập nhật Meeting Note ${id} sang status ${status}`
//   );

//   // Giả lập backend tìm data gốc
//   const original = mockMeetingNotes.find((r) => r.id === id);
//   if (!original) return Promise.reject(new Error("Không tìm thấy biên bản"));

//   // Giả lập backend trả về data đã cập nhật (đã "join")
//   const user = mockUsers.find((u) => u.id === original.reporterId);
//   const from = user ? `${user.fullName} (${user.role})` : "Không rõ";
//   const course = mockCourses.find((c) => c.id === original.courseId);
//   const courseName = course ? course.title : "N/A";

//   const updatedResponse = {
//     ...original,
//     status: status, // Cập nhật status
//     from: from,
//     courseName: courseName,
//   };

//   return simulateDelay(updatedResponse);
// };

// 1. Lấy danh sách lớp học để tracking
export const getTrackingClasses = () => {
  return api.get("/tutor/tracking/classes");
};

// 2. Lấy chi tiết tracking của 1 lớp
export const getTrackingClassDetail = (classId) => {
  return api.get(`/tutor/tracking/classes/${classId}`);
};

// 3. Lấy danh sách học viên (Tutees)
export const getTrackingTutees = () => {
  return api.get("/tutor/tracking/tutees");
};

// 4. Lấy chi tiết tracking của 1 học viên
export const getTrackingTuteeDetail = (tuteeId) => {
  return api.get(`/tutor/tracking/tutees/${tuteeId}`);
};

/**
 * Lấy báo cáo hệ thống
 * Endpoint: GET /api/reports
 * Lưu ý: Backend yêu cầu Body trong method GET
 */
export const getSystemReport = (type) => {
  // type: 'course_summary' | 'enrollment_summary'
  return api.post("/reports", {
    reportData: {
      type: type,
    },
  });
};
