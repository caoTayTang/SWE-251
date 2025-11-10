import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
// 2. Sửa các đường dẫn import
import TutorCourseDashboard from "../../views/pages/tutor/TutorCourseDashboard";
import { getMyCourses } from "../../api/api";
import { AuthContext } from "../../contexts/AuthContext";
// 3. (Quan trọng) Cần bọc component trong Router
import { BrowserRouter } from "react-router-dom";

// 4. "Giả mạo" (mock) module api (đường dẫn phải đúng)
jest.mock("../../api/api");

// Data giả
const mockCourses = [
  { id: 1, title: "Giải tích 1", description: "...", tutorId: 1 },
  { id: 2, title: "Lập trình C++", description: "...", tutorId: 1 },
];
const mockUser = { id: 1, role: "tutor" };

// Hàm "bọc" (wrapper)
const renderDashboard = () => {
  return render(
    // Bọc trong cả AuthContext giả và BrowserRouter
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {" "}
      <AuthContext.Provider value={{ user: mockUser, loading: false }}>
        <TutorCourseDashboard />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe("TutorCourseDashboard Page", () => {
  test("renders courses after API call", async () => {
    // "Dạy" API giả
    getMyCourses.mockResolvedValue({ data: mockCourses });

    renderDashboard();

    // Chờ cho API (giả) chạy xong
    await waitFor(() => {
      expect(screen.getByText("Giải tích 1")).toBeInTheDocument();
    });

    // Khẳng định
    expect(screen.getByText("Giải tích 1")).toBeInTheDocument();
    expect(screen.getByText("Lập trình C++")).toBeInTheDocument();
    expect(getMyCourses).toHaveBeenCalledTimes(1);
  });
});
