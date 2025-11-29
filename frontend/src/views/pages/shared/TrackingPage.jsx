// src/views/pages/shared/TrackingPage.js
import React, { useState, useEffect } from "react";
import {
  getTrackingClassList,
  getTrackingTuteeList,
  getTrackingClassDetails,
  getTrackingTuteeDetails,
} from "../../../api/api";
import { useAuth } from "../../../contexts/AuthContext";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const StatusBadge = ({ status }) => {
  const styles = {
    open: "bg-green-100 text-green-700 border-green-200",
    closed: "bg-red-100 text-red-700 border-red-200",
    enrolled: "bg-blue-100 text-blue-700 border-blue-200",
    dropped: "bg-gray-100 text-gray-600 border-gray-200",
  };

  // Default to gray if status not found
  const style =
    styles[status?.toLowerCase()] ||
    "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase ${style}`}
    >
      {status}
    </span>
  );
};

// --- 2. Class Detail Sub-Component ---
// Component này chuyên trách hiển thị dữ liệu Lớp học
const ClassDetailView = ({ data }) => {
  // Dữ liệu API trả về có dạng: { course: {...}, sessions: [...], enrolled_students: [...] }
  // Chúng ta destructuring an toàn để tránh crash nếu dữ liệu chưa tải xong
  const course = data?.course || {};
  const sessions = data?.sessions || [];
  const students = data?.enrolled_students || [];

  return (
    <div className="space-y-6">
      {/* Block 1: Thông tin chung (Overview) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#002855] mb-2">
              {course.title}
            </h2>
            <p className="text-gray-600">{course.description}</p>
          </div>
          <StatusBadge status={course.status} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-600 font-semibold uppercase">
              Cấp độ
            </p>
            <p className="font-bold text-gray-800 capitalize">{course.level}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl">
            <p className="text-xs text-purple-600 font-semibold uppercase">
              Ngày tạo
            </p>
            <p className="font-bold text-gray-800">
              {formatDate(course.created_at)}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-xl">
            <p className="text-xs text-orange-600 font-semibold uppercase">
              Sĩ số
            </p>
            <p className="font-bold text-gray-800">
              {course.enrolled_count || 0} / {course.max_students}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl">
            <p className="text-xs text-green-600 font-semibold uppercase">
              Số buổi
            </p>
            <p className="font-bold text-gray-800">{sessions.length} buổi</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Block 2: Danh sách buổi học (Sessions) - Chiếm 2/3 màn hình */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Lịch trình giảng dạy
          </h3>

          <div className="overflow-hidden border rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-700">#</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Ngày & Giờ
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Địa điểm
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Hình thức
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-right">
                    Đánh giá
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.length > 0 ? (
                  sessions.map((ss) => (
                    <tr
                      key={ss.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-500">
                        Buổi {ss.session_number}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">
                          {formatDate(ss.session_date)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ss.start_time.slice(0, 5)} -{" "}
                          {ss.end_time.slice(0, 5)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-gray-700">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {ss.location}
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-600">
                        {ss.format}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {ss.average_rating ? (
                          <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold border border-yellow-200">
                            ⭐ {ss.average_rating}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Chưa có
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Chưa có lịch học nào được tạo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Block 3: Danh sách học viên (Enrolled Students) - Chiếm 1/3 màn hình */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Học viên ({students.length})
          </h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {students.length > 0 ? (
              students.map((st, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      SV
                    </div>
                    <div>
                      {/* API hiện tại chưa trả về tên, tạm dùng ID */}
                      <p className="text-sm font-bold text-gray-800">
                        Tutee #{st.tutee_id}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Tham gia: {formatDate(st.enrollment_date)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={st.status} />
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                Chưa có học viên nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TrackingPage() {
  const { user } = useAuth();

  // State chính
  const [mode, setMode] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [listData, setListData] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mode || !user) return; // Chỉ chạy khi có mode và user

    const loadList = async () => {
      setLoading(true);
      setError("");
      setSelectedId(null); // Reset detail
      setDetailData(null); // Reset detail

      try {
        const apiCall =
          mode === "tutee"
            ? getTrackingTuteeList(user.id)
            : getTrackingClassList(user.id);

        const response = await apiCall;
        console.log("Fetched list data:", response.data);
        if (mode === "tutee") {
          setListData(response.data.tutees);
        } else {
          setListData(response.data.courses);
        }
      } catch (err) {
        setError("Lỗi tải danh sách.");
        console.error(err);
      }
      setLoading(false);
    };

    loadList();
  }, [mode, user]);

  useEffect(() => {
    if (!selectedId || !mode) return;

    const loadDetail = async () => {
      setLoading(true);
      setError("");
      setDetailData(null); // Reset data cũ để tránh flash

      try {
        const apiCall =
          mode === "tutee"
            ? getTrackingTuteeDetails(selectedId)
            : getTrackingClassDetails(selectedId);

        const response = await apiCall;
        console.log(`Fetched ${mode} detail:`, response.data);

        if (mode === "tutee") {
          // TODO
          setDetailData(response.data); // Logic cho tutee xử lý sau
        } else {
          // Giả định response.data có cấu trúc như bạn cung cấp
          setDetailData(response.data);
        }
      } catch (err) {
        setError("Lỗi tải chi tiết.");
        console.error(err);
      }
      setLoading(false);
    };

    loadDetail();
  }, [selectedId, mode]);

  const handleSetMode = (newMode) => {
    setLoading(true); // Set loading ngay khi bấm
    setMode(newMode);
  };

  // 1️⃣ Chưa chọn loại theo dõi
  if (!mode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-[400px] text-center">
          <h1 className="text-xl font-semibold text-[#002855] mb-4">
            Chọn loại theo dõi
          </h1>
          <p className="text-gray-600 mb-6">
            Vui lòng chọn bạn muốn theo dõi theo <b>Tutee</b> hay <b>Lớp</b>
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleSetMode("tutee")}
              className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
            >
              Theo dõi Tutee
            </button>
            <button
              onClick={() => handleSetMode("class")}
              className="bg-[#002855] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
            >
              Theo dõi Lớp
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2️⃣ Chọn danh sách Tutee / Lớp
  if (!selectedId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#002855]">
              {mode === "tutee" ? "Danh sách Tutee" : "Danh sách Lớp"}
            </h1>
            <button
              onClick={() => {
                setMode(null);
                setListData([]);
              }}
              className="text-sm text-blue-700 hover:underline"
            >
              ← Quay lại chọn loại
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 space-y-4">
          {loading && <p className="text-center">Đang tải danh sách...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!loading && !error && listData.length === 0 && (
            <p className="text-center text-gray-500">Không tìm thấy dữ liệu.</p>
          )}

          {listData.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setLoading(true);
                setSelectedId(item.id);
              }}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all duration-200 flex flex-col gap-3"
            >
              {/* 1. Header: Title & Status Badge */}
              <div className="flex justify-between items-start gap-2">
                <h2 className="text-lg font-bold text-[#002855] group-hover:text-blue-600 transition-colors line-clamp-2">
                  {item.title}
                </h2>
                <span
                  className={`flex-shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                    item.status === "open"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* 2. Info Tags (Level & Rating) */}
              <div className="flex flex-wrap gap-2 text-xs">
                {/* Level Tag */}
                <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100 font-medium capitalize">
                  {item.level}
                </div>

                {/* Rating Tag (Using emoji star to avoid importing icons) */}
                <div className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded border border-yellow-100 font-medium">
                  ⭐ {item.average_rating}{" "}
                  <span className="text-yellow-600/70">
                    ({item.total_evaluations})
                  </span>
                </div>
              </div>

              {/* 3. Footer: Student Stats */}
              <div className="mt-2 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                <div className="text-gray-600">
                  Students:{" "}
                  <span className="font-bold text-gray-900">
                    {item.enrolled_students}
                  </span>
                  <span className="text-gray-400">/{item.max_students}</span>
                </div>

                {item.dropped_students > 0 && (
                  <div className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded">
                    {item.dropped_students} dropped
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading || !detailData) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">...</div>
        <p className="text-center p-10 text-red-500">{error}</p>
      </div>
    );
  }

  // Render Main View
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedId(null)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[#002855] truncate max-w-md">
              {detailData
                ? mode === "tutee"
                  ? detailData.name
                  : detailData?.course?.title
                : "Đang tải..."}
            </h1>
          </div>

          <button
            onClick={() => setSelectedId(null)}
            className="text-sm font-medium text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Đóng chi tiết
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {detailData &&
          (mode === "tutee" ? (
            /* Placeholder cho Tutee Detail sau này */
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-bold">
                Thông tin Tutee (Đang phát triển)
              </h2>
              <pre className="mt-4 bg-gray-100 p-4 rounded text-xs overflow-auto">
                {JSON.stringify(detailData, null, 2)}
              </pre>
            </div>
          ) : (
            /* Class Detail View chính thức */
            <ClassDetailView data={detailData} />
          ))}
      </div>
    </div>
  );
}
