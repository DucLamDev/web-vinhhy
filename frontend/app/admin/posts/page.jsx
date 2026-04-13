"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search, SquarePen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cmsApi } from "@/lib/cms-api";
import { formatDate } from "@/lib/utils";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async (nextSearch = search, nextStatus = status) => {
    setLoading(true);
    setError("");

    try {
      const result = await cmsApi.getPosts({
        search: nextSearch,
        status: nextStatus
      });
      setPosts(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">Posts</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Quan ly bai viet</h1>
          <p className="mt-2 text-sm text-slate-500">Danh sach post voi search, filter va thao tac vao editor ngay trong cung tab.</p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-full bg-transparent text-sm outline-none"
            placeholder="Tim theo title hoac slug"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") loadPosts(event.currentTarget.value, status);
            }}
          />
        </div>
        <select
          className="admin-input max-w-[220px]"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            loadPosts(search, event.target.value);
          }}
        >
          <option value="">Tat ca trang thai</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <Button variant="secondary" onClick={() => loadPosts()}>
          Loc
        </Button>
      </div>

      {error ? <div className="rounded-[22px] bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Title</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Slug</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Created</th>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Author</th>
              <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-5 py-6 text-center text-sm text-slate-500">Dang tai posts...</td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-5 py-6 text-center text-sm text-slate-500">Chua co bai viet nao.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-5 py-4">
                    <div className="max-w-[320px]">
                      <p className="truncate text-sm font-semibold text-ink">{post.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{post.excerpt || "Khong co excerpt."}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{post.slug}</td>
                  <td className="px-5 py-4 text-sm">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold capitalize text-slate-700">{post.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">{formatDate(post.createdAt)}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{post.author?.name || "Admin"}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/posts/${post._id}`} className="rounded-full bg-slate-100 p-2 text-slate-700">
                        <SquarePen className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        className="rounded-full bg-red-50 p-2 text-red-600"
                        onClick={async () => {
                          await cmsApi.deletePost(post._id);
                          setPosts((current) => current.filter((item) => item._id !== post._id));
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
  );
}
