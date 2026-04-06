"use client";

import { useEffect, useState } from "react";

import { adminRequest } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await adminRequest("/admin/users", { cache: "no-store" });
      setUsers(result);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (id, role) => {
    if (!confirm(`Xác nhận đổi quyền người dùng này thành ${role}?`)) return;

    try {
      const result = await adminRequest(`/admin/users/${id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role })
      });

      setUsers((current) => current.map((user) => (user._id === id ? result.user : user)));
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
      {error ? <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Họ và Tên</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Ngày tham gia</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Vai trò</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Đang tải...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 font-medium text-gray-900">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-500">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                  <td className="px-6 py-4 text-sm">
                    {user.role === "admin" ? (
                      <span className="rounded border border-purple-200 bg-purple-50 px-2 py-1 font-semibold text-purple-600">Admin</span>
                    ) : (
                      <span className="px-2 py-1 font-medium text-slate-600">User</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {user.role !== "admin" ? (
                        <button onClick={() => handleUpdateRole(user._id, "admin")} className="text-purple-600 hover:underline">
                          Cấp quyền Admin
                        </button>
                      ) : (
                        <button onClick={() => handleUpdateRole(user._id, "user")} className="text-slate-500 hover:underline">
                          Gỡ quyền
                        </button>
                      )}
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
