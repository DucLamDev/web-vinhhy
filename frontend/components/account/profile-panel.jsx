"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest, getAuthHeaders } from "@/lib/api";
import { clearToken, getToken } from "@/lib/auth";
import { formatCurrency, formatDate } from "@/lib/utils";

export function ProfilePanel() {
  const queryClient = useQueryClient();
  const token = getToken();

  const userQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => apiRequest("/user/me", { headers: getAuthHeaders(token) }),
    enabled: Boolean(token)
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: () => apiRequest("/user/bookings", { headers: getAuthHeaders(token) }),
    enabled: Boolean(token)
  });

  const updateMutation = useMutation({
    mutationFn: (payload) =>
      apiRequest("/user/me", {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    }
  });

  if (!token) {
    return (
      <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="rounded-[30px] bg-gradient-to-br from-sky via-white to-sand p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Chưa đăng nhập</p>
          <h2 className="mt-3 text-4xl font-semibold text-ink">Hãy đăng nhập để xem lại các booking và lưu thông tin liên hệ.</h2>
          <p className="mt-4 text-sm leading-8 text-slate-600">
            Tài khoản giúp bạn quản lý chuyến đi gọn hơn, đặc biệt khi cần đặt thêm tour hoặc kiểm tra thông tin khởi hành.
          </p>
        </div>
        <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="grid gap-3">
            <Button asChild size="lg">
              <Link href="/dang-nhap">Đăng nhập</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/dang-ky">Đăng ký tài khoản</Link>
            </Button>
            <Button asChild variant="sea" size="lg">
              <a href={process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || "http://localhost:5000/auth/google"}>Đăng nhập bằng Google</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr]">
      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Hồ sơ cá nhân</p>
            <h2 className="mt-2 text-3xl font-semibold text-ink">Thông tin liên hệ</h2>
          </div>
          <Button variant="ghost" onClick={() => clearToken()}>
            Đăng xuất
          </Button>
        </div>

        {userQuery.isLoading ? (
          <p className="mt-6 text-sm text-slate-500">Đang tải thông tin...</p>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              updateMutation.mutate({
                name: formData.get("name"),
                phone: formData.get("phone")
              });
            }}
          >
            <Field label="Họ và tên">
              <Input name="name" defaultValue={userQuery.data?.name || ""} required />
            </Field>
            <Field label="Email">
              <Input value={userQuery.data?.email || ""} disabled />
            </Field>
            <Field label="Số điện thoại">
              <Input name="phone" defaultValue={userQuery.data?.phone || ""} />
            </Field>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Đang lưu..." : "Cập nhật hồ sơ"}
            </Button>
            {updateMutation.isSuccess ? <p className="text-sm text-emerald-600">Đã cập nhật thành công.</p> : null}
            {updateMutation.isError ? <p className="text-sm text-red-600">{updateMutation.error.message}</p> : null}
          </form>
        )}
      </div>

      <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Lịch sử đặt tour</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">Những chuyến đi bạn đã lưu</h2>
        <div className="mt-6 space-y-4">
          {bookingsQuery.isLoading ? <p className="text-sm text-slate-500">Đang tải lịch sử booking...</p> : null}
          {bookingsQuery.data?.length ? (
            bookingsQuery.data.map((booking) => (
              <div key={booking._id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-ink">{booking.tour?.title || "Tour"}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Khởi hành: {formatDate(booking.travelDate)} • Trạng thái: {booking.status}
                    </p>
                  </div>
                  <p className="text-xl font-semibold text-coral">{formatCurrency(booking.pricing.totalPrice)}</p>
                </div>
              </div>
            ))
          ) : bookingsQuery.isLoading ? null : (
            <p className="text-sm leading-7 text-slate-500">Bạn chưa có booking nào được lưu trong tài khoản này.</p>
          )}
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
