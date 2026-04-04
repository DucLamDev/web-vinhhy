import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Đăng nhập | Tour Vĩnh Hy",
  description: "Đăng nhập để quản lý hồ sơ và lịch sử booking Tour Vĩnh Hy.",
  path: "/dang-nhap"
});

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <AuthFormShell mode="login" />
    </div>
  );
}
