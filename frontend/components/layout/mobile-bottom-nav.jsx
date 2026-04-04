"use client";

import Link from "next/link";
import { BookOpenText, House, Menu, MapPinned, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Trang chủ", icon: House },
  { href: "/tour", label: "Tour", icon: MapPinned },
  { href: "/blog", label: "Cẩm nang", icon: BookOpenText },
  { href: "/account", label: "Tài khoản", icon: UserRound }
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/96 px-2 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium",
                active ? "text-coral" : "text-slate-500"
              )}
            >
              <Icon className="mb-1 h-4 w-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("toggle-mobile-menu"))}
          className="flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-medium text-slate-500"
        >
          <Menu className="mb-1 h-4 w-4" />
          <span>Menu</span>
        </button>
      </div>
    </nav>
  );
}
