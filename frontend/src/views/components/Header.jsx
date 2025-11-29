import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import logoBK from "../../assets/logoBK.png";
import { useAuth } from "../../contexts/AuthContext";
import { getNotifications, markNotificationsAsRead } from "../../api/api";
import HeaderNotification from "../../views/pages/shared/HeaderNotification.jsx";

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
          fetchNotifications();
        } catch (err) {
          console.error("Lỗi tải thông báo:", err);
        }
        setNotiLoading(false);
      };

      loadNotifications();
    }
  }, [isAuthenticated]); // Phụ thuộc vào "isAuthenticated"

  const role = user ? user.role : "guest";
  const unreadCount = notifications.filter(
    (each) => each.is_read === false
  ).length;
  // console.log(`Unread count: ${unreadCount}`);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "numeric",
    }).format(date);
  };

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications();
      // console.log(response.data);
      setNotifications(response.data.notifications);
    } catch (err) {
      throw err;
    }
  };

  const handleMarkAllRead = async () => {
    try {
      // Gọi hàm không truyền tham số -> backend nhận { markAll: true }
      await markNotificationsAsRead();

      // Refresh lại list hoặc update state local để tất cả về is_read: true
      fetchNotifications();
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả:", error);
    }
  };

  const handleReadOne = async (notificationId) => {
    try {
      console.log("id ne", notificationId);
      await markNotificationsAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu 1 cái:", error);
    }
  };

  return (
    <header className="bg-[#002855] text-white py-3 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Trường */}
        <div className="flex items-center gap-3">
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
        </div>

        {/* Middle: Dynamic Role Menu (Chỉ hiện khi đã đăng nhập) */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {/* <Link to="/" className="hover:text-blue-300 transition">
              Trang chủ
            </Link> */}
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
                  Theo dõi học tập
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
            {/* {console.error(`ROLE CUA M LA ${role}`)} */}
            {role === "admin" && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-blue-300 transition"
                >
                  Tổng quan
                </Link>
                <Link
                  to="/admin/tracking"
                  className="hover:text-blue-300 transition"
                >
                  {/* Tracking tutee + tutor */}
                  Tracking
                </Link>
                {/* 
                <Link
                  to="/admin/meeting-note"
                  className="hover:text-blue-300 transition"
                >
                  Duyệt Meeting Notes
                </Link> */}

                {/* 
                <Link
                  to="/admin/evaluate-session"
                  className="hover:text-blue-300 transition"
                >
                  Báo cáo học thuật tổng hợp
                </Link> */}
                {/* 
                <Link
                  to="/admin/feedbacks"
                  className="hover:text-blue-300 transition"
                >
                  Feedback hệ thống
                </Link> */}
              </>
            )}
            {/* Notification */}
            <HeaderNotification />
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
