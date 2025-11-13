
// =================================================================
// === HỆ THỐNG LÕI (hcmut.db) ===
// =================================================================


export const mockSsoUsers = [
  { username: "a.nguyen21", defaultPassword: "toi_yeu_mu" },
  { username: "b.tran20", defaultPassword: "toi_yeu_mu" },
  { username: "c.levan", defaultPassword: "toi_yeu_mu" },
  { username: "d.phamthi", defaultPassword: "toi_yeu_mu" },
  { username: "e.hoang21", defaultPassword: "toi_yeu_mu" },
];


export const mockDatacoreStudents = [
  {
    id: "2210001", // (student_id)
    username: "a.nguyen21",
    fullName: "Nguyễn Văn A",
    email: "a.nguyen21@hcmut.edu.vn",
    role: "student",
    status: "active",
    department: "Khoa Khoa học và Kỹ thuật Máy tính",
    major: "Khoa học Máy tính",
  },
  {
    id: "2010002", // (student_id)
    username: "b.tran20",
    fullName: "Trần Thị B",
    email: "b.tran20@hcmut.edu.vn",
    role: "student",
    status: "active",
    department: "Khoa Kỹ thuật Cơ khí",
    major: "Kỹ thuật Cơ khí",
  },
  {
    id: "2310003", // (student_id)
    username: "e.hoang21",
    fullName: "Hoàng Văn E",
    email: "e.hoang21@hcmut.edu.vn",
    role: "student",
    status: "on_leave",
    department: "Khoa Kỹ thuật Hóa học",
    major: "Kỹ thuật Hóa học",
  },
];


export const mockDatacoreStaff = [
  {
    id: "1235", // (staff_id)
    username: "c.levan",
    fullName: "Lê Văn C",
    email: "c.levan@hcmut.edu.vn",
    role: "staff",
    status: "active",
    department: "Khoa Khoa học và Kỹ thuật Máy tính",
    position: "Giảng viên",
  },
  {
    id: "0102", // (staff_id)
    username: "d.phamthi",
    fullName: "Phạm Thị D",
    email: "d.phamthi@hcmut.edu.vn",
    role: "staff",
    status: "active",
    department: "Ban Giám hiệu",
    position: "Ban quản lý",
  },
];


export const mockLibraryResources = [
  {
    id: 1,
    name: "Giải tích 1 - Chương 1",
    resourceType: "material",
    fileType: "pdf",
    fileSize: "2.1 MB",
    uploaderId: "2210001", // Nguyễn Văn A (Student)
  },
  {
    id: 2,
    name: "Vật lý đại cương",
    resourceType: "material",
    fileType: "docx",
    fileSize: "1.3 MB",
    uploaderId: "1235", // Lê Văn C (Staff)
  },
  {
    id: 3,
    name: "Hóa học cơ sở",
    resourceType: "material",
    fileType: "pptx",
    fileSize: "2.8 MB",
    uploaderId: "2210001", // Nguyễn Văn A (Student)
  },
  {
    id: 4,
    name: "Đề thi Giải tích 1 - 2024",
    resourceType: "exam",
    fileType: "pdf",
    fileSize: "1.8 MB",
    uploaderId: "2210001", // Nguyễn Văn A (Student)
  },
  {
    id: 5,
    name: "Đề thi Lập trình C - 2023",
    resourceType: "exam",
    fileType: "docx",
    fileSize: "1.2 MB",
    uploaderId: "1235", // Lê Văn C (Staff)
  },
];


export const mockCoordinatorRooms = [
  { name: "H6-301", capacity: 50, roomType: "standard_room" },
  { name: "C6-510", capacity: 80, roomType: "lab" },
  { name: "GDH6", capacity: 100, roomType: "lecture_hall" },
  { name: "B1-202", capacity: 50, roomType: "standard_room" },
];


export const mockCoordinatorSchedules = [
  {
    roomName: "H6-301",
    userId: "1235", // Lê Văn C (Staff)
    date: "2025-11-18",
    startTime: "07:30",
    endTime: "09:30",
    status: "booked", // (Đã 'booked' trong file .py gốc)
    note: "Giảng dạy: CO1001 - Nhập môn Lập trình",
  },
  {
    roomName: "H6-301",
    userId: null,
    date: "2025-11-20",
    startTime: "09:30",
    endTime: "11:30",
    status: "free", // (Đã 'free' trong file .py gốc)
    note: null,
  },
  {
    roomName: "C6-510",
    userId: null,
    date: "2025-11-19",
    startTime: "13:30",
    endTime: "16:30",
    status: "free", // (Đã 'free' trong file .py gốc)
    note: null,
  },
  {
    roomName: "GDH6",
    userId: "1235", // Lê Văn C (Staff)
    date: "2025-11-21",
    startTime: "09:00",
    endTime: "11:00",
    status: "booked", // (Đây là 'booked' trong file .py gốc)
    note: "Hội thảo chuyên đề",
  },
];

// =================================================================
// === HỆ THỐNG ỨNG DỤNG (muchat.db) ===
// =================================================================


export const mockSubjects = [
  { id: 101, name: "Toán cao cấp" },
  { id: 102, name: "Lập trình" },
  { id: 103, name: "Vật lý" },
  { id: 104, name: "Triết học" },
  { id: 666, name: "7 day lên cao thủ" },
  { id: 336, name: "Seminar" },
  { id: 366, name: "Miscellaneous" },
];


