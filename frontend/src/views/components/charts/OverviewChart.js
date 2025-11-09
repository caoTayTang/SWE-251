import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

export default function OverviewChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Hoạt động theo tháng</h3>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="meetings" fill="#3B82F6" name="Meetings" />
            <Bar dataKey="feedbacks" fill="#F59E0B" name="Feedbacks" />
            <Bar dataKey="reports" fill="#EF4444" name="Reports" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
