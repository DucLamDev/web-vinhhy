"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarCheck,
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  Map,
  SearchCheck,
  Tags,
  Users
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Posts", href: "/admin/posts", icon: BookOpen },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Tags", href: "/admin/tags", icon: Tags },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
  { name: "SEO Settings", href: "/admin/seo", icon: SearchCheck },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { name: "Tours", href: "/admin/tours", icon: Map },
  { name: "Users", href: "/admin/users", icon: Users }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-slate-200 bg-white/92 backdrop-blur">
      <div className="border-b border-slate-100 px-6 py-6">
        <Link href="/admin" className="block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">VinhHy CMS</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">
            WordPress-like
            <span className="text-coral"> Admin</span>
          </h1>
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active ? "bg-slate-950 text-white shadow-lg" : "text-slate-700 hover:bg-slate-100 hover:text-ocean"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
