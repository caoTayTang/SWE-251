import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import logoBK from "../../assets/logoBK.png";
import { useAuth } from "../../contexts/AuthContext";
import { getNotifications, markNotificationsAsRead } from "../../api/api";

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
  console.log(`Unread count: ${unreadCount}`);

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
      console.log(response.data);
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
                  Theo dõi
                </Link>
                <Link
                  to="/tutor/reports"
                  className="hover:text-blue-300 transition"
                >
                  Báo cáo
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
                  to="/tutee/feedback"
                  className="hover:text-blue-300 transition"
                >
                  Feedback
                </Link>
                <Link
                  to="/tutee/library"
                  className="hover:text-blue-300 transition"
                >
                  Tài liệu
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
                  Báo cáo học thuật tổng hợp
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
                <div className="absolute right-0 mt-2 w-100 bg-white text-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transform transition-all">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-700">Thông báo</h3>
                    <span
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 font-medium cursor-pointer hover:underline"
                    >
                      Đánh dấu đã đọc
                    </span>
                  </div>

                  {/* List */}
                  <ul className="max-h-[24rem] overflow-y-auto divide-y divide-gray-100">
                    {notiLoading ? (
                      <li className="px-4 py-8 text-center text-gray-500 text-sm">
                        <div className="animate-pulse flex flex-col items-center">
                          <div className="h-2 w-24 bg-gray-200 rounded mb-2"></div>
                          <span className="text-xs">Đang tải...</span>
                        </div>
                      </li>
                    ) : notifications.length > 0 ? (
                      notifications.map((noti) => {
                        // const { text, link } = noti.content;
                        const isSession = noti.type === "session_reminder";

                        return (
                          <li
                            onClick={() => {
                              if (noti.is_read === false) {
                                handleReadOne(noti.id);
                              }
                            }}
                            key={noti.id}
                            className={`relative cursor-pointer group px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
                              !noti.is_read ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <div className="flex gap-3 items-start">
                              {/* Icon based on Type */}
                              <div
                                className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                  isSession
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {isSession ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                                    />
                                  </svg>
                                )}
                              </div>

                              {/* Content Area */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                  <p
                                    className={`text-sm truncate pr-2 ${
                                      !noti.is_read
                                        ? "font-bold text-gray-900"
                                        : "font-semibold text-gray-700"
                                    }`}
                                  >
                                    {noti.title}
                                  </p>
                                  <span className="text-[10px] text-gray-400 whitespace-nowrap pt-0.5">
                                    {formatTime(noti.created_at)}
                                  </span>
                                </div>

                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                  {noti.content}
                                </p>
                              </div>

                              {/* Unread Indicator Dot */}
                              {!noti.is_read && (
                                <span className="absolute top-4 right-4 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
                              )}
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-4 py-8 text-center flex flex-col items-center justify-center text-gray-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-10 h-10 mb-2 opacity-50"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.143 17.082a24.248 24.248 0 003.844.148m-3.844-.148a23.856 23.856 0 01-5.455-1.31 8.964 8.964 0 002.3-5.542m3.155 6.852a3 3 0 005.66 0m-5.66 0a24.249 24.249 0 014.496-1.054m4.496 1.054c.23.117.461.229.694.336a1.986 1.986 0 002.829-1.996 9.53 9.53 0 00-3.003-7.48"
                          />
                        </svg>
                        <span className="text-sm">Không có thông báo mới</span>
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
