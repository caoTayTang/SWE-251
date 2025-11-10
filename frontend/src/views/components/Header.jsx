import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import logoBK from "../../assets/logoBK.png";
import { useAuth } from "../../contexts/AuthContext";
import { getNotifications } from "../../api/api";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showNoti, setShowNoti] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notiLoading, setNotiLoading] = useState(false);

  useEffect(() => {
    // Chỉ fetch khi đã đăng nhập
    if (isAuthenticated) {
      const loadNotifications = async () => {
        setNotiLoading(true);
        try {
          const response = await getNotifications();
          setNotifications(response.data);
        } catch (err) {
          console.error("Lỗi tải thông báo:", err);
        }
        setNotiLoading(false);
      };

      loadNotifications();
    }
  }, [isAuthenticated]); // Phụ thuộc vào "isAuthenticated"

  const role = user ? user.role : "guest";
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="bg-[#002855] text-white py-3 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Trường */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoBK}
              alt="BK Logo"
              className="w-10 h-10 rounded-lg bg-white p-1"
            />
            <div>
              <div className="text-xs font-light uppercase">
                Đại học Quốc gia TP. HCM
              </div>
              <div className="text-sm font-semibold tracking-wide">
                Trường Đại học Bách Khoa
              </div>
            </div>
          </Link>
        </div>

        {/* Middle: Dynamic Role Menu (Chỉ hiện khi đã đăng nhập) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {role === "tutor" && (
              <>
                <Link
                  to="/tutor/courses"
                  className="hover:text-blue-300 transition"
                >
                  Khóa học
                </Link>
                <Link
                  to="/tutor/tracking"
                  className="hover:text-blue-300 transition"
                >
                  Theo dõi Tutee
                </Link>
                <Link
                  to="/tutor/feedback"
                  className="hover:text-blue-300 transition"
                >
                  Feedback
                </Link>
              </>
            )}

            {role === "tutee" && (
              <>
                <Link
                  to="/tutee/courses"
                  className="hover:text-blue-300 transition"
                >
                  Khóa học
                </Link>
                <Link
                  to="/tutee/library"
                  className="hover:text-blue-300 transition"
                >
                  Tài liệu
                </Link>
                <Link
                  to="/tutee/feedback"
                  className="hover:text-blue-300 transition"
                >
                  Feedback
                </Link>
              </>
            )}

            {role === "admin" && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-blue-300 transition"
                >
                  Tổng quan
                </Link>
                <Link
                  to="/admin/meeting-note"
                  className="hover:text-blue-300 transition"
                >
                  Duyệt Meeting Notes
                </Link>
                <Link
                  to="/admin/tracking"
                  className="hover:text-blue-300 transition"
                >
                  Theo dõi học tập
                </Link>
                <Link
                  to="/admin/evaluate-session"
                  className="hover:text-blue-300 transition"
                >
                  Báo cáo học thuật
                </Link>
                <Link
                  to="/admin/feedbacks"
                  className="hover:text-blue-300 transition"
                >
                  Feedback hệ thống
                </Link>
              </>
            )}

            {/* Notification */}
            <div className="relative">
              <button
                onClick={() => setShowNoti(!showNoti)}
                className="relative p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && ( // Chỉ hiện khi có thông báo chưa đọc
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNoti && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="p-3 border-b font-semibold">Thông báo</div>
                  <ul className="max-h-60 overflow-y-auto">
                    {notiLoading ? (
                      <li className="px-3 py-2 text-gray-500 text-sm">
                        Đang tải...
                      </li>
                    ) : notifications.length > 0 ? (
                      notifications.map((noti) => (
                        <li
                          key={noti.id}
                          className={`px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm ${noti.unread ? "font-bold" : ""}`}
                        >
                          <p>{noti.message}</p>
                          <span className="text-gray-500 text-xs font-normal">
                            {noti.time}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="px-3 py-2 text-gray-500 text-sm">
                        Không có thông báo nào
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={logout} // 8. GẮN HÀM LOGOUT
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm transition-colors"
            >
              Đăng xuất
            </button>
          </nav>
        )}

        {/* 9. Nếu là 'guest' (chưa đăng nhập, như ở LoginPage) thì không hiện gì */}
        {role === "guest" && <div>{/* (Empty, or a "Login" button) */}</div>}
      </div>
    </header>
  );
}
