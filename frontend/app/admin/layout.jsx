import Link from "next/link";
import { LayoutDashboard, Map, BookOpen, Users, CalendarCheck } from "lucide-react";
import { AdminGuard } from "@/components/admin/admin-guard";

export const metadata = {
  title: "Admin Dashboard | Tour Vĩnh Hy",
  description: "Trang quản trị hệ thống Tour Vĩnh Hy"
};

const navItems = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Quản lý Booking", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Quản lý Tour", href: "/admin/tours", icon: Map },
  { name: "Quản lý Blog", href: "/admin/blogs", icon: BookOpen },
  { name: "Quản lý User", href: "/admin/users", icon: Users }
];

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-center border-b border-slate-100">
          <Link href="/admin" className="text-xl font-bold text-ocean">
            VĩnhHy <span className="text-coral">Admin</span>
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-ocean"
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <AdminGuard>{children}</AdminGuard>
      </main>
    </div>
  );
}
