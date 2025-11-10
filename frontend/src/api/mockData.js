/**
 * src/api/mockData.js
 * * Kho data thô, mô phỏng cấu trúc Database (Relational).
 */

export const mockRoles = [
  {
    id: "tutor",
    label: "Tutor",
    description: "Dành cho sinh viên muốn dạy kèm",
  },
  {
    id: "tutee",
    label: "Tutee",
    description: "Dành cho sinh viên cần học thêm",
  },
  { id: "admin", label: "Admin", description: "Quản trị hệ thống" },
];

export const mockUsers = [
  {
    id: 1, // ID của tutor1 là 1
    username: "tutor1", // bknetId cũ -> username
    password: "password123", // (Trong thực tế không lưu password thô thế này, nhưng mock thì OK)
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@hcmut.edu.vn",
    role: "tutor",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0D8ABC&color=fff",
  },
  {
    id: 101, // ID của tutee1 là 101
    username: "tutee1",
    password: "password123",
    fullName: "Lê Văn C",
    email: "levanc@hcmut.edu.vn",
    role: "tutee",
    avatarUrl: "https://ui-avatars.com/api/?name=Le+Van+C&background=random",
    academicClass: "K23-CS",
  },
  {
    // 🔹 MỚI
    id: 102,
    username: "tutee2",
    password: "password123",
    fullName: "Trần Thị B",
    role: "tutee",
    avatarUrl: "...",
    academicClass: "K24-CE",
  },
  {
    // 🔹 MỚI
    id: 103,
    username: "tutee3",
    password: "password123",
    fullName: "Phạm Văn D",
    role: "tutee",
    avatarUrl: "...",
    academicClass: "K25-AS",
  },
  {
    id: 999,
    username: "admin",
    password: "admin123",
    fullName: "Admin HCMUT",
    email: "admin@hcmut.edu.vn",
    role: "admin",
    avatarUrl:
      "https://ui-avatars.com/api/?name=Admin&background=000&color=fff",
  },
];

// --- Bảng "Subjects" (Chủ đề) ---
export const mockSubjects = [
  { id: 101, name: "Toán cao cấp" },
  { id: 102, name: "Lập trình" },
  { id: 103, name: "Vật lý" },
  { id: 104, name: "Triết học" },
];

// --- Bảng "Levels" (Cấp độ) ---
export const mockLevels = [
  { id: 1, name: "beginner", label: "Cơ bản" },
  { id: 2, name: "intermediate", label: "Trung cấp" },
  { id: 3, name: "advanced", label: "Nâng cao" },
];

// --- Bảng chính "Courses" (Giờ đã dùng Foreign Keys) ---
export const mockCourses = [
  {
    id: 1,
    tutorId: 1, // <-- Foreign Key (tham chiếu tới mockUsers.id)
    subjectId: 101, // <-- Foreign Key (tham chiếu tới mockSubjects.id)
    levelId: 1, // <-- Foreign Key (tham chiếu tới mockLevels.id)
    title: "Giải tích 1",
    description: "Khóa học Giải tích 1 dành cho sinh viên năm nhất",
    coverImageUrl: "https://example.com/images/giai-tich-1.jpg",
    status: "active",
    enrolledCount: 2, // ❗ KHỚP: tutee1 (101) và tutee2 (102) đã join    maxStudents: 20,
    schedule: [
      // <-- Dạng này Rất Tốt
      { day: "Thứ 2", start: "18:00", end: "20:00" },
      { day: "Thứ 4", start: "18:00", end: "20:00" },
      { day: "Thứ 6", start: "18:00", end: "20:00" },
    ],
    location: "H1-201",
    createdAt: "2025-10-01T10:00:00Z", // <-- Thêm Timestamps
    updatedAt: "2025-10-05T14:30:00Z",
  },
  {
    id: 2,
    tutorId: 1, // <-- Khóa này của Tutor khác
    subjectId: 102,
    levelId: 1,
    title: "Lập trình C++",
    description: "Học lập trình C++ từ cơ bản đến nâng cao",
    coverImageUrl: "https://example.com/images/cpp-basic.jpg",
    status: "active",
    enrolledCount: 1, // ❗ KHỚP: tutee2 (102) đã join    maxStudents: 15,
    schedule: [
      { day: "Thứ 3", start: "19:00", end: "21:00" },
      { day: "Thứ 5", start: "19:00", end: "21:00" },
    ],
    location: "B4-Lab1",
    createdAt: "2025-09-20T08:00:00Z",
    updatedAt: "2025-10-01T11:00:00Z",
  },
  {
    id: 3,
    tutorId: 1,
    subjectId: 103,
    levelId: 2,
    title: "Vật lý 2",
    description: "Khóa học Vật lý 2 đầy thử thách",
    coverImageUrl: "https://example.com/images/vat-ly-2.jpg",
    status: "active",
    enrolledCount: 2, // ❗ KHỚP: tutee1 (101) và tutee3 (103) đã join    maxStudents: 30,
    schedule: [
      { day: "Thứ 2", start: "14:00", end: "16:00" },
      { day: "Thứ 5", start: "14:00", end: "16:00" },
    ],
    location: "C2-101",
    createdAt: "2025-10-02T00:00:00Z",
    updatedAt: "2025-10-02T00:00:00Z",
  },
  {
    id: 4,
    tutorId: 1,
    subjectId: 104,
    levelId: 3,
    title: "Triết học cổ điển",
    description: "Khóa học đã kết thúc, không còn mở đăng ký",
    coverImageUrl: "https://example.com/images/triet-hoc.jpg",
    status: "inactive",
    enrolledCount: 0,
    maxStudents: 20,
    schedule: [{ day: "Thứ 3", start: "10:00", end: "12:00" }],
    location: "A1-201",
    createdAt: "2024-05-10T00:00:00Z",
    updatedAt: "2024-09-01T00:00:00Z",
  },
];

