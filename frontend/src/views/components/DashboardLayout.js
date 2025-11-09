import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header role={user?.role} />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
