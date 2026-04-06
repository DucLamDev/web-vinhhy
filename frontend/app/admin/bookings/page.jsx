"use client";

import { useEffect, useState } from "react";

import { adminRequest } from "@/lib/admin-api";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await adminRequest("/admin/bookings", { cache: "no-store" });
      setBookings(result);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    if (!confirm(`Xác nhận chuyển trạng thái thành ${status}?`)) return;

    try {
      const updated = await adminRequest(`/admin/bookings/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });

      setBookings((current) => current.map((booking) => (booking._id === id ? { ...booking, ...updated } : booking)));
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Quản lý Bookings</h1>
      {error ? <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Khách hàng</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Tour / Ngày đi</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Tổng tiền</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Trạng thái</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Đang tải...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.customer.name}</div>
                    <div className="text-sm text-gray-500">{booking.customer.phone}</div>
                    <div className="text-sm text-gray-500">{booking.customer.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[220px] truncate text-sm text-gray-900" title={booking.tour?.title}>
                      {booking.tour?.title || "Unknown Tour"}
                    </div>
                    <div className="text-sm font-medium text-ocean">{formatDate(booking.travelDate)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(booking.pricing.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {booking.status === "confirmed" ? "Đã xác nhận" : booking.status === "pending" ? "Chờ xác nhận" : "Đã hủy"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      {booking.status !== "confirmed" ? (
                        <button onClick={() => handleUpdateStatus(booking._id, "confirmed")} className="text-ocean hover:underline">
                          Xác nhận
                        </button>
                      ) : null}
                      {booking.status !== "cancelled" ? (
                        <button onClick={() => handleUpdateStatus(booking._id, "cancelled")} className="text-coral hover:underline">
                          Hủy
                        </button>
                      ) : null}
                      {booking.status !== "pending" ? (
                        <button onClick={() => handleUpdateStatus(booking._id, "pending")} className="text-slate-500 hover:underline">
                          Đưa về chờ
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
