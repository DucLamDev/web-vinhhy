"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState({
    type: "loading",
    message: "Hệ thống đang kiểm tra liên kết xác thực của bạn..."
  });

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus({
        type: "error",
        message: "Liên kết xác thực không hợp lệ hoặc đang thiếu mã xác thực."
      });
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/auth/verify-email?token=${token}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Không thể xác thực email");
        }

        setStatus({
          type: "success",
          message: result.message || "Email đã được xác thực thành công."
        });
      } catch (error) {
        setStatus({
          type: "error",
          message: error.message
        });
      }
    };

    verify();
  }, [searchParams]);

  const accentClass =
    status.type === "success"
      ? "text-emerald-700"
      : status.type === "error"
        ? "text-red-600"
        : "text-ocean";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-soft sm:p-10">
        <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentClass}`}>Xác thực email</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink">
          {status.type === "success"
            ? "Tài khoản của bạn đã sẵn sàng"
            : status.type === "error"
              ? "Không thể xác thực email"
              : "Đang xác thực tài khoản"}
        </h1>
        <p className="mt-5 text-sm leading-8 text-slate-600">{status.message}</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/dang-nhap">Đi tới đăng nhập</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dang-ky">Quay lại đăng ký</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
