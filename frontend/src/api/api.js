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
} from './mockData.js';

// 2. Helper giả lập độ trễ mạng (Rất quan trọng)
const simulateDelay = (data) => {
  console.log("FAKE API: Đang gọi...", data);
  return new Promise(resolve => {
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
      const user = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());

      // 2. Kiểm tra mật khẩu
      if (!user || user.password !== password) {
        reject(new Error("Sai BKNetID hoặc mật khẩu"));
        return;
      }

      // 3. Kiểm tra role (Quan trọng: user phải có đúng role đã chọn)
      if (user.role !== role) {
        reject(new Error(`Tài khoản này không có quyền truy cập role "${role}"`));
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
          token: token
        }
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
  const courses = mockCourses.filter(c => c.tutorId === tutorId);
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
    status: 'active',
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
  const originalCourse = mockCourses.find(c => c.id === id) || mockCourses[0];
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
    mockEnrollments.filter(e => e.tuteeId === tuteeId).map(e => e.courseId)
  );

  const tuteeViewCourses = mockCourses
    .filter(c => c.status === 'active') // Chỉ thấy khóa active
    .map(c => ({
      ...c,
      isEnrolled: enrolledCourseIds.has(c.id) // Check xem đã đăng ký chưa
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
    status: "active"
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
    message: `Đã hủy đăng ký khóa học ${courseId}`
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
  const results = allDocs.filter(d => 
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
  const doc = all.find(d => d.id === id);
  
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
  const doc = all.find(d => d.id === id);
  console.log(`FAKE API: Yêu cầu tải file ${doc.name}`);
  // Trong thực tế, server sẽ trả về URL hoặc file blob
  return simulateDelay({ success: true, message: `Bắt đầu tải ${doc.name} (${doc.size})` });
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
  const doc = all.find(d => d.id === docId);
  console.log(`FAKE API: Tutor ${tutorId} đính kèm ${doc.name} vào lớp ${className}`);
  
  return simulateDelay({ 
    success: true, 
    docName: doc.name, 
    className: className 
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
    createdAt: new Date().toISOString()
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
    .filter(c => c.tutorId === tutorId)
    .map(c => ({
      id: c.id,
      name: c.title,
      tuteeCount: c.enrolledCount 
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
    .map(enroll => {
      const course = mockCourses.find(c => c.id === enroll.courseId);
      // Chỉ lấy tutee nếu khóa học đó thuộc tutor này
      if (course && course.tutorId === tutorId) {
        const tutee = mockUsers.find(u => u.id === enroll.tuteeId);
        if (tutee) {
          return {
            id: tutee.id,
            name: tutee.fullName,
            class: course.title // Tên lớp mà tutee đang học
          };
        }
      }
      return null;
    })
    .filter(Boolean); // Lọc bỏ các giá trị null

  // Loại bỏ trùng lặp (nếu 1 tutee học 2 lớp của cùng 1 tutor)
  const uniqueTutees = [...new Map(tutees.map(item => [item['id'], item])).values()];
  
  return simulateDelay(uniqueTutees);
};

/**
 * [GET] Lấy chi tiết LỚP (danh sách Tutee trong lớp)
 * Endpoint: GET /api/tutor/tracking/classes/:id
 */
export const getTrackingClassDetails = (classId) => {
  const course = mockCourses.find(c => c.id === classId);
  if (!course) return new Promise((_, reject) => reject(new Error("Không tìm thấy lớp")));

  // Tìm tất cả Tutee trong lớp này
  const tuteesInClass = mockEnrollments
    .filter(e => e.courseId === classId)
    .map(enroll => {
      const tutee = mockUsers.find(u => u.id === enroll.tuteeId);
      const progress = mockProgress.find(p => p.enrollmentId === enroll.id);
      
      return {
        name: tutee?.fullName || "N/A",
        progress: progress ? `${progress.progress}%` : "0%" // Format lại
      };
    });

  const classDetails = {
    name: course.title,
    tutees: tuteesInClass
  };
  
  return simulateDelay(classDetails);
};

/**
 * [GET] Lấy chi tiết TUTEE
 * Endpoint: GET /api/tutor/tracking/tutees/:id
 */
export const getTrackingTuteeDetails = (tuteeId) => {
  const tutee = mockUsers.find(u => u.id === tuteeId);
  if (!tutee) return new Promise((_, reject) => reject(new Error("Không tìm thấy tutee")));

  // Tìm enrollment (và progress) GẦN NHẤT của tutee
  const lastEnrollment = mockEnrollments
    .filter(e => e.tuteeId === tuteeId)
    .pop(); // Lấy cái cuối
  
  const progress = lastEnrollment 
    ? mockProgress.find(p => p.enrollmentId === lastEnrollment.id) 
    : null;

  const tuteeDetails = {
    name: tutee.fullName,
    progress: progress ? `Hoàn thành ${progress.progress}%` : "Chưa có tiến độ",
    lastActive: progress ? progress.lastActive : "Chưa hoạt động"
  };
  
  return simulateDelay(tuteeDetails);
};