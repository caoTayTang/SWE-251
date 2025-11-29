import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Users,
  Calendar,
  Star,
  MapPin,
  Clock,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { getTrackingClassDetail } from "../../../api/api";

const DetailClassTracking = ({ classId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getTrackingClassDetail(classId);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch class detail", error);
      } finally {
        setLoading(false);
      }
    };
    if (classId) fetchDetail();
  }, [classId]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Đang tải dữ liệu lớp học...
      </div>
    );
  if (!data)
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy dữ liệu.
      </div>
    );

  const { course, enrolled_students, sessions } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
          <div className="flex gap-3 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> {course.level}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                course.status === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {course.status}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <Users className="w-5 h-5" />
            <h3 className="font-semibold">Sĩ số</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {course.enrolled_count}{" "}
            <span className="text-sm text-gray-400 font-normal">
              / {course.max_students === -1 ? "∞" : course.max_students}
            </span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-orange-600 mb-2">
            <Calendar className="w-5 h-5" />
            <h3 className="font-semibold">Tiến độ</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {sessions.length}{" "}
            <span className="text-sm text-gray-400 font-normal">buổi học</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 text-purple-600 mb-2">
            <Star className="w-5 h-5" />
            <h3 className="font-semibold">Đánh giá TB</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {/* Tính trung bình rating từ các session */}
            {console.error(`SESSION LENGTH: ${sessions}`)}
            {sessions.reduce((acc, s) => acc + s.average_rating, 0) /
              (sessions.length || 1).toFixed(1)}
            <span className="text-sm text-gray-400 font-normal"> / 5.0</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Danh sách học viên</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {enrolled_students.length > 0 ? (
              enrolled_students.map((student) => (
                <div
                  key={student.tutee_id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        ID: {student.tutee_id}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ngày vào:{" "}
                        {new Date(student.enrollment_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        student.status === "enrolled"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                Chưa có học viên nào
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sessions List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">
              Lịch trình & Đánh giá từng buổi
            </h3>
            <span className="text-xs text-gray-500">
              {sessions.length} sessions
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 text-blue-700 font-bold px-3 py-2 rounded-lg text-center min-w-[60px]">
                        <span className="block text-xs uppercase text-blue-500">
                          Buổi
                        </span>
                        <span className="text-xl">
                          {session.session_number}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-800">
                            {new Date(session.session_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {session.start_time.slice(0, 5)} -{" "}
                            {session.end_time.slice(0, 5)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {session.location} (
                            {session.format})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Đánh giá</p>
                        <div className="flex items-center gap-1 text-gray-800 font-bold">
                          {session.average_rating > 0
                            ? session.average_rating
                            : "-"}{" "}
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-1">Số lượt</p>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-sm font-medium">
                          {session.evaluations_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-400">
                Chưa có buổi học nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailClassTracking;
