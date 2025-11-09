import React, {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import logoBK from "../../assets/logoBK.png";


export default function Header({ role }) {
  const [showNoti, setShowNoti] = useState(false);
  // Mock notifications
  const notifications = [
    { id: 1, message: "Khóa học Giải tích 1 sắp bắt đầu", time: "2 giờ trước" },
    { id: 2, message: "Bạn đã được thêm vào lớp Lập trình C++", time: "1 ngày trước" },
    { id: 3, message: "Báo cáo tuần của bạn đã sẵn sàng", time: "3 ngày trước" },
  ];

  return (
    <header className="bg-[#002855] text-white py-3 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Trường */}
        <div className="flex items-center gap-3">
          <img src={logoBK} alt="BK Logo" className="w-10 h-10 rounded-lg bg-white p-1" />
          <div>
            <div className="text-xs font-light uppercase">Đại học Quốc gia TP. HCM</div>
            <div className="text-sm font-semibold tracking-wide">
              Trường Đại học Bách Khoa
            </div>
          </div>
        </div>

        {/* Middle: Dynamic Role Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-blue-300 transition">Trang chủ</Link>

          {role === "tutor" && (
            <>
              <Link to="/tutor/courses" className="hover:text-blue-300 transition">Khóa học</Link>
              <Link to="/tutor/tracking" className="hover:text-blue-300 transition">Theo dõi</Link>
              <Link to="/tutor/reports" className="hover:text-blue-300 transition">Báo cáo</Link>            
            </>
          )}

          {role === "tutee" && (
            <>
              <Link to="/tutee/courses" className="hover:text-blue-300 transition">Khóa học</Link>
              <Link to="/tutee/feedback" className="hover:text-blue-300 transition">Feedback</Link>
              <Link to="/tutee/library" className="hover:text-blue-300 transition">Tài liệu</Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin/dashboard" className="hover:text-blue-300 transition">Tổng quan</Link>
              <Link to="/admin/feedbacks" className="hover:text-blue-300 transition">Phản hồi</Link>
              <Link to="/admin/evaluations" className="hover:text-blue-300 transition">Đánh giá</Link>
              <Link to="/admin/tracking" className="hover:text-blue-300 transition">Theo dõi tiến độ</Link>
              <Link to="/admin/reports" className="hover:text-blue-300 transition">Báo cáo tổng hợp</Link>
            </>
          )}

          {/* Notification */}
          <div className="relative">
            <button
              onClick={() => setShowNoti(!showNoti)}
              className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNoti && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b font-semibold">Thông báo</div>
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.map(noti => (
                    <li key={noti.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                      <p>{noti.message}</p>
                      <span className="text-gray-500 text-xs">{noti.time}</span>
                    </li>
                  ))}
                  {notifications.length === 0 && (
                    <li className="px-3 py-2 text-gray-500 text-sm">Không có thông báo nào</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {/*Logout*/}
          <button
            onClick={{}}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm transition-colors"
          >
            Đăng xuất
          </button>
        </nav>

      </div>
    </header>
  );
}
