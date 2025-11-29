import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { getTrackingTuteeDetail } from "../../../api/api";

const DetailTuteeTracking = ({ tuteeId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getTrackingTuteeDetail(tuteeId);
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch tutee detail", error);
      } finally {
        setLoading(false);
      }
    };
    if (tuteeId) fetchDetail();
  }, [tuteeId]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">
        Đang tải hồ sơ học viên...
      </div>
    );
  if (!data)
    return (
      <div className="p-8 text-center text-red-500">
        Không tìm thấy dữ liệu.
      </div>
    );

  const { tutee, enrollments, total_enrollments } = data;

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
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            {tutee.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            ID: {tutee.id} • Role: {tutee.role}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase">
            Tổng khóa học đã tham gia
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {total_enrollments}
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      {/* Enrollments History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Lịch sử đăng ký khóa học</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Khóa học</th>
                <th className="p-4 font-medium">Giảng viên ID</th>
                <th className="p-4 font-medium">Ngày đăng ký</th>
                <th className="p-4 font-medium text-center">Đánh giá đã gửi</th>
                <th className="p-4 font-medium text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {enrollments.length > 0 ? (
                enrollments.map((item) => (
                  <tr
                    key={item.enrollment_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {item.course_title}
                      <div className="text-xs text-gray-400 font-normal mt-0.5">
                        ID: {item.course_id}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{item.tutor_id}</td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {new Date(item.enrollment_date).toLocaleDateString(
                          "vi-VN"
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
                        <FileText className="w-3 h-3" />{" "}
                        {item.evaluations_submitted}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {item.status === "enrolled" ||
                      item.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                          <CheckCircle className="w-3 h-3" />{" "}
                          {item.status.toUpperCase()}
                        </span>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold border border-red-100">
                            <XCircle className="w-3 h-3" />{" "}
                            {item.status.toUpperCase()}
                          </span>
                          {item.drop_reason && (
                            <span
                              className="text-xs text-gray-400 max-w-[150px] truncate"
                              title={item.drop_reason}
                            >
                              Lý do: {item.drop_reason}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    Không có dữ liệu đăng ký.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailTuteeTracking;
