"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { adminRequest } from "@/lib/admin-api";
import { clearToken, getToken } from "@/lib/auth";

export function AdminGuard({ children }) {
  const [state, setState] = useState({
    loading: true,
    allowed: false,
    message: ""
  });

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setState({
        loading: false,
        allowed: false,
        message: "Bạn cần đăng nhập bằng tài khoản admin để truy cập khu quản trị."
      });
      return;
    }

    const checkAccess = async () => {
      try {
        const user = await adminRequest("/user/me", { cache: "no-store" });

        if (user.role !== "admin") {
          setState({
            loading: false,
            allowed: false,
            message: "Tài khoản hiện tại không có quyền admin."
          });
          return;
        }

        setState({
          loading: false,
          allowed: true,
          message: ""
        });
      } catch (error) {
        setState({
          loading: false,
          allowed: false,
          message: error.message || "Không thể xác thực quyền admin."
        });
      }
    };

    checkAccess();
  }, []);

  if (state.loading) {
    return <div className="text-sm text-slate-500">Đang kiểm tra quyền truy cập admin...</div>;
  }

  if (!state.allowed) {
    return (
      <div className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Admin Required</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Không thể mở khu quản trị</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">{state.message}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/dang-nhap">Đi tới đăng nhập</Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              clearToken();
              window.location.href = "/dang-nhap";
            }}
          >
            Đăng xuất tài khoản hiện tại
          </Button>
        </div>
      </div>
    );
  }

  return children;
}
