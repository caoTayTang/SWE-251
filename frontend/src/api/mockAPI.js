const STORAGE_KEY = 'mock_courses';

// Default sample courses
const DEFAULT_COURSES = [
  {
    id: 1,
    title: "Giải tích 1",
    description: "Khóa học Giải tích 1 dành cho sinh viên năm nhất",
    status: "active",
    enrolledCount: 12,
    maxStudents: 20,
    schedule: {
      "Thứ 2": { start: "18:00", end: "20:00" },
      "Thứ 4": { start: "18:00", end: "20:00" },
      "Thứ 6": { start: "18:00", end: "20:00" }
    },
    location: "H1-201",
    subject: "Toán cao cấp",
    level: "beginner"
  },
  {
    id: 2,
    title: "Lập trình C++",
    description: "Học lập trình C++ từ cơ bản đến nâng cao",
    status: "active",
    enrolledCount: 8,
    maxStudents: 15,
    schedule: {
      "Thứ 3": { start: "19:00", end: "21:00" },
      "Thứ 5": { start: "19:00", end: "21:00" }
    },
    location: "B4-Lab1",
    subject: "Lập trình",
    level: "beginner"
  },
  {
    id: 3,
    title: "Vật lý 2",
    description: "Khóa học Vật lý 2 đầy thử thách",
    status: "active",
    enrolledCount: 30,
    maxStudents: 30,
    schedule: {
      "Thứ 2": { start: "14:00", end: "16:00" },
      "Thứ 5": { start: "14:00", end: "16:00" }
    },
    location: "C2-101",
    subject: "Vật lý",
    level: "intermediate"
  },
  {
    id: 4,
    title: "Triết học cổ điển",
    description: "Khóa học đã kết thúc, không còn mở đăng ký",
    status: "inactive",
    enrolledCount: 10,
    maxStudents: 20,
    schedule: {
      "Thứ 3": { start: "10:00", end: "12:00" }
    },
    location: "A1-201",
    subject: "Triết học",
    level: "advanced"
  }
];

// Helper: get courses from localStorage, init if empty
function loadCourses() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COURSES));
    return DEFAULT_COURSES;
  }
  return JSON.parse(data);
}

function saveCourses(courses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
}

function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const mockAPI = {
  async getMyCourses() {
    await delay();
    return loadCourses();
  },

  async createCourse(courseData) {
    await delay();
    const courses = loadCourses();
    const newCourse = {
      id: Date.now(),
      ...courseData,
      createdAt: new Date().toISOString(),
    };
    courses.push(newCourse);
    saveCourses(courses);
    return newCourse;
  },

  async updateCourse(id, updatedData) {
    await delay();
    const courses = loadCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    courses[index] = { ...courses[index], ...updatedData };
    saveCourses(courses);
    return courses[index];
  },

  async deleteCourse(id) {
    await delay();
    const courses = loadCourses().filter(c => c.id !== id);
    saveCourses(courses);
    return true;
  },

  async getCoursesForTutor() {
    const courses = loadCourses();
    return courses; // tutor có thể edit tất cả courses
  },

  async getCoursesForTutee() {
    const courses = loadCourses();
    return courses.map(c => ({
      ...c,
      isEnrolled: Math.random() > 0.5 // hoặc dựa trên user mock
    }));
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
