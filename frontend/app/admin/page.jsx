"use client";

import { useEffect, useState } from "react";
import { Users, Map, BookOpen, CalendarCheck, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await adminRequest("/admin/stats", { cache: "no-store" });
      setStats(result);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { title: "Tổng số Tour", value: stats?.tours || 0, icon: Map, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Booking chờ xác nhận", value: stats?.bookings?.pending || 0, icon: CalendarCheck, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Bài blog", value: stats?.blogs || 0, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Người dùng", value: stats?.users || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-100" }
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
          <p className="mt-2 text-sm text-slate-500">Theo dõi nhanh tình trạng tours, bookings, blogs và người dùng.</p>
        </div>
        <Button variant="secondary" onClick={fetchStats} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {error ? <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="flex items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{loading ? "..." : card.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
