import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background */}
      <img
        src={require("../../assets/slbk.jpg")}
        alt="background"
        className="absolute inset-0 w-full h-full object-contain -z-10"
      />
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] -z-10" />

      {/* Header */}
      <Header role="guest" />

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-[#002855] drop-shadow-sm">
          HCMUT Tutor Support System
        </h1>
        <p className="text-gray-700 mt-4 max-w-2xl">
          Nền tảng kết nối, hỗ trợ học tập giữa sinh viên – nơi bạn có thể trở thành
          Tutor hoặc tìm người đồng hành trong học tập.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-[#002855] text-white rounded-xl shadow hover:bg-blue-900 transition-all"
          >
            Đăng nhập / Bắt đầu
          </Link>
          <a
            href="https://hcmut.edu.vn"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 border border-gray-400 bg-gray-50 rounded-xl hover:bg-gray-200 transition-all"
          >
            Trang chủ BK
          </a>
        </div>

      </main>

      <footer className="text-center text-gray-500 text-sm py-4 border-t bg-white/70">
        © 2025 HCMUT Tutor System
      </footer>
    </div>
  );
}
