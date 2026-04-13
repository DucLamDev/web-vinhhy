"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cmsApi } from "@/lib/cms-api";

const emptyForm = { name: "", slug: "", description: "" };

export function TaxonomyManager({ type, title, description }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await cmsApi.getTaxonomy(type);
      setItems(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [type]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");

    try {
      const result = editingId
        ? await cmsApi.updateTaxonomy(type, editingId, form)
        : await cmsApi.createTaxonomy(type, form);

      setItems((current) =>
        editingId ? current.map((item) => (item._id === editingId ? result : item)) : [...current, result].sort((a, b) => a.name.localeCompare(b.name))
      );
      setStatus(editingId ? "Đã cập nhật." : "Đã tạo mới.");
      resetForm();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-ink">{editingId ? "Chỉnh sửa" : "Tạo mới"}</h2>
          </div>
          <input className="admin-input" placeholder="Tên" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="admin-input" placeholder="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
          <textarea
            className="admin-input min-h-28"
            placeholder="Mô tả ngắn"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />

          {status ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div> : null}
          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

          <div className="flex gap-3">
            <Button type="submit">{editingId ? "Lưu thay đổi" : "Tạo mục mới"}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Làm trống
            </Button>
          </div>
        </form>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Tên</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Slug</th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Mô tả</th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-5 py-6 text-center text-sm text-slate-500">Đang tải...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-6 text-center text-sm text-slate-500">Chưa có dữ liệu.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-5 py-4 text-sm font-medium text-ink">{item.name}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{item.slug}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">{item.description || "-"}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-slate-100 p-2 text-slate-600"
                          onClick={() => {
                            setEditingId(item._id);
                            setForm({
                              name: item.name,
                              slug: item.slug,
                              description: item.description || ""
                            });
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-red-50 p-2 text-red-600"
                          onClick={async () => {
                            await cmsApi.deleteTaxonomy(type, item._id);
                            setItems((current) => current.filter((entry) => entry._id !== item._id));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
