"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-api";
import { formatDate } from "@/lib/utils";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  published: true
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyForm);

  const fetchBlogs = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await adminRequest("/admin/blogs", { cache: "no-store" });
      setBlogs(result);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
      const path = editingId ? `/admin/blogs/${editingId}` : "/admin/blogs";
      const method = editingId ? "PUT" : "POST";

      const result = await adminRequest(path, {
        method,
        body: JSON.stringify(form)
      });

      if (editingId) {
        setBlogs((current) => current.map((blog) => (blog._id === editingId ? result : blog)));
        setStatus("Cập nhật blog thành công.");
      } else {
        setBlogs((current) => [result, ...current]);
        setStatus("Tạo blog mới thành công.");
      }

      resetForm();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      featuredImage: blog.featuredImage || "",
      published: Boolean(blog.published)
    });
    setStatus("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Xác nhận xóa bài viết này?")) return;

    try {
      await adminRequest(`/admin/blogs/${id}`, { method: "DELETE" });
      setBlogs((current) => current.filter((blog) => blog._id !== id));
      if (editingId === id) resetForm();
      setStatus("Xóa blog thành công.");
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Blogs</h1>
        <p className="mt-2 text-sm text-slate-500">Tạo, chỉnh sửa và xóa bài viết ngay trong khu admin.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">{editingId ? "Sửa bài viết" : "Viết bài mới"}</h2>
          <div className="mt-4 space-y-4">
            <Field label="Tiêu đề">
              <input className="admin-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </Field>
            <Field label="Slug">
              <input className="admin-input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </Field>
            <Field label="Ảnh đại diện">
              <input className="admin-input" value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} />
            </Field>
            <Field label="Excerpt">
              <textarea className="admin-input min-h-24" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required />
            </Field>
            <Field label="Nội dung HTML">
              <textarea className="admin-input min-h-56" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </Field>
            <label className="flex items-center gap-3 text-sm text-slate-600">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Hiển thị bài viết
            </label>
          </div>

          {status ? <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div> : null}
          {error ? <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

          <div className="mt-5 flex gap-3">
            <Button type="submit">{editingId ? "Lưu thay đổi" : "Tạo bài viết"}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Làm trống
            </Button>
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Tiêu đề</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Người viết</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Đang tải...</td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <div className="max-w-[260px] truncate" title={blog.title}>{blog.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(blog.createdAt)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{blog.author?.name || "Admin"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className={blog.published ? "rounded bg-green-50 px-2 py-1 text-green-600" : "rounded bg-slate-100 px-2 py-1 text-slate-500"}>
                        {blog.published ? "Hiển thị" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => handleEdit(blog)} className="text-ocean hover:underline">Sửa</button>
                        <button onClick={() => handleDelete(blog._id)} className="text-coral hover:underline">Xóa</button>
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
