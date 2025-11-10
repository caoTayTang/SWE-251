import React, { useState, useEffect } from "react";
import { Users, MessageSquare, CalendarCheck, FileText } from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import OverviewChart from "../../components/charts/OverviewChart";
import {
  getAdminDashboardChart,
  getAdminDashboardStats,
} from "../../../api/api";

const iconMap = {
  "Người dùng": <Users className="w-6 h-6 text-blue-600" />,
  "Meeting chờ": <CalendarCheck className="w-6 h-6 text-green-600" />,
  "Feedback mới": <MessageSquare className="w-6 h-6 text-yellow-600" />,
  "Báo cáo": <FileText className="w-6 h-6 text-red-600" />,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 6. Dùng Promise.all để gọi song song
        const [statsRes, chartRes] = await Promise.all([
          getAdminDashboardStats(),
          getAdminDashboardChart(),
        ]);

        setStats(statsRes.data);
        setChartData(chartRes.data);
      } catch (err) {
        console.error("Lỗi tải dashboard:", err);
        setError("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statsMap = stats.reduce((acc, stat) => {
    acc[stat.title] = stat.value;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin — Bảng điều khiển</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <StatCard
            key={s.id}
            title={s.title}
            value={s.value}
            icon={iconMap[s.title]} // 9. Lấy icon từ map
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewChart data={chartData} />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Tổng quan nhanh
          </h3>
          {/* 10. Data "Tổng quan nhanh" giờ động, không bị "vênh" */}
          <ul className="space-y-3 text-sm text-gray-600">
            <li>• Meeting chờ duyệt: {statsMap["Meeting chờ"] || 0}</li>
            <li>• Feedback chưa xem: {statsMap["Feedback mới"] || 0}</li>
            <li>• Reports chờ xử lý: {statsMap["Báo cáo"] || 0}</li>
            <li>• Tỉ lệ tutor active: 72% (data cứng)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
