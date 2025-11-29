import React, { useRef, useEffect } from "react";
import { Bell, Check, Clock } from "lucide-react";
import { useNotification } from "../../../contexts/NotificationContext";

const HeaderNotification = () => {
  // 1. Lấy dữ liệu và hàm từ Context thay vì tự khai báo state
  const {
    notifications,
    unreadCount,
    handleMarkAsRead,
    isOpen: showNoti, // Đổi tên biến cho khớp code cũ của ông
    setIsOpen: setShowNoti,
  } = useNotification();

  const dropdownRef = useRef(null);

  // 2. Xử lý click ra ngoài để đóng dropdown (Logic giữ nguyên)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNoti(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowNoti]);

  // Helper format thời gian
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- Nút Chuông --- */}
      <button
        onClick={() => setShowNoti(!showNoti)}
        className="relative p-2 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* --- Dropdown --- */}
      {showNoti && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white text-gray-800 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden transform transition-all origin-top-right animate-fade-in">
          {/* Header Dropdown */}
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-sm">
            <h3 className="font-bold text-gray-700">Thông báo</h3>
            {unreadCount > 0 && (
              <span
                onClick={() => handleMarkAsRead(null)} // Gọi hàm từ Context
                className="text-xs text-blue-600 font-medium cursor-pointer hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Đánh dấu đã đọc
              </span>
            )}
          </div>

          {/* List Thông báo */}
          <ul className="max-h-[24rem] overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((noti) => {
                // Logic xác định icon (giữ nguyên idea của ông)
                const isSession =
                  noti.type === "SCHEDULE_CHANGE" ||
                  noti.type === "session_reminder";
                const isSystem = noti.type === "SYSTEM";

                return (
                  <li
                    key={noti.id}
                    onClick={() => {
                      if (!noti.is_read) handleMarkAsRead(noti.id);
                    }}
                    className={`relative cursor-pointer group px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex gap-3 items-start ${
                      !noti.is_read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {/* Icon Tròn */}
                    <div
                      className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isSession
                          ? "bg-blue-100 text-blue-600"
                          : isSystem
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {isSession ? (
                        <Clock className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>

                    {/* Nội dung Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <p
                          className={`text-sm truncate pr-2 ${
                            !noti.is_read
                              ? "font-bold text-gray-900"
                              : "font-medium text-gray-700"
                          }`}
                        >
                          {noti.title}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap pt-0.5">
                          {formatTime(noti.created_at)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {noti.content}
                      </p>
                    </div>

                    {/* Chấm xanh chưa đọc */}
                    {!noti.is_read && (
                      <span className="absolute top-4 right-4 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
                    )}
                  </li>
                );
              })
            ) : (
              // Empty State
              <li className="px-4 py-8 text-center flex flex-col items-center justify-center text-gray-400">
                <Bell className="w-10 h-10 mb-2 opacity-20" />
                <span className="text-sm">Không có thông báo mới</span>
              </li>
            )}
          </ul>

          {/* Footer xem tất cả */}
          <div className="p-2 border-t border-gray-100 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition">
            <span className="text-xs font-medium text-gray-600">
              Xem tất cả lịch sử
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderNotification;
