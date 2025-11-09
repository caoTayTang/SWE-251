import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./views/contexts/AuthContext";
import { ProtectedRoute } from "./views/components/ProtectedRoute";
import DashboardLayout from "./views/components/DashboardLayout";

// Pages
import LoginPage from "./views/pages/LoginPage";
import HomePage from "./views/pages/HomePage";
import TutorCourseDashboard from "./views/pages/tutor/TutorCourseDashboard";
import TuteeCourseEnrollment from "./views/pages/tutee/TuteeCourseEnrollment";
import FeedbackPage from "./views/pages/shared/FeedbackPage";
import TrackingPage from "./views/pages/shared/TrackingPage";
import ReportPage from "./views/pages/shared/ReportPage";
import LibraryPage from "./views/pages/shared/LibraryPage";

import AdminDashboard from "./views/pages/admin/AdminDashboard"
import AdminEvaluations from "./views/pages/admin/AdminEvaluations"
import AdminFeedbacks from "./views/pages/admin/AdminFeedbacks"
import AdminReports from "./views/pages/admin/AdminReports"
import AdminTracking from "./views/pages/admin/AdminTracking"


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
              <Route path="/tutor/reports" element={<ReportPage />} />
            </Route>
          </Route>

          {/* 👩‍🎓 Tutee routes */}
          <Route element={<ProtectedRoute allowedRoles={["tutee"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/tutee/courses" element={<TuteeCourseEnrollment />} />
              <Route path="/tutee/library" element={<LibraryPage />} />
              <Route path="/tutee/feedback" element={<FeedbackPage />} />
            </Route>
          </Route>

        {/* 👑 Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/feedbacks" element={<AdminFeedbacks />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/evaluations" element={<AdminEvaluations />} />
            <Route path="/admin/tracking" element={<AdminTracking />} />
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