export const mockCourses = [
  {
    id: 1,
    tutorId: "2210001", // Nguyễn Văn A (Student)
    subjectId: 366,
    level: "beginner",
    title: "Kinh tế lượng for noob",
    description: "Khóa học Kinh tế lượng dành cho sinh viên năm nhất",
    status: "open",
    maxStudents: 20,
    createdAt: "2025-10-01T10:00:00Z",
  },
  {
    id: 2,
    tutorId: "1235", // Lê Văn C (Staff)
    subjectId: 102,
    level: "beginner",
    title: "Lập trình C++",
    description: "Học lập trình C++ từ cơ bản đến nâng cao",
    status: "open",
    maxStudents: 15,
    createdAt: "2025-09-20T08:00:00Z",
  },
  // Các khóa học 3 và 4 không được thêm trong script `course.py`
];


export const mockCourseSessions = [
  // Sessions cho Course 1
  {
    courseId: 1,
    sessionNumber: 1,
    date: "2025-11-13",
    startTime: "18:00",
    endTime: "20:00",
    location: "H1-201",
    format: "offline",
  },
  {
    courseId: 1,
    sessionNumber: 2,
    date: "2025-11-20",
    startTime: "18:00",
    endTime: "20:00",
    location: "H1-201",
    format: "offline",
  },
  {
    courseId: 1,
    sessionNumber: 3,
    date: "2025-11-27",
    startTime: "18:00",
    endTime: "20:00",
    location: "https://meet.google.com/toi-yeu-mu",
    format: "online",
  },
  // Sessions cho Course 2
  {
    courseId: 2,
    sessionNumber: 1,
    date: "2025-11-11",
    startTime: "19:00",
    endTime: "21:00",
    location: "https://meet.google.com/toi-yeu-mu",
    format: "online",
  },
  {
    courseId: 2,
    sessionNumber: 2,
    date: "2025-11-18",
    startTime: "19:00",
    endTime: "21:00",
    location: "B4-Lab1",
    format: "offline",
  },
];


export const mockEnrollments = [
  {
    id: 1,
    tuteeId: "2010002", // Trần Thị B (Student)
    courseId: 1,
    enrolledAt: "2025-10-02T15:00:00Z",
    status: "enrolled",
  },
  {
    id: 2,
    tuteeId: "2010002", // Trần Thị B (Student)
    courseId: 3, // Lưu ý: Khóa học 3 & 4 không được tạo, nhưng enrollment vẫn được thêm
    enrolledAt: "2025-10-03T16:00:00Z",
    status: "enrolled",
  },
  {
    id: 3,
    tuteeId: "2010002", // Trần Thị B (Student)
    courseId: 4,
    enrolledAt: "2025-10-04T09:00:00Z",
    status: "enrolled",
  },
];


export const mockNotifications = [
  {
    id: 1,
    userId: "2010002", // Trần Thị B
    type: "session_reminder",
    title: "Nhắc nhở sự kiện",
    content: "Khóa học Kinh tế lượng sắp bắt đầu",
    isRead: false,
    relatedId: 1, // Course ID 1
    createdAt: "2025-11-13T09:27:00Z", // (Giả sử '2 giờ trước' từ 11:27)
  },
  {
    id: 2,
    userId: "2010002", // Trần Thị B
    type: "enrollment_success",
    title: "Đăng ký thành công",
    content: "Bạn đã được thêm vào lớp Lập trình C++",
    isRead: false,
    relatedId: 2, // Course ID 2
    createdAt: "2025-11-12T11:27:00Z", // (Giả sử '1 ngày trước')
  },
  {
    id: 3,
    userId: "2310003", // Hoàng Văn E (Tutor)
    type: "feedback_request",
    title: "Có feedback",
    content: "Thầy đẹp trai quá",
    isRead: true,
    relatedId: null,
    createdAt: "2025-11-10T11:27:00Z", // (Giả sử '3 ngày trước')
  },
];


export const mockFeedbacks = [
  {
    id: 1,
    userId: "2010002", // Trần Thị B
    topic: "Góp ý về nội dung khóa học",
    content:
      "Nội dung khóa học Kinh tế lượng (ID: 1) rất hay nhưng cần thêm ví dụ thực tế về R.",
    isAnonymous: false,
  },
  {
    id: 2,
    userId: "2010002", // Trần Thị B
    topic: "Báo lỗi hệ thống",
    content:
      "Nút 'Xem chi tiết' ở trang danh sách khóa học bị vỡ giao diện trên điện thoại.",
    isAnonymous: false, // (Mặc định, trong .py không set)
  },
  {
    id: 3,
    userId: "2210001", // Nguyễn Văn A
    topic: "Yêu cầu tính năng mới",
    content: "Nên có tính năng chat realtime với giáo viên.",
    isAnonymous: true,
  },
  {
    id: 4,
    userId: "2010002", // Trần Thị B
    topic: "Khác",
    content: "Làm thế nào để xem lại các buổi học đã qua?",
    isAnonymous: false, // (Mặc định)
  },
];


export const mockSessionEvaluations = [
  {
    id: 1,
    sessionId: 1, // (Liên kết đến session 1 của course 1)
    enrollmentId: 1, // (Liên kết đến enrollment 1)
    rating: 5,
    comment: "Buổi học rất tuyệt!",
    isAnonymous: false, // (Mặc định)
  },
];


export const mockMeetingRecords = [
  {
    id: 1,
    courseId: 1,
    tutorId: "2210001", // Nguyễn Văn A
    attendees: "Tutor (2210001), 5 students",
    discussionPoints: "Reviewed chapter 3 quiz results.",
    status: "pending",
  },
];