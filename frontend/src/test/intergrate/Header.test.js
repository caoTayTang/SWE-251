// src/test/components/Header.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../../views/components/Header";
import { AuthContext } from "../../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { getNotifications } from "../../api/api";

// 1. Mock (giả mạo) toàn bộ module api.js
jest.mock("../../api/api");

describe("Header Component", () => {
  // Xóa mock sau mỗi test để tránh "rò rỉ"
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls logout function when logout button is clicked", async () => {
    // 1. Tạo một hàm "gián điệp" (spy)
    const mockLogout = jest.fn();
    const mockUser = { id: 1, role: "tutor" };

    // 2. "Dạy" API giả: khi được gọi, trả về 1 thông báo
    getNotifications.mockResolvedValue({
      data: [{ id: 1, message: "Test noti", unread: true }],
    });

    // 3. Render Header với user đã đăng nhập và hàm logout giả
    render(
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthContext.Provider
          value={{
            user: mockUser,
            isAuthenticated: true,
            logout: mockLogout,
            loading: false,
          }}
        >
          <Header />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    // 4. Chờ cho API (giả) getNotifications chạy xong
    // (Kiểm tra xem "số 1" của unreadCount có hiện không)
    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    // 5. Tìm nút "Logout" (Tiếng Anh)
    const logoutButton = screen.getByText("Đăng xuất");

    // 6. Giả lập người dùng click
    fireEvent.click(logoutButton);

    // 7. Khẳng định: hàm "gián điệp" đã được gọi đúng 1 lần
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
