"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { saveToken } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      saveToken(token);
      router.replace("/account");
      return;
    }

    router.replace("/dang-nhap");
  }, [router, searchParams]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Đang xác thực</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Hệ thống đang hoàn tất đăng nhập cho bạn...</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">Bạn sẽ được chuyển sang trang tài khoản trong giây lát.</p>
      </div>
    </div>
  );
}