// --- Bảng "Enrollments" (Mô phỏng Tutee đã đăng ký khóa nào) ---
export const mockEnrollments = [
  {
    id: 1,
    tuteeId: 101, // tutee1 (Lê Văn C)
    courseId: 1, // ... join "Giải tích 1"
    enrolledAt: "2025-10-02T15:00:00Z",
  },
  {
    id: 2,
    tuteeId: 101, // tutee1 (Lê Văn C)
    courseId: 3, // ... join "Vật lý 2"
    enrolledAt: "2025-10-03T16:00:00Z",
  },
  {
    // 🔹 MỚI
    id: 3,
    tuteeId: 102, // tutee2 (Trần Thị B)
    courseId: 1, // ... join "Giải tích 1"
    enrolledAt: "2025-10-04T09:00:00Z",
  },
  {
    // 🔹 MỚI
    id: 4,
    tuteeId: 102, // tutee2 (Trần Thị B)
    courseId: 2, // ... join "Lập trình C++"
    enrolledAt: "2025-10-04T10:00:00Z",
  },
  {
    // 🔹 MỚI
    id: 5,
    tuteeId: 103, // tutee3 (Phạm Văn D)
    courseId: 3, // ... join "Vật lý 2"
    enrolledAt: "2025-10-05T11:00:00Z",
  },
];

// ////////////// Notification
export const mockNotifications = [
  {
    id: 1,
    message: "Khóa học Giải tích 1 sắp bắt đầu",
    time: "2 giờ trước",
    unread: true,
  },
  {
    id: 2,
    message: "Bạn đã được thêm vào lớp Lập trình C++",
    time: "1 ngày trước",
    unread: true,
  },
  {
    id: 3,
    message: "Báo cáo tuần của bạn đã sẵn sàng",
    time: "3 ngày trước",
    unread: false,
  },
];

export const mockFeedbackTopics = [
  "Góp ý về nội dung khóa học",
  "Báo lỗi hệ thống",
  "Đánh giá giáo viên",
  "Yêu cầu tính năng mới",
  "Khác",
];

export const mockLibrary = {
  material: [
    {
      id: 1,
      name: "Giải tích 1 - Chương 1",
      type: "PDF",
      size: "2.1 MB",
      uploaderId: 1,
    },
    {
      id: 2,
      name: "Vật lý đại cương",
      type: "DOCX",
      size: "1.3 MB",
      uploaderId: 999,
    }, // Admin upload
    {
      id: 3,
      name: "Hóa học cơ sở",
      type: "PPTX",
      size: "2.8 MB",
      uploaderId: 1,
    },
  ],
  exam: [
    {
      id: 4,
      name: "Đề thi Giải tích 1 - 2024",
      type: "PDF",
      size: "1.8 MB",
      uploaderId: 1,
    },
    {
      id: 5,
      name: "Đề thi Lập trình C - 2023",
      type: "DOCX",
      size: "1.2 MB",
      uploaderId: 999,
    },
  ],
};

