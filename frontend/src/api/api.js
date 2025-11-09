// src/api/courseApi.js
const API_BASE_URL = "http://localhost:8000"; // FastAPI backend

const handleResponse = async (response) => {
    const result = await response.json();
    
    // Check if response is successful
    if (!response.ok) {
        throw new Error(result.detail || result.message || 'API request failed');
    }
    
    return result;
};

// ============= AUTHENTICATION HELPER =============
const getAuthToken = () => {
    // Replace with your actual auth implementation
    return localStorage.getItem('authToken') || null;
};

const getHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };
    
    const token = getAuthToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    
    return headers;
};

// ============= PUBLIC API CALLS =============

/**
 * Get all courses with optional filters
 * @param {Object} filters - Optional filters
 * @param {string} filters.search - Search query
 * @param {string} filters.status - Course status (pending/confirmed/open/full/closed)
 * @param {string} filters.subject - Filter by subject
 * @param {string} filters.level - Filter by level (beginner/intermediate/advanced)
 * @param {string} filters.format - Filter by format (online/offline/hybrid)
 */
export const getCourses = async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.subject) queryParams.append('subject', filters.subject);
    if (filters.level) queryParams.append('level', filters.level);
    if (filters.format) queryParams.append('format', filters.format);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/courses${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

/**
 * Get detailed information about a specific course
 * @param {number} courseId - Course ID
 */
export const getCourseDetail = async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

// ============= TUTOR API CALLS =============

/**
 * Get all courses created by the current tutor
 */
export const getTutorCourses = async () => {
    const response = await fetch(`${API_BASE_URL}/courses/tutor/my-courses`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

/**
 * Create a new course
 * @param {Object} courseData - Course information
 * @param {string} courseData.name - Course name/title
 * @param {string} courseData.description - Course description
 * @param {string} courseData.subject - Subject/topic
 * @param {string} courseData.level - Difficulty level (beginner/intermediate/advanced)
 * @param {number} courseData.maxSlots - Maximum number of students
 * @param {string} courseData.startTime - Start date (YYYY-MM-DD)
 * @param {string} courseData.endTime - End date (YYYY-MM-DD)
 * @param {string} courseData.schedule - Course schedule (e.g., "Thứ 2, 4, 6 - 18:00-20:00")
 * @param {string} courseData.format - Format (online/offline/hybrid)
 * @param {string} courseData.location - Location or meeting link
 */
export const createCourse = async (courseData) => {
    const response = await fetch(`${API_BASE_URL}/courses/tutor/create`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            name: courseData.title || courseData.name,
            description: courseData.description || "",
            subject: courseData.subject || "",
            level: courseData.level || "beginner",
            maxSlots: parseInt(courseData.maxStudents || courseData.maxSlots),
            startTime: courseData.startDate || courseData.startTime,
            endTime: courseData.endDate || courseData.endTime,
            schedule: courseData.schedule || "",
            format: courseData.format || "online",
            location: courseData.location || "",
        }),
    });
    return handleResponse(response);
};

/**
 * Update an existing course
 * @param {number} courseId - Course ID
 * @param {Object} courseData - Updated course information
 */
export const updateCourse = async (courseId, courseData) => {
    const payload = {};
    
    // Map frontend fields to backend fields
    if (courseData.title) payload.name = courseData.title;
    if (courseData.name) payload.name = courseData.name;
    if (courseData.description) payload.description = courseData.description;
    if (courseData.subject) payload.subject = courseData.subject;
    if (courseData.level) payload.level = courseData.level;
    if (courseData.maxStudents) payload.maxSlots = parseInt(courseData.maxStudents);
    if (courseData.maxSlots) payload.maxSlots = parseInt(courseData.maxSlots);
    if (courseData.startDate) payload.startTime = courseData.startDate;
    if (courseData.startTime) payload.startTime = courseData.startTime;
    if (courseData.endDate) payload.endTime = courseData.endDate;
    if (courseData.endTime) payload.endTime = courseData.endTime;
    if (courseData.schedule) payload.schedule = courseData.schedule;
    if (courseData.format) payload.format = courseData.format;
    if (courseData.location) payload.location = courseData.location;
    if (courseData.status) payload.status = courseData.status;
    
    const response = await fetch(`${API_BASE_URL}/courses/tutor/${courseId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
    });
    return handleResponse(response);
};

/**
 * Delete a course
 * @param {number} courseId - Course ID to delete
 */
export const deleteCourse = async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/tutor/${courseId}`, {
        method: "DELETE",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

/**
 * Get list of students enrolled in a course
 * @param {number} courseId - Course ID
 */
export const getCourseStudents = async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/tutor/${courseId}/students`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

// ============= TUTEE API CALLS =============

/**
 * Get courses that the current tutee is enrolled in
 */
export const getEnrolledCourses = async () => {
    const response = await fetch(`${API_BASE_URL}/courses/tutee/enrolled`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

/**
 * Enroll in a course
 * @param {number} courseId - Course ID to enroll in
 */
export const enrollInCourse = async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
        method: "POST",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

/**
 * Unenroll from a course
 * @param {number} courseId - Course ID to unenroll from
 */
export const unenrollFromCourse = async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/unenroll`, {
        method: "POST",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

// ============= ADMIN API CALLS (Optional) =============

/**
 * Update course status (Admin only)
 * @param {number} courseId - Course ID
 * @param {string} status - New status (pending/confirmed/open/full/closed)
 */
export const updateCourseStatus = async (courseId, status) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/status?status=${status}`, {
        method: "PATCH",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

// ============= NOTIFICATIONS =============

/**
 * Get notifications for the current user
 */
export const getNotifications = async () => {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: "GET",
        headers: getHeaders(),
    });
    return handleResponse(response);
};

// Export all functions as a single API object
const CourseAPI = {
    // Public functions
    getCourses,
    getCourseDetail,
    
    // Tutor functions
    getTutorCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseStudents,
    
    // Tutee functions
    getEnrolledCourses,
    enrollInCourse,
    unenrollFromCourse,
    
    // Admin functions
    updateCourseStatus,
    
    // Notifications
    getNotifications,
};

export default CourseAPI;