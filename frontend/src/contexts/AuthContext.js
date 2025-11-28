import React, { createContext, useContext, useState, useEffect } from "react";
// Import hàm login từ API của chúng ta
import {
  login as apiLogin,
  me as apiMe,
  logout as apiLogout,
} from "../api/api";
const AuthContext = createContext(null);

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
    const verifySession = async () => {
      try {
        const resp = await apiMe();
        console.log(`Session verified ${resp.data}`);
        setUser(resp.data);
      } catch (err) {
        setUser(null);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  // Hàm login giờ gọi API
  const login = async (bknetId, password, selectedRole) => {
    // Không cần mock logic ở đây nữa, API lo hết rồi!
    try {
      // Gọi API login
      const response = await apiLogin(bknetId, password, selectedRole);
      console.log(`${response.data.status}`);

      const me = await apiMe();
      console.log(me.data);
      setUser(me.data);

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      //!TODO: call to logout endpoint
      const response = await apiLogout();
      console.log(response.data);
      setUser(null);
      // Có thể thêm chuyển trang về /login nếu cần
      // TODO HOW
    } catch (err) {
      setUser(null);
      console.log(err);
    }
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
