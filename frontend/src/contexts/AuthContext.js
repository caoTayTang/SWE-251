import React, { createContext, useContext, useState, useEffect } from "react";
// Import hàm login từ API của chúng ta
import { login as apiLogin } from "../api/api";

export const AuthContext = createContext(null);

export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading lúc khởi tạo app

  // Khi app mount, check localStorage để "tự động login" nếu F5
  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // Trong thực tế, bạn có thể gọi API /me để verify token ở đây
          // Nhưng với mock, ta cứ tin tưởng localStorage tạm
          setUser(JSON.parse(storedUser));
        } catch (e) {
          // Nếu JSON lỗi, xóa hết cho an toàn
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Hàm login giờ gọi API
  const login = async (bknetId, password, selectedRole) => {
    // Không cần mock logic ở đây nữa, API lo hết rồi!
    try {
      // Gọi API login
      const response = await apiLogin(bknetId, password, selectedRole);
      const { user: userData, token } = response.data;

      // Lưu vào storage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Cập nhật state
      setUser(userData);

      return { success: true }; // Trả về thành công cho Login Page biết
    } catch (error) {
      // Ném lỗi ra để Login Page bắt (catch) và hiển thị
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    // Có thể thêm chuyển trang về /login nếu cần
  };

  // Giá trị context
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Chỉ render children khi đã check xong loading ban đầu */}
      {!loading && children}
    </AuthContext.Provider>
  );
}
