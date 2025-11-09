import React, { createContext, useContext, useState, useEffect } from "react";

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

// 🔹 Mock database
const MOCK_USERS = {
  tutor1: {
    id: 1,
    bknetId: "tutor1",
    password: "password123",
    name: "Nguyễn Văn A",
    email: "nguyenvana@hcmut.edu.vn",
    role: "tutor",
  },
  tutee1: {
    id: 101,
    bknetId: "tutee1",
    password: "password123",
    name: "Lê Văn C",
    email: "levanc@hcmut.edu.vn",
    role: "tutee",
  },
  admin: {
    id: 999,
    bknetId: "admin",
    password: "admin123",
    name: "Admin HCMUT",
    email: "admin@hcmut.edu.vn",
    role: "admin",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khi app mount, check localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 🧠 Mock login logic
  const login = async (bknetId, password, selectedRole) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userAccount = MOCK_USERS[bknetId.toLowerCase()];

    if (!userAccount || userAccount.password !== password) {
      throw new Error("Sai BKNetID hoặc mật khẩu");
    }

    if (userAccount.role !== selectedRole) {
      throw new Error(`Tài khoản này không phải là ${selectedRole}`);
    }

    const token = `mock_token_${userAccount.id}_${Date.now()}`;
    localStorage.setItem("user", JSON.stringify(userAccount));
    localStorage.setItem("authToken", token);

    setUser(userAccount);
    return { success: true, user: userAccount };
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