export const mockProgress = [
  {
    id: 901,
    enrollmentId: 1, // tutee1 (101) trong Giải tích 1 (Course 1)
    progress: 75,
    lastActive: "2025-11-07T10:00:00Z",
    notes: "Đang làm tốt chương 2, cần ôn lại chương 1.",
  },
  {
    // 🔹 MỚI
    id: 902,
    enrollmentId: 2, // tutee1 (101) trong Vật lý 2 (Course 3)
    progress: 40,
    lastActive: "2025-11-06T14:00:00Z",
    notes: "Chưa nộp bài tập tuần 3.",
  },
  {
    // 🔹 MỚI
    id: 903,
    enrollmentId: 3, // tutee2 (102) trong Giải tích 1 (Course 1)
    progress: 90,
    lastActive: "2025-11-08T11:00:00Z",
    notes: "Hoàn thành xuất sắc.",
  },
  {
    // 🔹 MỚI
    id: 904,
    enrollmentId: 4, // tutee2 (102) trong Lập trình C++ (Course 2)
    progress: 15,
    lastActive: "2025-11-05T17:00:00Z",
    notes: "Mới bắt đầu, cần cài đặt môi trường.",
  },
  {
    // 🔹 MỚI
    id: 905,
    enrollmentId: 5, // tutee3 (103) trong Vật lý 2 (Course 3)
    progress: 60,
    lastActive: "2025-11-07T19:00:00Z",
    notes: "Có tiến bộ.",
  },
];

// --- ADMIN DASHBOARD DATA ---

export const mockAdminChartData = [
  { name: "Thg 7", meetings: 12, feedbacks: 8, reports: 4 },
  { name: "Thg 8", meetings: 18, feedbacks: 14, reports: 6 },
  { name: "Thg 9", meetings: 10, feedbacks: 6, reports: 3 },
  { name: "Thg 10", meetings: 22, feedbacks: 18, reports: 9 },
  // 🔹 Thêm data "realistic" cho tháng 11
  { name: "Thg 11", meetings: 25, feedbacks: 20, reports: 10 },
];

export const mockAdminStats = [
  {
    id: 1,
    title: "Người dùng", // Dùng 'title' làm key
    value: 345,
    // (Icon <Users /> SẼ NẰM TRONG COMPONENT)
  },
  {
    id: 2,
    title: "Meeting chờ",
    value: 12,
  },
  {
    id: 3,
    title: "Feedback mới",
    // 🔹 "Khớp" data với các "bảng" khác
    // 9 (hardcoded) -> 2 (đếm từ mockReports)
    value: 2, // (Tí nữa api.js sẽ "tính")
  },
  {
    id: 4,
    title: "Báo cáo",
    // 🔹 "Khớp" data
    value: 2, // (đếm từ mockReports)
  },
];

// --- ADMIN EVALUATIONS ---
// export const mockEvaluations = [
//   {
//     id: 501, // ID của bản đánh giá
//     userId: 1, // <-- Foreign Key (tutor1)
//     rating: 4.5,
//     notes: "Tutor rất tích cực.",
//   },
//   {
//     id: 502,
//     userId: 101, // <-- Foreign Key (tutee1)
//     rating: 4.0,
//     notes: "Tutee phản hồi nhanh.",
//   },
//   {
//     id: 503,
//     userId: 102, // <-- Foreign Key (tutee2)
//     rating: 3.5,
//     notes: "",
//   },
// ];

