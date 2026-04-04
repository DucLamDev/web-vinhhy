import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Đăng ký | Tour Vĩnh Hy",
  description: "Tạo tài khoản để đặt tour Vĩnh Hy nhanh hơn và lưu lại lịch sử chuyến đi.",
  path: "/dang-ky"
});

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <AuthFormShell mode="register" />
    </div>
  );
}
