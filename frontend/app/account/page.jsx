import { ProfilePanel } from "@/components/account/profile-panel";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tài khoản của tôi | Tour Vĩnh Hy",
  description: "Quản lý hồ sơ, xem lịch sử booking và cập nhật thông tin liên hệ.",
  path: "/account"
});

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-sky via-white to-sand px-6 py-8 shadow-soft sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Tài khoản du khách</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">Theo dõi booking và giữ mọi thông tin chuyến đi trong một nơi.</h1>
      </div>
      <div className="mt-8">
        <ProfilePanel />
      </div>
    </div>
  );
}