// --- ADMIN FEEDBACKS ---
// (Data này được gửi từ FeedbackPage.js)
export const mockFeedbacks = [
  {
    id: 801,
    userId: 102, // <-- Normalized (Tutee: Trần Thị B)
    topic: "Báo lỗi hệ thống",
    body: "Không upload được file, bấm nút 'Upload' không chạy.",
    status: "new", // 'new', 'inprogress', 'resolved'
    createdAt: "2025-10-27T09:00:00Z",
    replies: [], // Chưa ai trả lời
  },
  {
    id: 802,
    userId: 1, // <-- Normalized (Tutor: Nguyễn Văn A)
    topic: "Yêu cầu tính năng mới",
    body: "Thêm filter theo level cho trang 'Theo dõi lớp'.",
    status: "inprogress",
    createdAt: "2025-10-26T14:30:00Z",
    replies: [
      {
        id: 9001,
        replierId: 999, // Admin (id: 999) đã trả lời
        body: "Cảm ơn góp ý. Team dev sẽ xem xét trong tuần này.",
        createdAt: "2025-10-26T15:00:00Z",
      },
    ],
  },
  {
    id: 803,
    userId: 101, // tutee1
    topic: "Góp ý về nội dung khóa học",
    body: "Nội dung khóa Giải tích 1 chương 2 hơi khó hiểu.",
    status: "resolved",
    createdAt: "2025-10-25T11:00:00Z",
    replies: [
      {
        id: 9002,
        replierId: 999, // Admin
        body: "Đã báo cho Tutor Nguyễn Văn A. Cảm ơn em.",
        createdAt: "2025-10-25T12:00:00Z",
      },
    ],
  },
];

// !NOTE This is different from mockReport (report is like: the system is lagging, not academic report)
export const mockAcademicReports = [
  {
    id: 601,
    reporterId: 1, // <-- Normalized (Tutor: Nguyễn Văn A)
    courseId: 1, // <-- Lớp: Giải tích 1
    type: "Tiến độ học tập",
    date: "2025-10-25",
    status: "new", // 'new', 'approved', 'rejected'
    url: "#", // URL file (có thể trỏ tới mock file)
  },
  {
    id: 602,
    reporterId: 101, // <-- Normalized (Tutee: Lê Văn C)
    courseId: 3, // <-- Lớp: Vật lý 2
    type: "Báo cáo điểm danh",
    date: "2025-10-20",
    status: "approved", // (Đã duyệt 1 cái)
    url: "#",
  },
  {
    id: 603,
    reporterId: 1, // <-- Tutor: Nguyễn Văn A
    courseId: 2, // <-- Lớp: Lập trình C++
    type: "Tiến độ học tập",
    date: "2025-10-27",
    status: "new",
    url: "#",
  },
];

// --- SESSION EVALUATIONS (UC-12) ---
// (Do Tutee gửi sau mỗi buổi học)
export const mockSessionEvaluations = [
  {
    id: 1,
    enrollmentId: 1, // <-- Nối với (Tutee 101, Khóa 1)
    rating: 5, // Tutee 101 cho 5 sao
    comment: "Buổi học rất hữu ích!",
  },
  {
    id: 2,
    enrollmentId: 3, // <-- Nối với (Tutee 102, Khóa 1)
    rating: 4,
    comment: "Thầy giảng hơi nhanh.",
  },
  {
    id: 3,
    enrollmentId: 4, // <-- Nối với (Tutee 102, Khóa 2)
    rating: 5,
    comment: "OK",
  },
  {
    id: 4,
    enrollmentId: 2, // <-- Nối với (Tutee 101, Khóa 3)
    rating: 3,
    comment: "Buổi học này hơi khó.",
  },
];

// --- BẢNG "BIÊN BẢN CUỘC HỌP" (MEETING NOTES) [UC-13] ---
// (Do Tutor tạo, Admin duyệt)
export const mockMeetingNotes = [
  {
    id: 601,
    reporterId: 1, // <-- "Foreign Key" trỏ tới Tutor 1 (Nguyễn Văn A)
    courseId: 1, // <-- "Foreign Key" trỏ tới Khóa 1 (Giải tích 1)
    type: "Tiến độ học tập",
    details: "Tuần 4: Lớp hoàn thành chương 1. Tutee (101, 102) nắm vững.", // (Nội dung biên bản)
    date: "2025-10-25",
    status: "new", // ❗ Trạng thái 'new' (chờ Admin duyệt)
    url: "https://docs.google.com/...", // (Link GDocs/PDF)
  },
  {
    id: 602,
    reporterId: 1, // <-- Tutor 1
    courseId: 2, // <-- Khóa 2 (Lập trình C++)
    type: "Báo cáo điểm danh",
    details: "Tuần 4: Tutee (102) tham gia đầy đủ.",
    date: "2025-10-20",
    status: "approved", // ❗ Trạng thái 'approved' (Admin đã duyệt)
    url: "#",
  },
];
