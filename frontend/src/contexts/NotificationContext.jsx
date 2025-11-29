import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { getNotifications, markNotificationsAsRead } from "../api/api"; // Import từ file api của bạn
import { useUser } from "./AuthContext"; // Giả sử bạn có AuthContext để lấy userId

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const user = useUser();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở dropdown
  const ws = useRef(null);

  // 1. Lấy danh sách thông báo ban đầu (Lịch sử)
  const fetchHistory = async () => {
    try {
      const res = await getNotifications();
      // Giả sử API trả về { data: [...] } hoặc { notifications: [...] }
      const list = res.data?.notifications || res.data || [];
      setNotifications(list);
      // Đếm số lượng chưa đọc (giả sử có trường is_read)
      const unread = list.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // 2. Kết nối WebSocket
  useEffect(() => {
    console.log(user);
    console.log(`Setting up WebSocket for notifications ${user?.user_id}`);
    if (!user?.user_id) return;

    fetchHistory(); // Lấy dữ liệu cũ trước

    // Khởi tạo WebSocket
    // Lưu ý: Đảm bảo URL chính xác (ws vs wss, port)
    ws.current = new WebSocket(
      `ws://127.0.0.1:8000/api/ws/notifications/${user.user_id}`
    );

    ws.current.onopen = () => {
      console.log("🟢 Connected to Notification Service");
    };

    ws.current.onmessage = (event) => {
      console.info("WS Message Received:", event.data);
      try {
        const message = JSON.parse(event.data);

        if (message.type === "NEW_NOTIFICATION") {
          const newNotif = message.data;

          // Cập nhật State: Thêm mới vào đầu danh sách
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Tùy chọn: Phát âm thanh hoặc hiện Toast
          // new Audio('/notification-sound.mp3').play().catch(() => {});
        }
      } catch (err) {
        console.error("WS Message Error:", err);
      }
    };

    ws.current.onclose = () => {
      console.log("🔴 Disconnected from Notification Service");
    };

    // Cleanup khi unmount hoặc user logout
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [user?.user_id]);

  // 3. Hàm xử lý: Đánh dấu đã đọc
  const handleMarkAsRead = async (notiId = null) => {
    try {
      await markNotificationsAsRead(notiId);

      if (notiId) {
        // Cập nhật UI cục bộ cho 1 item
        setNotifications((prev) =>
          prev.map((n) => (n.id === notiId ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        // Mark all
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        handleMarkAsRead,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
