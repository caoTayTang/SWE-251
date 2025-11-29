import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Search,
  Filter,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { getTrackingClasses, getTrackingTutees } from "../../../api/api";
import DetailClassTracking from "./DetailClassTracking";
import DetailTuteeTracking from "./DetailTuteeTracking";

const AdminTracking = () => {
  // Tabs State: 'classes' | 'tutees'
  const [activeTab, setActiveTab] = useState("classes");

  // Data State
  const [classesList, setClassesList] = useState([]);
  const [tuteesList, setTuteesList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Selection State (Để chuyển view sang Detail)
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedTuteeId, setSelectedTuteeId] = useState(null);

  // Fetch Data khi chuyển Tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "classes") {
          const res = await getTrackingClasses();
          setClassesList(res.data?.courses || []);
        } else {
          const res = await getTrackingTutees();
          setTuteesList(res.data?.tutees || []);
        }
      } catch (error) {
        console.error("Failed to fetch tracking data", error);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ fetch khi đang ở màn hình list (không phải detail)
    if (!selectedClassId && !selectedTuteeId) {
      fetchData();
    }
  }, [activeTab, selectedClassId, selectedTuteeId]);

  // --- RENDER CONDITIONAL VIEWS ---

  // 1. View Detail Class
  if (selectedClassId) {
    return (
      <DetailClassTracking
        classId={selectedClassId}
        onBack={() => setSelectedClassId(null)}
      />
    );
  }

  // 2. View Detail Tutee
  if (selectedTuteeId) {
    return (
      <DetailTuteeTracking
        tuteeId={selectedTuteeId}
        onBack={() => setSelectedTuteeId(null)}
      />
    );
  }

  // 3. View Main Dashboard (Lists)
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics & Tracking
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Theo dõi hiệu quả lớp học và tiến độ học viên
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("classes")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "classes"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Classes
          </button>
          <button
            onClick={() => setActiveTab("tutees")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "tutees"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="w-4 h-4" /> Tutees
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          {activeTab === "classes" ? (
            <ClassesListView data={classesList} onSelect={setSelectedClassId} />
          ) : (
            <TuteesListView data={tuteesList} onSelect={setSelectedTuteeId} />
          )}
        </>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS FOR LISTS ---

const ClassesListView = ({ data, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">
          Danh sách khóa học ({data.length})
        </h3>
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm khóa học..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 font-medium pl-6">Tên khóa học</th>
              <th className="p-4 font-medium">Cấp độ</th>
              <th className="p-4 font-medium">Học viên</th>
              <th className="p-4 font-medium text-center">Sessions</th>
              <th className="p-4 font-medium text-center">Rating</th>
              <th className="p-4 font-medium text-right pr-6">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
              >
                <td className="p-4 pl-6 font-medium text-gray-900 group-hover:text-blue-600">
                  {item.title}
                  <div className="text-xs text-gray-400 font-normal mt-0.5">
                    ID: {item.id}
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold uppercase">
                    {item.level}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-full max-w-[80px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            (item.enrolled_students /
                              (item.max_students === -1
                                ? 100
                                : item.max_students)) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {item.enrolled_students}/
                      {item.max_students === -1 ? "∞" : item.max_students}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center text-gray-600">
                  {item.total_sessions}
                </td>
                <td className="p-4 text-center font-bold text-gray-800">
                  {item.average_rating > 0
                    ? item.average_rating.toFixed(1)
                    : "-"}
                </td>
                <td className="p-4 pr-6 text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      item.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TuteesListView = ({ data, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800">
          Danh sách học viên ({data.length})
        </h3>
        <div className="relative w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm học viên..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 text-gray-500 text-sm">
            <tr>
              <th className="p-4 font-medium pl-6">Học viên</th>
              <th className="p-4 font-medium text-center">Tổng khóa học</th>
              <th className="p-4 font-medium text-center">Đang học</th>
              <th className="p-4 font-medium text-center">Hoàn thành</th>
              <th className="p-4 font-medium text-center">Đã hủy</th>
              <th className="p-4 text-right pr-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
              >
                <td className="p-4 pl-6 font-medium text-gray-900 group-hover:text-blue-600">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      {item.name}
                      <div className="text-xs text-gray-400 font-normal mt-0.5">
                        ID: {item.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center font-bold text-gray-700">
                  {item.total_enrollments}
                </td>
                <td className="p-4 text-center">
                  {item.active_courses > 0 ? (
                    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">
                      <TrendingUp className="w-3 h-3" /> {item.active_courses}
                    </span>
                  ) : (
                    "0"
                  )}
                </td>
                <td className="p-4 text-center">
                  {item.completed_courses > 0 ? (
                    <span className="text-blue-600 font-bold">
                      {item.completed_courses}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-4 text-center">
                  {item.dropped_courses > 0 ? (
                    <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-bold">
                      <AlertTriangle className="w-3 h-3" />{" "}
                      {item.dropped_courses}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-4 pr-6 text-right text-gray-400 group-hover:text-blue-500">
                  <ChevronRight className="w-5 h-5 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTracking;
