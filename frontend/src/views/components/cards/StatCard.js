import React from "react";

export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border flex items-center gap-4 hover:shadow-md transition">
      <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
