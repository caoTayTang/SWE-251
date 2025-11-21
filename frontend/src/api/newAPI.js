/**
 * API Routes Documentation
 * Complete input/output JSON structures for all API endpoints
 */

const API_ROUTES = {
  
  // ==================== AUTH ROUTES ====================
  auth: {
    getRoles: {
      method: 'GET',
      path: '/api/roles',
      input: null,
      output: [
        {
          id: 'TUTOR',
          label: 'tutor',
          description: 'Dành cho sinh viên muốn dạy kèm'
        },
        {
          id: 'TUTEE',
          label: 'tutee',
          description: 'Dành cho sinh viên cần học thêm'
        },
        {
          id: 'ADMIN',
          label: 'admin',
          description: 'Quản trị hệ thống'
        }
      ]
    },
    
    login: {
      method: 'POST',
      path: '/api/login',
      input: {
        username: 'string',
        password: 'string',
        role: 'string' // 'tutor' | 'tutee' | 'admin'
      },
      output: {
        username: 'string',
        role: 'string',
        status: 'Login successful'
      }
    },
    
    logout: {
      method: 'POST',
      path: '/api/logout',
      input: null,
      output: {
        status: 'Logout successful'
      }
    }
  },

  // ==================== COURSE ROUTES (TUTOR) ====================
  tutor: {
    getCourses: {
      method: 'GET',
      path: '/api/tutor/courses',
      requiresAuth: true,
      requiresRole: 'tutor',
      input: null,
      output: {
        status: 'success',
        tutor: 'string', // user_id
        courses: [
          {
            id: 'number',
            title: 'string',
            description: 'string',
            cover_image_url: 'string',
            tutor_id: 'string',
            subject_id: 'number',
            level: 'string', // 'beginner' | 'intermediate' | 'advanced'
            max_students: 'number',
            status: 'string', // 'pending' | 'open' | 'closed' | 'cancelled'
            created_at: 'string', // ISO datetime
            updated_at: 'string', // ISO datetime
            sessions: [
              {
                id: 'number',
                session_number: 'number',
                session_date: 'string', // ISO date
                start_time: 'string', // HH:MM
                end_time: 'string', // HH:MM
                format: 'string', // 'online' | 'offline'
                location: 'string'
              }
            ],
            resources: [
              {
                id: 'number',
                resource_id: 'number'
              }
            ]
          }
        ]
      }
    },

    createCourse: {
      method: 'POST',
      path: '/api/courses',
      requiresAuth: true,
      requiresRole: 'tutor',
      input: {
        courseData: {
          title: 'string',
          subject_id: 'number',
          max_students: 'number',
          description: 'string',
          cover_image_url: 'string',
          level: 'string', // 'beginner' | 'intermediate' | 'advanced'
          status: 'string' // 'pending' | 'open' | 'closed' | 'cancelled'
        },
        courseSessions: [
          {
            session_number: 'number',
            session_date: 'string', // YYYY-MM-DD
            start_time: 'string', // HH:MM
            end_time: 'string', // HH:MM
            format: 'string', // 'online' | 'offline'
            location: 'string'
          }
        ],
        courseResources: ['number'] // Array of resource IDs
      },
      output: {
        status: 'success',
        message: 'Course created successfully',
        course_id: 'number',
        course: {
          id: 'number',
          title: 'string',
          tutor_id: 'string',
          status: 'string'
        },
        sessions_created: 'number',
        sessions: [
          {
            id: 'number',
            session_number: 'number',
            date: 'string', // ISO date
            time: 'string', // HH:MM - HH:MM
            format: 'string'
          }
        ],
        resources_linked: 'number',
        resources: [
          {
            id: 'number',
            resource_id: 'number'
          }
        ]
      }
    },

    modifyCourse: { 
      method: 'PUT',
      path: '/api/courses',
      requiresAuth: true,
      requiresRole: 'tutor',
      input: {
        id: 'number', // course_id
        updatedData: { //for course data
          title: 'string',
          description: 'string',
          cover_image_url: 'string',
          level: 'string',
          max_students: 'number',
          status: 'string'
        },
        updatedSessionData: { //for course session data - modify one session at a time
          session_number: 'number',
          session_date: 'string', // YYYY-MM-DD
          start_time: 'string', // HH:MM
          end_time: 'string', // HH:MM
          format: 'string',
          location: 'string'
        },
        courseSessionId: 'number', // session_number in updatedSessionData if update session info
        courseResources: ['number'] // Array of resource IDs
      },
      output: {
        status: 'success',
        message: 'Course updated successfully',
        notifications_sent: 'number',
        course: {
          id: 'number',
          title: 'string',
          status: 'string',
          updated_at: 'string' // ISO datetime
        },
        sessions_updated: 'number',
        sessions: 'object', // updated session data
        resources_updated: 'number',
        resources: [
          {
            id: 'number',
            resource_id: 'number'
          }
        ]
      }
    },

    deleteCourse: {
      method: 'DELETE',
      path: '/api/courses',
      requiresAuth: true,
      requiresRole: 'tutor',
      input: {
        id: 'number' // course_id
      },
      output: {
        status: 'success',
        message: 'Course deleted successfully',
        notifications_sent: 'number'
      }
    }
  },

  // ==================== COURSE ROUTES (TUTEE) ====================
  tutee: {
    getCourses: {
      method: 'GET',
      path: '/api/courses',
      requiresAuth: true,
      requiresRole: 'tutee',
      queryParams: {
        status: 'string', // optional
        subject_id: 'number', // optional
        level: 'string' // optional
      },
      input: null,
      output: {
        status: 'success',
        tutee: 'string', // user_id
        courses: [
          {
            id: 'number',
            title: 'string',
            description: 'string',
            cover_image_url: 'string',
            tutor_id: 'string',
            subject_id: 'number',
            level: 'string',
            max_students: 'number',
            enrolled_students: 'number',
            available_slots: 'number',
            status: 'string',
            is_enrolled: 'boolean',
            created_at: 'string',
            sessions: [
              {
                id: 'number',
                session_number: 'number',
                session_date: 'string',
                start_time: 'string',
                end_time: 'string',
                format: 'string',
                location: 'string'
              }
            ],
            resources: [
              {
                id: 'number',
                resource_id: 'number'
              }
            ]
          }
        ]
      }
    },

    enrollCourse: {
      method: 'POST',
      path: '/api/enrollments',
      requiresAuth: true,
      requiresRole: 'tutee',
      input: {
        courseId: 'number',
        tuteeId: 'string' // optional, defaults to current user
      },
      output: {
        status: 'success',
        message: 'Successfully enrolled in course',
        enrollment_id: 'number',
        course: {
          id: 'number',
          title: 'string'
        }
      }
    },

    unenrollCourse: {
      method: 'DELETE',
      path: '/api/enrollments',
      requiresAuth: true,
      requiresRole: 'tutee',
      input: {
        courseId: 'number',
        tuteeId: 'string', // optional
        reason: 'string' // optional, default: 'Student requested withdrawal'
      },
      output: {
        status: 'success',
        message: 'Successfully unenrolled from course',
        course: {
          id: 'number',
          title: 'string'
        }
      }
    },

    getMyEnrollments: {
      method: 'GET',
      path: '/api/tutee/enrollments',
      requiresAuth: true,
      requiresRole: 'tutee',
      queryParams: {
        status: 'string' // optional: 'enrolled' | 'dropped' | 'completed'
      },
      input: null,
      output: {
        status: 'success',
        tutee: 'string', // username
        enrollments: [
          {
            enrollment_id: 'number',
            course_id: 'number',
            course_title: 'string',
            tutor_id: 'string',
            status: 'string',
            enrollment_date: 'string', // ISO datetime
            drop_reason: 'string | null'
          }
        ]
      }
    }
  },

  // ==================== FEEDBACK ROUTES ====================
  feedback: {
    getFeedback: {
      method: 'GET',
      path: '/api/feedback',
      requiresAuth: true,
      requiresRole: ['tutor', 'admin'],
      queryParams: {
        topic: 'string' // optional
      },
      input: null,
      output: {
        status: 'success',
        count: 'number',
        feedback: [
          {
            id: 'number',
            user_id: 'string | null', // null if anonymous
            topic: 'string',
            content: 'string',
            is_anonymous: 'boolean',
            created_at: 'string' // ISO datetime
          }
        ]
      }
    },

    getFeedbackTopics: {
      method: 'GET',
      path: '/api/feedback/topics',
      requiresAuth: true,
      requiresRole: ['tutor', 'admin'],
      input: null,
      output: {
        status: 'success',
        topics: ['string']
      }
    },

    createFeedback: {
      method: 'POST',
      path: '/api/feedback',
      requiresAuth: true,
      input: {
        feedbackData: {
          topic: 'string',
          content: 'string',
          isAnonymous: 'boolean' // default: false
        }
      },
      output: {
        status: 'success',
        message: 'Feedback submitted successfully',
        feedback: {
          id: 'number',
          topic: 'string',
          is_anonymous: 'boolean',
          created_at: 'string'
        }
      }
    },

    createSessionEvaluation: {
      method: 'POST',
      path: '/api/session-evaluations',
      requiresAuth: true,
      requiresRole: 'tutee',
      input: {
        evaluationData: {
          sessionId: 'number',
          courseId: 'number',
          rating: 'number', // 1-5
          comment: 'string', // optional
          isAnonymous: 'boolean' // default: false
        }
      },
      output: {
        status: 'success',
        message: 'Session evaluation submitted successfully',
        evaluation: {
          id: 'number',
          session_id: 'number',
          rating: 'number',
          created_at: 'string'
        }
      }
    },

    getCourseEvaluations: {
      method: 'GET',
      path: '/api/session-evaluations/course/{course_id}',
      requiresAuth: true,
      requiresRole: ['tutor', 'admin'],
      pathParams: {
        course_id: 'number'
      },
      input: null,
      output: {
        status: 'success',
        course_id: 'number',
        course_title: 'string',
        total_evaluations: 'number',
        average_rating: 'number',
        evaluations: [
          {
            id: 'number',
            session_id: 'number',
            session_number: 'number',
            rating: 'number',
            comment: 'string',
            is_anonymous: 'boolean',
            created_at: 'string'
          }
        ]
      }
    }
  },

  // ==================== LIBRARY ROUTES ====================
  library: {
    getResources: {
      method: 'GET',
      path: '/api/library',
      requiresAuth: true,
      queryParams: {
        type: 'string', // optional: 'material' | 'exam'
        q: 'string' // optional: search keyword
      },
      input: null,
      output: {
        status: 'success',
        count: 'number',
        filters: {
          type: 'string | null',
          search: 'string | null'
        },
        resources: [
          {
            id: 'number',
            name: 'string',
            resource_type: 'string', // 'material' | 'exam'
            file_type: 'string', // 'pdf' | 'docx' | 'pptx' | 'xlsx'
            file_size: 'number',
            uploader_id: 'string',
            uploader_name: 'string',
            uploaded_at: 'string' // ISO datetime
          }
        ]
      }
    },

    getResourceById: {
      method: 'GET',
      path: '/api/library/{id}',
      requiresAuth: true,
      pathParams: {
        id: 'number'
      },
      input: null,
      output: {
        status: 'success',
        resource: {
          id: 'number',
          name: 'string',
          resource_type: 'string',
          file_type: 'string',
          file_size: 'number',
          uploader_id: 'string',
          uploader_name: 'string',
          uploaded_at: 'string'
        }
      }
    },

    downloadResource: {
      method: 'POST',
      path: '/api/library/download',
      requiresAuth: true,
      input: {
        id: 'number' // resource_id
      },
      output: {
        status: 'success',
        message: 'Resource ready for download',
        resource: {
          id: 'number',
          name: 'string',
          file_type: 'string',
          file_size: 'number',
          download_url: 'string'
        },
        downloaded_by: 'string', // user_id
        downloaded_at: 'string' // ISO datetime
      }
    },

    attachResource: {
      method: 'POST',
      path: '/api/library/attach',
      requiresAuth: true,
      requiresRole: 'tutor',
      input: {
        docId: 'number', // resource_id
        classId: 'number', // course_id
        tutorId: 'string' // optional
      },
      output: {
        status: 'success',
        message: 'Resource attached to course successfully',
        attachment: {
          id: 'number',
          course_id: 'number',
          course_title: 'string',
          resource_id: 'number',
          resource_name: 'string'
        }
      }
    },

    detachResource: {
      method: 'POST',
      path: '/api/library/detach',
      requiresAuth: true,
      requiresRole: 'tutor',
      input: {
        docId: 'number', // resource_id
        classId: 'number' // course_id
      },
      output: {
        status: 'success',
        message: 'Resource detached from course successfully',
        course_id: 'number',
        resource_id: 'number'
      }
    }
  },

  // ==================== NOTIFICATION ROUTES ====================
  notifications: {
    getNotifications: {
      method: 'GET',
      path: '/api/notifications',
      requiresAuth: true,
      queryParams: {
        unread_only: 'boolean' // optional, default: false
      },
      input: null,
      output: {
        status: 'success',
        user_id: 'string',
        count: 'number',
        notifications: [
          {
            id: 'number',
            type: 'string', // 'enrollment_success' | 'enrollment_cancelled' | 'schedule_change' | 'general'
            title: 'string',
            content: 'string',
            related_id: 'number | null',
            is_read: 'boolean',
            created_at: 'string' // ISO datetime
          }
        ]
      }
    },

    markAsRead: {
      method: 'POST',
      path: '/api/notifications/read',
      requiresAuth: true,
      input: {
        id: 'number', // notification_id, optional if markAll is true
        markAll: 'boolean' // optional, default: false
      },
      output: {
        // If markAll is true:
        status: 'success',
        message: 'string' // "Marked {count} notifications as read"
        // If markAll is false:
        // status: 'success',
        // message: 'Notification marked as read',
        // notification: {
        //   id: 'number',
        //   is_read: 'boolean'
        // }
      }
    }
  },

  // ==================== REPORT ROUTES (ADMIN) ====================
  reports: {
    trackAllClasses: {
      method: 'GET',
      path: '/api/tutor/tracking/classes',
      requiresAuth: true,
      requiresRole: 'admin',
      input: null,
      output: {
        status: 'success',
        total_courses: 'number',
        courses: [
          {
            id: 'number',
            title: 'string',
            tutor_id: 'string',
            status: 'string',
            level: 'string',
            max_students: 'number',
            enrolled_students: 'number',
            dropped_students: 'number',
            total_sessions: 'number',
            average_rating: 'number',
            total_evaluations: 'number',
            created_at: 'string'
          }
        ]
      }
    },

    trackSpecificClass: {
      method: 'GET',
      path: '/api/tutor/tracking/classes/{id}',
      requiresAuth: true,
      requiresRole: 'admin',
      pathParams: {
        id: 'number'
      },
      input: null,
      output: {
        status: 'success',
        course: {
          id: 'number',
          title: 'string',
          description: 'string',
          tutor_id: 'string',
          status: 'string',
          level: 'string',
          max_students: 'number',
          enrolled_count: 'number',
          created_at: 'string'
        },
        enrolled_students: [
          {
            tutee_id: 'string',
            enrollment_date: 'string',
            status: 'string'
          }
        ],
        sessions: [
          {
            id: 'number',
            session_number: 'number',
            session_date: 'string',
            start_time: 'string',
            end_time: 'string',
            format: 'string',
            location: 'string',
            evaluations_count: 'number',
            average_rating: 'number'
          }
        ]
      }
    },

    trackAllTutees: {
      method: 'GET',
      path: '/api/tutor/tracking/tutees',
      requiresAuth: true,
      requiresRole: 'admin',
      input: null,
      output: {
        status: 'success',
        total_tutees: 'number',
        tutees: [
          {
            id: 'string',
            username: 'string',
            total_enrollments: 'number',
            active_courses: 'number',
            completed_courses: 'number',
            dropped_courses: 'number'
          }
        ]
      }
    },

    trackSpecificTutee: {
      method: 'GET',
      path: '/api/tutor/tracking/tutees/{id}',
      requiresAuth: true,
      requiresRole: 'admin',
      pathParams: {
        id: 'string' // tutee_id
      },
      input: null,
      output: {
        status: 'success',
        tutee: {
          id: 'string',
          username: 'string',
          role: 'string'
        },
        total_enrollments: 'number',
        enrollments: [
          {
            enrollment_id: 'number',
            course_id: 'number',
            course_title: 'string',
            tutor_id: 'string',
            status: 'string',
            enrollment_date: 'string',
            drop_reason: 'string | null',
            evaluations_submitted: 'number'
          }
        ]
      }
    },

    createReport: {
      method: 'POST',
      path: '/api/reports',
      requiresAuth: true,
      requiresRole: 'admin',
      input: {
        reportData: {
          type: 'string', // 'course_summary' | 'enrollment_summary'
          filters: 'object' // optional
        }
      },
      output: {
        status: 'success',
        message: 'Report generated successfully',
        report: {
          type: 'string',
          generated_at: 'string',
          generated_by: 'string',
          // For course_summary:
          total_courses: 'number',
          courses_by_status: 'object', // {status: count}
          courses_by_level: 'object', // {level: count}
          // For enrollment_summary:
          total_enrollments: 'number',
          enrollments_by_status: 'object' // {status: count}
        }
      }
    }
  },

  // ==================== UTILITY ROUTES ====================
  utils: {
    healthCheck: {
      method: 'GET',
      path: '/api/health',
      input: null,
      output: {
        status: 'ok'
      }
    },

    root: {
      method: 'GET',
      path: '/api/',
      input: null,
      output: {
        message: 'Backend is up and running. Navigate to ./docs for Swagger contents'
      }
    }
  }
};

// ==================== ERROR RESPONSES ====================
const ERROR_RESPONSES = {
  400: {
    detail: 'Bad Request - Missing required fields or invalid data'
  },
  401: {
    detail: 'Unauthorized - Invalid credentials'
  },
  403: {
    detail: 'Forbidden - Insufficient permissions'
  },
  404: {
    detail: 'Not Found - Resource does not exist'
  },
  500: {
    detail: 'Internal Server Error - Server error occurred'
  }
};

// ==================== ENUMS ====================
const ENUMS = {
  UserRole: ['tutor', 'tutee', 'admin'],
  CourseStatus: ['pending', 'open', 'closed', 'cancelled'],
  Level: ['beginner', 'intermediate', 'advanced'],
  CourseFormat: ['online', 'offline'],
  EnrollmentStatus: ['enrolled', 'dropped', 'completed'],
  NotificationType: ['enrollment_success', 'enrollment_cancelled', 'schedule_change', 'general'],
  ResourceType: ['material', 'exam'],
  FileType: ['pdf', 'docx', 'pptx', 'xlsx']
};

export { API_ROUTES, ERROR_RESPONSES, ENUMS };