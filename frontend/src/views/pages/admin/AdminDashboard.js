import React from "react";
import { Users, MessageSquare, CalendarCheck, FileText } from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import OverviewChart from "../../components/charts/OverviewChart";

const chartData = [
  { name: "Thg 7", meetings: 12, feedbacks: 8, reports: 4 },
  { name: "Thg 8", meetings: 18, feedbacks: 14, reports: 6 },
  { name: "Thg 9", meetings: 10, feedbacks: 6, reports: 3 },
  { name: "Thg 10", meetings: 22, feedbacks: 18, reports: 9 },
];

export default function AdminDashboard() {
  // mock stats
  const stats = [
    { id: 1, title: "Người dùng", value: 345, icon: <Users className="w-6 h-6 text-blue-600" /> },
    { id: 2, title: "Meeting chờ", value: 12, icon: <CalendarCheck className="w-6 h-6 text-green-600" /> },
    { id: 3, title: "Feedback mới", value: 9, icon: <MessageSquare className="w-6 h-6 text-yellow-600" /> },
    { id: 4, title: "Báo cáo", value: 5, icon: <FileText className="w-6 h-6 text-red-600" /> },
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin — Bảng điều khiển</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((s) => (
          <StatCard key={s.id} title={s.title} value={s.value} icon={s.icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewChart data={chartData} />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Tổng quan nhanh</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>• Meeting chờ duyệt: 12</li>
            <li>• Feedback chưa xem: 9</li>
            <li>• Reports chờ xử lý: 5</li>
            <li>• Tỉ lệ tutor active: 72%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
