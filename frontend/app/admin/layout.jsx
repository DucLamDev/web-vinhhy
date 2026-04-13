import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/cms/admin-sidebar";

export const metadata = {
  title: "Admin Dashboard | Tour Vinh Hy",
  description: "Trang quản trị hệ thống Tour Vinh Hy"
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <AdminGuard>{children}</AdminGuard>
      </main>
    </div>
  );
}
