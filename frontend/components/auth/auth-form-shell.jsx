"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveToken } from "@/lib/auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formConfig = {
  login: {
    title: "Đăng nhập để quản lý chuyến đi",
    description: "Theo dõi lịch sử booking, cập nhật hồ sơ và nhận thông báo cho hành trình sắp tới.",
    endpoint: "/auth/login",
    submitText: "Đăng nhập",
    alternateText: "Chưa có tài khoản?",
    alternateHref: "/dang-ky",
    alternateLabel: "Đăng ký ngay"
  },
  register: {
    title: "Tạo tài khoản để đặt tour nhanh hơn",
    description: "Lưu thông tin liên hệ, xem lại booking và đồng bộ hành trình cho những chuyến đi tiếp theo.",
    endpoint: "/auth/register",
    submitText: "Tạo tài khoản",
    alternateText: "Đã có tài khoản?",
    alternateHref: "/dang-nhap",
    alternateLabel: "Đăng nhập"
  }
};

export function AuthFormShell({ mode = "login" }) {
  const router = useRouter();
  const config = formConfig[mode];
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationState, setVerificationState] = useState({ email: "", visible: false, message: "" });
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    if (!verificationState.email) return;

    setIsResending(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${apiBaseUrl}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: verificationState.email })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể gửi lại email xác thực");
      }

      setVerificationState((current) => ({
        ...current,
        message: result.message
      }));
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const formData = new FormData(event.currentTarget);
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password")
      };

      if (mode === "login") {
        delete payload.name;
        delete payload.phone;
      }

      const response = await fetch(`${apiBaseUrl}${config.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể xử lý yêu cầu");
      }

      if (mode === "register" || result.requiresVerification) {
        setVerificationState({
          email: result.email || payload.email || "",
          visible: true,
          message: result.message || "Vui lòng kiểm tra email để xác thực tài khoản."
        });
        event.currentTarget.reset();
        return;
      }

      saveToken(result.token);
      router.push("/account");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr]">
      <div className="rounded-[32px] bg-gradient-to-br from-sky via-white to-sand p-6 shadow-soft sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Tour Vĩnh Hy</p>
        <h1 className="mt-4 text-4xl font-semibold text-ink">{config.title}</h1>
        <p className="mt-4 text-sm leading-8 text-slate-600">{config.description}</p>

        <div className="mt-8 space-y-4">
          {[
            "Lưu nhanh thông tin liên hệ cho các lần đặt tiếp theo",
            "Theo dõi lịch sử booking trên điện thoại thuận tiện hơn",
            mode === "register"
              ? "Tài khoản mới cần xác thực email trước khi đăng nhập"
              : "Đăng nhập Google chỉ với một chạm ở ngay bên dưới"
          ].map((item) => (
            <div key={item} className="rounded-3xl bg-white/80 px-4 py-4 text-sm text-slate-600 shadow-[0_12px_30px_rgba(21,48,74,0.06)]">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        {verificationState.visible && mode === "register" ? (
          <div className="space-y-5">
            <div className="rounded-[28px] bg-emerald-50 px-5 py-6 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Kiểm tra email</p>
              <h2 className="mt-3 text-3xl font-semibold text-ink">Tài khoản gần như đã xong</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {verificationState.message}
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">{verificationState.email}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600">
              Sau khi bấm vào liên kết xác thực trong email, bạn có thể quay lại trang đăng nhập để vào tài khoản.
            </div>

            {status.message ? (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{status.message}</div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" className="flex-1" onClick={handleResendVerification} disabled={isResending}>
                {isResending ? "Đang gửi lại..." : "Gửi lại email xác thực"}
              </Button>
              <Button asChild type="button" variant="secondary" className="flex-1">
                <Link href="/dang-nhap">Đi tới đăng nhập</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" ? (
                <>
                  <Field label="Họ và tên">
                    <Input name="name" required placeholder="Nguyễn Văn A" />
                  </Field>
                  <Field label="Số điện thoại">
                    <Input name="phone" placeholder="0900 000 000" />
                  </Field>
                </>
              ) : null}

              <Field label="Email">
                <Input type="email" name="email" required placeholder="ban@email.com" />
              </Field>

              <Field label="Mật khẩu">
                <Input type="password" name="password" required placeholder="Nhập mật khẩu" />
              </Field>

              {status.message ? (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{status.message}</div>
              ) : null}

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : config.submitText}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-3 text-sm text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              <span>hoặc</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <Button asChild variant="secondary" size="lg" className="w-full gap-3">
              <a href={process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || "http://localhost:5000/auth/google"}>
                <GoogleIcon />
                Đăng nhập bằng Google
              </a>
            </Button>

            <p className="mt-6 text-center text-sm text-slate-500">
              {config.alternateText}{" "}
              <Link href={config.alternateHref} className="font-semibold text-ocean">
                {config.alternateLabel}
              </Link>
            </p>
          </>
        )}
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21.6 12.23c0-.72-.06-1.25-.2-1.8H12v3.41h5.52c-.11.85-.7 2.14-2 3l-.02.11 2.91 2.25.2.02c1.81-1.67 2.99-4.12 2.99-6.99Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.89 6.61-2.42l-3.15-2.44c-.84.59-1.97 1-3.46 1-2.64 0-4.88-1.74-5.67-4.15l-.11.01-3.02 2.34-.04.11C4.81 19.75 8.13 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.33 13.99A5.97 5.97 0 0 1 6 12c0-.69.12-1.36.32-1.99l-.01-.13-3.06-2.38-.1.05A9.97 9.97 0 0 0 2 12c0 1.61.38 3.14 1.15 4.45l3.18-2.46Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.86c1.88 0 3.15.81 3.87 1.49l2.82-2.75C16.95 2.98 14.7 2 12 2 8.13 2 4.81 4.25 3.15 7.55l3.17 2.46C7.12 7.6 9.36 5.86 12 5.86Z"
        fill="#EA4335"
      />
    </svg>
  );
}
