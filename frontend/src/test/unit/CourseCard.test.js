// src/test/components/CourseCard.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import CourseCard from "../../views/components/Course/CourseCard";
import { BrowserRouter } from "react-router-dom";

// Giả mạo (mock) component "con" (MeetingNoteButton)
// để test này không bị phụ thuộc vào nó
jest.mock("../../views/components/Course/MeetingNoteButton", () => {
  // Đây là 1 "component giả" chỉ render 1 nút
  return () => <button>Create Note</button>;
});

// Data mock (Tiếng Anh)
const mockCourse = {
  id: 1,
  title: "Test Course",
  description: "This is a test course.",
  status: "active",
};

describe("CourseCard Component Logic", () => {
  test("Tutor sees admin buttons (Edit, Delete, Create Note)", () => {
    // Render với isTutor = true
    render(
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <CourseCard course={mockCourse} isTutor={true} />
      </BrowserRouter>
    );

    // Khẳng định là thấy 3 nút
    expect(screen.getByText("Sửa")).toBeInTheDocument();
    expect(screen.getByText("Xóa")).toBeInTheDocument();
    expect(screen.getByText("Create Note")).toBeInTheDocument();
  });

  test("Tutee does NOT see admin buttons", () => {
    // Render với isTutor = false
    render(
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <CourseCard course={mockCourse} isTutor={false} />
      </BrowserRouter>
    );

    // Khẳng định là KHÔNG thấy 3 nút
    // Dùng queryByText (trả về null nếu không thấy)
    expect(screen.queryByText("Sửa")).not.toBeInTheDocument();
    expect(screen.queryByText("Xóa")).not.toBeInTheDocument();
    expect(screen.queryByText("Create Note")).not.toBeInTheDocument();
  });
});
