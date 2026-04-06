"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-api";
import { formatCurrency } from "@/lib/utils";

const emptyForm = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  duration: "",
  heroImage: "",
  tourCode: "",
  pickupPlace: "",
  transport: "",
  published: true,
  featured: false,
  prices: {
    adult: 0,
    child: 0,
    senior: 0
  }
};

export default function AdminToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);

  const fetchTours = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await adminRequest("/admin/tours", { cache: "no-store" });
      setTours(result);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");

    try {
      const path = editingId ? `/admin/tours/${editingId}` : "/admin/tours";
      const method = editingId ? "PUT" : "POST";

      const result = await adminRequest(path, {
        method,
        body: JSON.stringify({
          ...form,
          prices: {
            adult: Number(form.prices.adult || 0),
            child: Number(form.prices.child || 0),
            senior: Number(form.prices.senior || 0)
          }
        })
      });

      if (editingId) {
        setTours((current) => current.map((tour) => (tour._id === editingId ? result : tour)));
        setStatus("Cập nhật tour thành công.");
      } else {
        setTours((current) => [result, ...current]);
        setStatus("Tạo tour mới thành công.");
      }

      resetForm();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (tour) => {
    setEditingId(tour._id);
    setForm({
      title: tour.title || "",
      slug: tour.slug || "",
      summary: tour.summary || "",
      description: tour.description || "",
      duration: tour.duration || "",
      heroImage: tour.heroImage || "",
      tourCode: tour.tourCode || "",
      pickupPlace: tour.pickupPlace || "",
      transport: tour.transport || "",
      published: Boolean(tour.published),
      featured: Boolean(tour.featured),
      prices: {
        adult: tour.prices?.adult || 0,
        child: tour.prices?.child || 0,
        senior: tour.prices?.senior || 0
      }
    });
    setStatus("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa tour này?")) return;

    try {
      await adminRequest(`/admin/tours/${id}`, { method: "DELETE" });
      setTours((current) => current.filter((tour) => tour._id !== id));
      if (editingId === id) resetForm();
      setStatus("Xóa tour thành công.");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Tours</h1>
        <p className="mt-2 text-sm text-slate-500">Tạo nhanh tour mới hoặc chỉnh sửa thông tin tour hiện có.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">{editingId ? "Sửa tour" : "Thêm tour mới"}</h2>
          <div className="mt-4 space-y-4">
            <Field label="Tên tour">
              <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Field>
            <Field label="Slug">
              <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </Field>
            <Field label="Mã tour">
              <input className="admin-input" value={form.tourCode} onChange={(e) => setForm({ ...form, tourCode: e.target.value })} />
            </Field>
            <Field label="Thời gian">
              <input className="admin-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
            </Field>
            <Field label="Điểm đón">
              <input className="admin-input" value={form.pickupPlace} onChange={(e) => setForm({ ...form, pickupPlace: e.target.value })} />
            </Field>
            <Field label="Phương tiện">
              <input className="admin-input" value={form.transport} onChange={(e) => setForm({ ...form, transport: e.target.value })} />
            </Field>
            <Field label="Ảnh hero">
              <input className="admin-input" value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} required />
            </Field>
            <Field label="Summary">
              <textarea className="admin-input min-h-24" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
            </Field>
            <Field label="Description">
              <textarea className="admin-input min-h-32" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Giá NL">
                <input className="admin-input" type="number" value={form.prices.adult} onChange={(e) => setForm({ ...form, prices: { ...form.prices, adult: e.target.value } })} />
              </Field>
              <Field label="Giá TE">
                <input className="admin-input" type="number" value={form.prices.child} onChange={(e) => setForm({ ...form, prices: { ...form.prices, child: e.target.value } })} />
              </Field>
              <Field label="Giá Senior">
                <input className="admin-input" type="number" value={form.prices.senior} onChange={(e) => setForm({ ...form, prices: { ...form.prices, senior: e.target.value } })} />
              </Field>
            </div>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Hiển thị tour
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Đánh dấu nổi bật
            </label>
          </div>

          {status ? <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div> : null}
          {error ? <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

          <div className="mt-5 flex gap-3">
            <Button type="submit">{editingId ? "Lưu thay đổi" : "Tạo tour"}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Làm trống
            </Button>
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Tên Tour</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Mã Tour</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Giá</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : tours.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                tours.map((tour) => (
                  <tr key={tour._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="max-w-[260px] truncate" title={tour.title}>{tour.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tour.tourCode || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(tour.prices?.adult || 0)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className={tour.published ? "rounded bg-green-50 px-2 py-1 text-green-600" : "rounded bg-slate-100 px-2 py-1 text-slate-500"}>
                        {tour.published ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleEdit(tour)} className="text-ocean hover:underline">Sửa</button>
                        <button onClick={() => handleDelete(tour._id)} className="text-coral hover:underline">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
