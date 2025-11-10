// 1. Import data "cứng" từ kho
// Chúng ta cần import thêm data mới
import {
  mockCourses,
  mockEnrollments,
  mockUsers,
  mockRoles,
  mockNotifications,
  mockFeedbackTopics,
  mockLibrary,
  mockProgress,
  mockAdminChartData,
  mockFeedbacks,
  mockSessionEvaluations,
  mockMeetingNotes,
} from "./mockData.js";

// 2. Helper giả lập độ trễ mạng (Rất quan trọng)
const simulateDelay = (data) => {
  console.log("FAKE API: Đang gọi...", data);
  return new Promise((resolve) => {
    setTimeout(() => {
      // 3. Luôn trả về { data: ... } để 100% giống axios
      resolve({ data: data });
    }, 400); // Giả lập 400ms
  });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * [GET] Lấy danh sách các role có thể đăng nhập
 * Endpoint: GET /api/auth/roles
 */
export const getAuthRoles = () => {
  return simulateDelay(mockRoles);
};

/**
 * [POST] Đăng nhập
 * Endpoint: POST /api/auth/login
 * @param {string} username - (Là BKNetID cũ của bạn)
 * @param {string} password
 * @param {string} role - Role mà user chọn lúc login
 */
export const login = (username, password, role) => {
  console.log(`FAKE API: Login attempt: ${username} / *** / ${role}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 1. Tìm user trong 'database' (mockUsers)
      // Chú ý: so sánh username chữ thường không phân biệt hoa thường
      const user = mockUsers.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );

      // 2. Kiểm tra mật khẩu
      if (!user || user.password !== password) {
        reject(new Error("Sai BKNetID hoặc mật khẩu"));
        return;
      }

      // 3. Kiểm tra role (Quan trọng: user phải có đúng role đã chọn)
      if (user.role !== role) {
        reject(
          new Error(`Tài khoản này không có quyền truy cập role "${role}"`)
        );
        return;
      }

      // 4. Tạo token giả
      const token = `fake-jwt-token-${user.id}-${Date.now()}`;

      // 5. Trả về user info (không kèm password) và token
      // eslint-disable-next-line no-unused-vars
      const { password: _, ...userInfo } = user; // Loại bỏ password ra khỏi object trả về

      resolve({
        data: {
          user: userInfo,
          token: token,
        },
      });
    }, 800); // Delay login lâu hơn chút cho "ngầu" (800ms)
  });
};

/**
 * [GET] Lấy danh sách khóa học của tutor
 * Endpoint: GET /api/tutor/courses
 */
export const getMyCourses = (tutorId) => {
  // Giả lập backend lọc theo tutorId
  const courses = mockCourses.filter((c) => c.tutorId === tutorId);
  return simulateDelay(courses);
};

/**
 * [POST] Tạo một khóa học mới
 * Endpoint: POST /api/courses
 * @param {object} courseData - Data của khóa học mới
 */
export const createCourse = (courseData) => {
  // Giả lập backend nhận data và trả về data đó (kèm ID giả)
  const newCourseResponse = {
    id: Date.now(), // Backend sẽ tạo ID thật
    ...courseData,
    status: "active",
    enrolledCount: 0,
    createdAt: new Date().toISOString(), // Thêm timestamp
    updatedAt: new Date().toISOString(),
  };
  return simulateDelay(newCourseResponse);
};

/**
 * [PUT] Cập nhật khóa học
 * Endpoint: PUT /api/courses/:id
 * @param {number} id - ID của khóa học
 * @param {object} updatedData - Data cập nhật
 */
export const updateCourse = (id, updatedData) => {
  // Giả lập backend trả về data đã được cập nhật
  const originalCourse = mockCourses.find((c) => c.id === id) || mockCourses[0];
  const updatedResponse = {
    ...originalCourse,
    ...updatedData,
    id: id, // Đảm bảo ID đúng
    updatedAt: new Date().toISOString(), // Thêm timestamp
  };
  return simulateDelay(updatedResponse);
};

/**
 * [DELETE] Xóa một khóa học
 * Endpoint: DELETE /api/courses/:id
 * @param {number} id - ID của khóa học
 */
export const deleteCourse = (id) => {
  // Giả lập backend trả về thông báo thành công
  return simulateDelay({ success: true, message: `Đã xóa khóa học ${id}` });
};

/**
 * [GET] Lấy danh sách khóa học (cho Tutee)
 * Endpoint: GET /api/courses
 */
export const getCoursesForTutee = (tuteeId) => {
  // Giả lập backend lọc và join
  const enrolledCourseIds = new Set(
    mockEnrollments.filter((e) => e.tuteeId === tuteeId).map((e) => e.courseId)
  );

  const tuteeViewCourses = mockCourses
    .filter((c) => c.status === "active") // Chỉ thấy khóa active
    .map((c) => ({
      ...c,
      isEnrolled: enrolledCourseIds.has(c.id), // Check xem đã đăng ký chưa
    }));

  return simulateDelay(tuteeViewCourses);
};

// --- ĐIỀN VÀO 2 HÀM BẠN HỎI ---

/**
 * [POST] Tutee đăng ký khóa học
 * Endpoint: POST /api/enrollments
 * @param {number} courseId - ID của khóa học
 * @param {number} tuteeId - ID của tutee (người dùng hiện tại)
 */
export const enrollCourse = (courseId, tuteeId) => {
  console.log(`FAKE API: Tutee ${tuteeId} đăng ký khóa học ${courseId}`);

  // Giả lập backend tạo 1 enrollment mới và trả về
  const newEnrollment = {
    id: Date.now(), // ID của enrollment
    tuteeId: tuteeId,
    courseId: courseId,
    enrolledAt: new Date().toISOString(),
    status: "active",
  };

  // Giả lập data trả về (giống thật)
  // Backend có thể trả về chính enrollment đó hoặc khóa học đã cập nhật
  return simulateDelay(newEnrollment);
};

/**
 * [DELETE] Tutee hủy đăng ký khóa học
 * Endpoint: DELETE /api/enrollments/:courseId
 * @param {number} courseId - ID của khóa học
 * @param {number} tuteeId - ID của tutee (người dùng hiện tại)
 */
export const unenrollCourse = (courseId, tuteeId) => {
  console.log(`FAKE API: Tutee ${tuteeId} HỦY đăng ký khóa học ${courseId}`);

  // Giả lập backend xóa enrollment
  // Thường chỉ cần trả về success
  const response = {
    success: true,
    message: `Đã hủy đăng ký khóa học ${courseId}`,
  };

  return simulateDelay(response);
};

/**
 * [GET] Lấy thông báo của user
 * Endpoint: GET /api/notifications
 */
export const getNotifications = () => {
  // Giả lập backend chỉ trả về 3 thông báo mới nhất
  return simulateDelay(mockNotifications);
};

/**
 * [POST] Đánh dấu đã đọc thông báo
 * Endpoint: POST /api/notifications/read
 */
export const markNotificationsAsRead = () => {
  console.log("FAKE API: Đánh dấu đã đọc thông báo");
  return simulateDelay({ success: true });
};

/**
 * [GET] Lấy danh sách chủ đề feedback
 * Endpoint: GET /api/feedback/topics
 */
export const getFeedbackTopics = () => {
  return simulateDelay(mockFeedbackTopics);
};

/**
 * [POST] Gửi feedback mới
 * Endpoint: POST /api/feedback
 * @param {object} feedbackData - { userId, topic, content }
 */
export const submitFeedback = (feedbackData) => {
  console.log("FAKE API: Nhận feedback:", feedbackData);
  // Giả lập server trả về success
  return simulateDelay({ success: true });
};

/**
 * [GET] Tìm kiếm tài liệu
 * Endpoint: GET /api/library?type={mode}&q={keyword}
 */
export const searchLibrary = (mode, keyword) => {
  // 'mode' là 'material' hoặc 'exam'
  const allDocs = mockLibrary[mode] || [];

  // Giả lập logic search của backend
  const results = allDocs.filter((d) =>
    d.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return simulateDelay(results);
};

/**
 * [GET] Lấy chi tiết tài liệu
 * Endpoint: GET /api/library/:id
 */
export const getLibraryDocById = (id) => {
  const all = [...mockLibrary.material, ...mockLibrary.exam];
  const doc = all.find((d) => d.id === id);

  if (doc) {
    return simulateDelay(doc);
  } else {
    // Giả lập 404
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Không tìm thấy tài liệu"));
      }, 400);
    });
  }
};

/**
 * [POST] Tải tài liệu
 * Endpoint: POST /api/library/:id/download
 */
export const downloadLibraryDoc = (id) => {
  const all = [...mockLibrary.material, ...mockLibrary.exam];
  const doc = all.find((d) => d.id === id);
  console.log(`FAKE API: Yêu cầu tải file ${doc.name}`);
  // Trong thực tế, server sẽ trả về URL hoặc file blob
  return simulateDelay({
    success: true,
    message: `Bắt đầu tải ${doc.name} (${doc.size})`,
  });
};

/**
 * [POST] Đính kèm tài liệu vào lớp
 * Endpoint: POST /api/library/attach
 * @param {number} docId - ID tài liệu
 * @param {string} className - Tên lớp (hoặc classId)
 * @param {number} tutorId - ID của tutor
 */
export const attachDocToClass = (docId, className, tutorId) => {
  const all = [...mockLibrary.material, ...mockLibrary.exam];
  const doc = all.find((d) => d.id === docId);
  console.log(
    `FAKE API: Tutor ${tutorId} đính kèm ${doc.name} vào lớp ${className}`
  );

  return simulateDelay({
    success: true,
    docName: doc.name,
    className: className,
  });
};

/**
 * [GET] Lấy danh sách LỚP của Tutor
 * Endpoint: GET /api/tutor/tracking/classes
 */
export const getTrackingClassList = (tutorId) => {
  // 1. Lọc các khóa học của tutor
  const classes = mockCourses
    .filter((c) => c.tutorId === tutorId)
    .map((c) => ({
      id: c.id,
      name: c.title,
      tuteeCount: c.enrolledCount,
    }));

  return simulateDelay(classes);
};

/**
 * [GET] Lấy danh sách TUTEE của Tutor
 * Endpoint: GET /api/tutor/tracking/tutees
 */
export const getTrackingTuteeList = (tutorId) => {
  // Đây là một "JOIN" phức tạp mô phỏng backend
  const tutees = mockEnrollments
    .map((enroll) => {
      const course = mockCourses.find((c) => c.id === enroll.courseId);
      // Chỉ lấy tutee nếu khóa học đó thuộc tutor này
      if (course && course.tutorId === tutorId) {
        const tutee = mockUsers.find((u) => u.id === enroll.tuteeId);
        if (tutee) {
          return {
            id: tutee.id,
            name: tutee.fullName,
            class: course.title, // Tên lớp mà tutee đang học
          };
        }
      }
      return null;
    })
    .filter(Boolean); // Lọc bỏ các giá trị null

  // Loại bỏ trùng lặp (nếu 1 tutee học 2 lớp của cùng 1 tutor)
  const uniqueTutees = [
    ...new Map(tutees.map((item) => [item["id"], item])).values(),
  ];

  return simulateDelay(uniqueTutees);
};

/**
 * [GET] Lấy chi tiết LỚP (danh sách Tutee trong lớp)
 * Endpoint: GET /api/tutor/tracking/classes/:id
 */
export const getTrackingClassDetails = (classId) => {
  const course = mockCourses.find((c) => c.id === classId);
  if (!course)
    return new Promise((_, reject) => reject(new Error("Không tìm thấy lớp")));

  // Tìm tất cả Tutee trong lớp này
  const tuteesInClass = mockEnrollments
    .filter((e) => e.courseId === classId)
    .map((enroll) => {
      const tutee = mockUsers.find((u) => u.id === enroll.tuteeId);
      const progress = mockProgress.find((p) => p.enrollmentId === enroll.id);

      return {
        name: tutee?.fullName || "N/A",
        progress: progress ? `${progress.progress}%` : "0%", // Format lại
      };
    });

  const classDetails = {
    name: course.title,
    tutees: tuteesInClass,
  };

  return simulateDelay(classDetails);
};

/**
 * [GET] Lấy chi tiết TUTEE
 * Endpoint: GET /api/tutor/tracking/tutees/:id
 */
export const getTrackingTuteeDetails = (tuteeId) => {
  const tutee = mockUsers.find((u) => u.id === tuteeId);
  if (!tutee)
    return new Promise((_, reject) =>
      reject(new Error("Không tìm thấy tutee"))
    );

  // Tìm enrollment (và progress) GẦN NHẤT của tutee
  const lastEnrollment = mockEnrollments
    .filter((e) => e.tuteeId === tuteeId)
    .pop(); // Lấy cái cuối

  const progress = lastEnrollment
    ? mockProgress.find((p) => p.enrollmentId === lastEnrollment.id)
    : null;

  const tuteeDetails = {
    name: tutee.fullName,
    progress: progress ? `Hoàn thành ${progress.progress}%` : "Chưa có tiến độ",
    lastActive: progress ? progress.lastActive : "Chưa hoạt động",
  };

  return simulateDelay(tuteeDetails);
};

// --- ADMIN API ---

/**
 * [GET] Lấy data biểu đồ
 * Endpoint: GET /api/admin/chart
 */
export const getAdminDashboardChart = () => {
  return simulateDelay(mockAdminChartData);
};

/**
 * [GET] Lấy các chỉ số thống kê (ĐÃ FIX - Bỏ Meeting chờ)
 * Endpoint: GET /api/admin/stats
 */
export const getAdminDashboardStats = () => {
  // --- Giả lập Backend TÍNH TOÁN ---

  // 1. Đếm Users (trừ admin)
  const userCount = mockUsers.filter((u) => u.role !== "admin").length;

  // 2. Đếm Feedback mới (UC-11)
  const feedbackCount = mockFeedbacks.filter((f) => f.status === "new").length;

  // 3. Đếm "Báo cáo" (Biên bản) mới (UC-13)
  const reportCount = mockMeetingNotes.filter((r) => r.status === "new").length;

  // (Đã bỏ meetingCount)

  // --- Backend trả về JSON đã TÍNH TOÁN ---
  const calculatedStats = [
    { id: 1, title: "Người dùng", value: userCount },
    { id: 2, title: "Feedback mới", value: feedbackCount },
    { id: 3, title: "Meeting Note mới", value: reportCount },
  ];

  return simulateDelay(calculatedStats);
};

// --- ADMIN FEEDBACK API ---

/**
 * [GET] Lấy tất cả feedback (Join với Users)
 * Endpoint: GET /api/admin/feedbacks
 */
export const getAdminFeedbacks = () => {
  console.log("FAKE API: Đang lấy feedbacks + JOIN với Users...");
  // Giả lập Backend "JOIN" 2 bảng
  const feedbacksWithUserData = mockFeedbacks.map((fb) => {
    const user = mockUsers.find((u) => u.id === fb.userId);
    return {
      ...fb, // Gồm: id, userId, topic, body, status, createdAt, replies
      // Data "join" thêm:
      user: user ? `${user.fullName} (${user.role})` : "Người dùng đã xóa",
    };
  });

  // Sắp xếp cái mới nhất lên đầu
  return simulateDelay(
    feedbacksWithUserData.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )
  );
};

/**
 * [PATCH] Cập nhật status của feedback
 * Endpoint: PATCH /api/admin/feedbacks/:id
 */
export const updateFeedbackStatus = (id, status) => {
  console.log(`FAKE API: Cập nhật Feedback ${id} sang status ${status}`);
  // Giả lập backend trả về data đã cập nhật (đã "join")
  const original = mockFeedbacks.find((fb) => fb.id === id);
  const user = mockUsers.find((u) => u.id === original.userId);

  const updatedResponse = {
    ...original,
    status: status, // Cập nhật status
    user: user ? `${user.fullName} (${user.role})` : "N/A",
  };
  return simulateDelay(updatedResponse);
};

/**
 * [POST] Gửi trả lời cho feedback
 * Endpoint: POST /api/admin/feedbacks/:id/reply
 */
export const replyToFeedback = (id, replyBody, adminId) => {
  console.log(
    `FAKE API: Admin ${adminId} trả lời Feedback ${id}: ${replyBody}`
  );

  const original = mockFeedbacks.find((fb) => fb.id === id);
  const user = mockUsers.find((u) => u.id === original.userId);

  // Logic backend: Thêm reply và tự động chuyển status
  const newReply = {
    id: Date.now(),
    replierId: adminId,
    body: replyBody,
    createdAt: new Date().toISOString(),
  };

  const updatedResponse = {
    ...original,
    status: "resolved", // Backend tự động chuyển status
    replies: [...original.replies, newReply],
    user: user ? `${user.fullName} (${user.role})` : "N/A",
  };

  return simulateDelay(updatedResponse);
};

// --- ADMIN ACADEMIC REPORTS API ---
/**
 * [GET] Lấy data thống kê học thuật của TẤT CẢ Tutee
 * (Mô phỏng "JOIN" 4 bảng)
 * Endpoint: GET /api/admin/reports/academic-overview
 */
export const getAdminAcademicOverview = () => {
  console.log("FAKE API: Admin generating Academic Overview...");

  const overview = mockUsers
    .filter((u) => u.role === "tutee") // 1. Chỉ lấy Tutee
    .map((tutee) => {
      // 2. Tìm các lớp Tutee này học
      const enrollments = mockEnrollments.filter((e) => e.tuteeId === tutee.id);

      // 3. Tìm tiến độ
      const progresses = mockProgress.filter((p) =>
        enrollments.some((e) => e.id === p.enrollmentId)
      );

      // 4. Tìm đánh giá
      const evaluations = mockSessionEvaluations.filter((ev) =>
        enrollments.some((e) => e.id === ev.enrollmentId)
      );

      // 5. Tính toán
      let avgProgress = 0;
      if (progresses.length > 0) {
        avgProgress =
          progresses.reduce((sum, p) => sum + p.progress, 0) /
          progresses.length;
      }

      let avgRating = 0;
      if (evaluations.length > 0) {
        avgRating =
          evaluations.reduce((sum, ev) => sum + ev.rating, 0) /
          evaluations.length;
      }

      return {
        id: tutee.id,
        name: tutee.fullName,
        class: tutee.academicClass || "N/A",
        coursesTaken: enrollments.length,
        avgProgress: Math.round(avgProgress),
        avgRating: avgRating.toFixed(1), // Làm tròn 1 chữ số
      };
    });

  return simulateDelay(overview);
};

// -- MEETING NOTE --
// --- API CHO BIÊN BẢN CUỘC HỌP (MEETING NOTE) [UC-13] ---

/**
 * [GET] Admin lấy danh sách biên bản (Đã "Join")
 * (Dùng cho AdminReports.js - Mockup 47)
 * Endpoint: GET /api/admin/meeting-notes
 */
export const getAdminMeetingNotes = () => {
  console.log("FAKE API: Admin lấy Meeting Notes (JOIN Users, Courses)...");

  // Giả lập Backend "JOIN" 3 bảng (Notes, Users, Courses)
  const notesWithData = mockMeetingNotes.map((note) => {
    const user = mockUsers.find((u) => u.id === note.reporterId);
    const course = mockCourses.find((c) => c.id === note.courseId);

    // "Realistic" data trả về
    const from = user ? `${user.fullName} (${user.role})` : "Không rõ";
    const courseName = course ? course.title : "N/A";

    return {
      ...note, // Gồm: id, type, date, status, url, details...
      from: from, // Data "join" thêm
      courseName: courseName, // Data "join" thêm
    };
  });

  // Sắp xếp cái mới nhất lên đầu
  return simulateDelay(
    notesWithData.sort((a, b) => new Date(b.date) - new Date(a.date))
  );
};

/**
 * [PATCH] Admin cập nhật status (Duyệt/Từ chối)
 * (Dùng cho AdminReports.js - Mockup 47)
 * Endpoint: PATCH /api/admin/meeting-notes/:id
 */
export const updateMeetingNoteStatus = (id, status) => {
  console.log(
    `FAKE API: Admin cập nhật Meeting Note ${id} sang status ${status}`
  );

  // Giả lập backend tìm data gốc
  const original = mockMeetingNotes.find((r) => r.id === id);
  if (!original) return Promise.reject(new Error("Không tìm thấy biên bản"));

  // Giả lập backend trả về data đã cập nhật (đã "join")
  const user = mockUsers.find((u) => u.id === original.reporterId);
  const from = user ? `${user.fullName} (${user.role})` : "Không rõ";
  const course = mockCourses.find((c) => c.id === original.courseId);
  const courseName = course ? course.title : "N/A";

  const updatedResponse = {
    ...original,
    status: status, // Cập nhật status
    from: from,
    courseName: courseName,
  };

  return simulateDelay(updatedResponse);
};

/**
 * [POST] Tutor tạo biên bản mới
 * (Dùng cho CreateMeetingNotePage.js - Mockup 38)
 * Endpoint: POST /api/meeting-notes
 */
export const createMeetingNote = (noteData) => {
  // noteData = { tutorId, courseId, type, date, url, details }
  console.log("FAKE API: Tutor nộp Meeting Note:", noteData);

  const newNote = {
    id: Date.now(),
    reporterId: noteData.tutorId,
    courseId: noteData.courseId,
    type: noteData.type,
    details: noteData.details,
    date: new Date().toISOString().split("T")[0],
    status: "new", // ❗ Backend LUÔN LUÔN set 'new' (chờ duyệt)
    url: noteData.url || "#",
  };

  // (Backend sẽ lưu 'newNote' này vào DB)

  // Giả lập backend trả về data (đã "join")
  const user = mockUsers.find((u) => u.id === newNote.reporterId);
  const from = user ? `${user.fullName} (${user.role})` : "Không rõ";
  const course = mockCourses.find((c) => c.id === newNote.courseId);
  const courseName = course ? course.title : "N/A";

  return simulateDelay({
    ...newNote,
    from: from,
    courseName: courseName,
  });
};

// --- ADMIN TRACKING API ---

/**
 * [GET] Lấy danh sách lớp HỌC CHÍNH (K60, K61)
 * Endpoint: GET /api/admin/tracking/classes
 */
export const getAdminAcademicClasses = () => {
  // Lọc ra các lớp duy nhất từ mockUsers
  const classes = mockUsers
    .filter((u) => u.role === "tutee" && u.academicClass)
    .map((u) => u.academicClass);

  const uniqueClasses = [...new Set(classes)]; // ['K61-CNTT', 'K60-CNTT']

  return simulateDelay(uniqueClasses);
};

/**
 * [GET] Lấy danh sách TẤT CẢ tutees (để admin theo dõi)
 * Endpoint: GET /api/admin/tracking/tutees
 */
export const getAdminAllTutees = () => {
  console.log(`FAKE API: Admin getting all tutees...`);

  const tutees = mockUsers
    .filter((u) => u.role === "tutee") // 1. Lọc Tutee
    .map((tutee) => {
      // 2. "Join" để lấy tiến độ

      // Tìm tất cả enrollments (đăng ký học) của tutee này
      const enrollments = mockEnrollments.filter((e) => e.tuteeId === tutee.id);

      // Tìm tất cả progress (tiến độ) của các enrollment đó
      const progresses = mockProgress.filter((p) =>
        enrollments.some((e) => e.id === p.enrollmentId)
      );

      // Tính tiến độ trung bình (ví dụ)
      let avgProgress = 0;
      if (progresses.length > 0) {
        avgProgress =
          progresses.reduce((sum, p) => sum + p.progress, 0) /
          progresses.length;
      }

      return {
        id: tutee.id,
        name: tutee.fullName,
        class: tutee.academicClass || "N/A", // Lấy từ mockUsers
        progress: `${Math.round(avgProgress)}%`, // Format lại
      };
    });

  return simulateDelay(tutees);
};
