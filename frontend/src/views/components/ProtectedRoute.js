import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  // console.log("--- Protected Route Debug ---");
  // console.log("Current User Object:", user);
  console.log("User Role:", user?.role);
  // console.log("Allowed Roles for this route:", allowedRoles);

  // console.log(`Is auth: ${isAuthenticated}`);

  // 🕒 Chưa load xong → show spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ❌ Chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Đăng nhập rồi mà role không hợp lệ
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ OK
  return <Outlet />;
}
