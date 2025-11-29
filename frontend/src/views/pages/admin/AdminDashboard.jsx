import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  FileText,
  Download,
  PieChart,
  BarChart2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../../components/cards/StatCard";
// import OverviewChart from "../../components/charts/OverviewChart"; // Không dùng component cũ nữa
import { getSystemReport } from "../../../api/api";

// Icon mapping cho các loại thống kê mới
const iconMap = {
  "Tổng khóa học": <BookOpen className="w-6 h-6 text-blue-600" />,
  "Tổng lượt đăng ký": <Users className="w-6 h-6 text-green-600" />,
  "Khóa học đang mở": <TrendingUp className="w-6 h-6 text-yellow-600" />,
  "Trạng thái Enroll": <PieChart className="w-6 h-6 text-purple-600" />,
};

export default function AdminDashboard() {
  const [reportData, setReportData] = useState({
    courseSummary: null,
    enrollmentSummary: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRealData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Gọi song song 2 báo cáo
        const [courseRes, enrollmentRes] = await Promise.all([
          getSystemReport("course_summary"),
          getSystemReport("enrollment_summary"),
        ]);

        setReportData({
          courseSummary: courseRes.data?.report,
          enrollmentSummary: enrollmentRes.data?.report,
        });
      } catch (err) {
        console.error("Lỗi tải báo cáo:", err);
        setError("Không thể kết nối đến server báo cáo.");
      } finally {
        setLoading(false);
      }
    };

    loadRealData();
  }, []);

  // --- XỬ LÝ DỮ LIỆU HIỂN THỊ ---

  // 1. Stats Cards Data
  const stats = [
    {
      id: 1,
      title: "Tổng khóa học",
      value: reportData.courseSummary?.total_courses || 0,
      icon: iconMap["Tổng khóa học"],
    },
    {
      id: 2,
      title: "Khóa học đang mở",
      value: reportData.courseSummary?.courses_by_status?.["open"] || 0,
      icon: iconMap["Khóa học đang mở"],
    },
    {
      id: 3,
      title: "Tổng lượt đăng ký",
      value: reportData.enrollmentSummary?.total_enrollments || 0,
      icon: iconMap["Tổng lượt đăng ký"],
    },
    {
      id: 4,
      title: "Đang học (Enrolled)",
      value:
        reportData.enrollmentSummary?.enrollments_by_status?.["enrolled"] || 0,
      icon: iconMap["Trạng thái Enroll"],
    },
  ];

  // 2. Chart Data: Biểu đồ phân bố trạng thái khóa học
  // Chuyển đổi object { "open": 5, "closed": 2 } thành mảng [{name: "open", value: 5}, ...]
  const chartData = reportData.courseSummary?.courses_by_status
    ? Object.entries(reportData.courseSummary.courses_by_status).map(
        ([key, value]) => ({
          name: key.toUpperCase(),
          value: value,
        })
      )
    : [];

  // --- CHỨC NĂNG EXPORT PDF (PRINT) ---
  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="text-red-500 font-bold mb-2">Lỗi hệ thống</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 print:bg-white print:p-0">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin — Bảng điều khiển
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          Xuất báo cáo PDF
        </button>
      </div>

      {/* SECTION BÁO CÁO ĐỂ IN */}
      <div id="report-content" className="space-y-8">
        {/* Title khi in */}
        <div className="hidden print:block mb-8 text-center border-b pb-4">
          <h1 className="text-3xl font-bold">BÁO CÁO HỆ THỐNG</h1>
          <p className="text-gray-500">
            Ngày xuất: {new Date().toLocaleString("vi-VN")}
          </p>
          <p className="text-gray-500">
            Người xuất: {reportData.courseSummary?.generated_by || "Admin"}
          </p>
        </div>

        {/* 1. STAT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <StatCard
              key={s.id}
              title={s.title}
              value={s.value}
              icon={s.icon}
            />
          ))}
        </div>

        {/* 2. CHARTS & DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart: Course Status Distribution */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              Phân bố trạng thái khóa học
            </h3>

            {/* FIX: Thêm style explicit và dùng ResponsiveContainer trực tiếp */}
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="Số lượng"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>

              {chartData.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-white/50">
                  Chưa có dữ liệu
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600 print:hidden">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="block font-semibold text-gray-900 mb-1">
                  Level Phổ biến
                </span>
                {/* Logic tìm level phổ biến nhất */}
                {(reportData.courseSummary?.courses_by_level &&
                  Object.entries(reportData.courseSummary.courses_by_level)
                    .sort(([, a], [, b]) => b - a)[0]?.[0]
                    ?.toUpperCase()) ||
                  "N/A"}
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="block font-semibold text-gray-900 mb-1">
                  Tỷ lệ Active
                </span>
                {/* Tính tỷ lệ khóa học Open */}
                {reportData.courseSummary?.total_courses
                  ? Math.round(
                      ((reportData.courseSummary.courses_by_status?.["open"] ||
                        0) /
                        reportData.courseSummary.total_courses) *
                        100
                    )
                  : 0}
                %
              </div>
            </div>
          </div>

          {/* Side Stats: Enrollment Details */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:shadow-none print:border">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Chi tiết đăng ký
            </h3>

            <div className="space-y-6">
              {/* Enrollment Breakdown */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                  Theo trạng thái
                </p>
                <ul className="space-y-3">
                  {reportData.enrollmentSummary?.enrollments_by_status &&
                    Object.entries(
                      reportData.enrollmentSummary.enrollments_by_status
                    ).map(([status, count]) => (
                      <li
                        key={status}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="capitalize text-gray-600 flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              status === "enrolled"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {status}
                        </span>
                        <span className="font-bold text-gray-900">{count}</span>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Course Level Breakdown (Từ dữ liệu course_summary) */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                  Theo trình độ khóa học
                </p>
                <div className="flex flex-wrap gap-2">
                  {reportData.courseSummary?.courses_by_level &&
                    Object.entries(
                      reportData.courseSummary.courses_by_level
                    ).map(([level, count]) => (
                      <div
                        key={level}
                        className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium border border-gray-100"
                      >
                        {level.toUpperCase()}:{" "}
                        <span className="font-bold text-blue-600">{count}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-4 mt-auto text-xs text-gray-400 italic text-center">
                Dữ liệu được trích xuất thời gian thực
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS cho Print (Ẩn các phần thừa khi in) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #report-content, #report-content * {
            visibility: visible;
          }
          #report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Ẩn nút scroll, sidebar nếu có */
          ::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  );
}
