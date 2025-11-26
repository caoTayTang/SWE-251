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
  mockReports,
  mockProgress,
} from "./mockData.js";

import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
});

// !TODO: REMOVE THIS for mocking
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
  // // 'mode' là 'material' hoặc 'exam'
  // const allDocs = mockLibrary[mode] || [];

  // // Giả lập logic search của backend
  // const results = allDocs.filter((d) =>
  //   d.name.toLowerCase().includes(keyword.toLowerCase())
  // );

  // return simulateDelay(results);
  return api.get("/library", {
    type,
    q,
  });
};

/**
 * [GET] Lấy chi tiết tài liệu
 * Endpoint: GET /api/library/:id
 */
export const getLibraryDocById = (id) => {
  // const all = [...mockLibrary.material, ...mockLibrary.exam];
  // const doc = all.find((d) => d.id === id);

  // if (doc) {
  //   return simulateDelay(doc);
  // } else {
  //   // Giả lập 404
  //   return new Promise((_, reject) => {
  //     setTimeout(() => {
  //       reject(new Error("Không tìm thấy tài liệu"));
  //     }, 400);
  //   });
  // }
  return api.get(`/library/${id}`);
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
 * [POST] Gửi báo cáo sự cố/tiến độ
 * Endpoint: POST /api/reports
 * @param {object} reportData - { userId, title, details }
 */
export const submitReport = (reportData) => {
  console.log("FAKE API: Nhận báo cáo:", reportData);

  // Giả lập backend tạo 1 report mới
  const newReport = {
    id: Date.now(),
    reporterId: reportData.userId,
    title: reportData.title,
    details: reportData.details,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  // Backend sẽ lưu vào DB và trả về data đã tạo
  return simulateDelay(newReport);
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
