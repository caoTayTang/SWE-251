import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./views/components/ProtectedRoute";
import DashboardLayout from "./views/components/DashboardLayout";

// Pages
import LoginPage from "./views/pages/LoginPage";
import HomePage from "./views/pages/HomePage";
import TutorCourseDashboard from "./views/pages/tutor/TutorCourseDashboard";
import CreateMeetingNotePage from "./views/pages/tutor/CreateMeetingNotePage";
import TuteeCourseEnrollment from "./views/pages/tutee/TuteeCourseEnrollment";
import FeedbackPage from "./views/pages/shared/FeedbackPage";
import TrackingPage from "./views/pages/shared/TrackingPage";
import LibraryPage from "./views/pages/shared/LibraryPage";

import AdminDashboard from "./views/pages/admin/AdminDashboard";
import AdminFeedbacks from "./views/pages/admin/AdminFeedbacks";
import AdminMeetingNote from "./views/pages/admin/AdminMeetingNote";
import AdminTracking from "./views/pages/admin/AdminTracking";
import AdminAcademicReportPage from "./views/pages/admin/AdminAcademicReportPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🌐 Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* 👨‍🏫 Tutor routes */}
          <Route element={<ProtectedRoute allowedRoles={["tutor"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/tutor/courses" element={<TutorCourseDashboard />} />
              <Route path="/tutor/tracking" element={<TrackingPage />} />
              <Route path="/tutor/feedback" element={<FeedbackPage />} />
              <Route
                path="/tutor/create-note"
                element={<CreateMeetingNotePage />}
              />
            </Route>
          </Route>

          {/* 👩‍🎓 Tutee routes */}
          <Route element={<ProtectedRoute allowedRoles={["tutee"]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                path="/tutee/courses"
                element={<TuteeCourseEnrollment />}
              />
              <Route path="/tutee/library" element={<LibraryPage />} />
              <Route path="/tutee/feedback" element={<FeedbackPage />} />
            </Route>
          </Route>

          {/* 👑 Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
              <Route
                path="/admin/meeting-note"
                element={<AdminMeetingNote />}
              />
              <Route path="/admin/tracking" element={<AdminTracking />} />
              <Route
                path="/admin/evaluate-session"
                element={<AdminAcademicReportPage />}
              />
            </Route>
          </Route>

          {/* 🏠 Default redirect */}
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
