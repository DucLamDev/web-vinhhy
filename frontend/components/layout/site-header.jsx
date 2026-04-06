"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, PhoneCall, Search, UserRound, Waves, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { authEventName, clearToken, getToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/tour", label: "Tour Vĩnh Hy" },
  { href: "/blog", label: "Cẩm nang" },
  { href: "/account", label: "Tài khoản" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(Boolean(getToken()));
    const toggleMobileMenu = () => setIsOpen((current) => !current);

    syncAuth();
    window.addEventListener("storage", syncAuth);
    window.addEventListener(authEventName, syncAuth);
    window.addEventListener("toggle-mobile-menu", toggleMobileMenu);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener(authEventName, syncAuth);
      window.removeEventListener("toggle-mobile-menu", toggleMobileMenu);
    };
  }, []);

  const isActivePath = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/88 backdrop-blur-xl">
      <div className="hidden border-b border-sky/60 bg-sky/70 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-sm text-ink/70 lg:px-8">
          <p>Khởi hành đều mỗi tuần cho tuyến Vĩnh Hy, Hang Rái và Ninh Chữ.</p>
          <div className="inline-flex items-center gap-2 font-semibold text-ocean">
            <PhoneCall className="h-4 w-4" />
            09167.456.83 (Mr. Thuận)
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Tour Vĩnh Hy" className="h-12 w-12 rounded-full object-cover shadow-soft" />
          <div>
            <p className="text-lg font-semibold text-ink">Tour Vĩnh Hy</p>
            <p className="text-xs uppercase tracking-[0.22em] text-ocean">Biển xanh • Cung đường đẹp</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-2 shadow-[0_12px_30px_rgba(21,48,74,0.06)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                isActivePath(item.href) ? "bg-sky text-ocean" : "text-ink/80 hover:bg-slate-50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <Button asChild variant="secondary" size="sm">
                <Link href="/account">
                  <UserRound className="mr-2 h-4 w-4" />
                  Hồ sơ
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => clearToken()}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dang-nhap">Đăng nhập</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/dang-ky">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-ink shadow-[0_12px_30px_rgba(21,48,74,0.08)]"
            aria-label="Tìm kiếm"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-ink shadow-[0_12px_30px_rgba(21,48,74,0.08)]"
            aria-label="Mở menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 pb-28 pt-4 shadow-[0_20px_50px_rgba(21,48,74,0.08)] lg:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-base font-medium",
                  isActivePath(item.href) ? "bg-sky text-ocean" : "text-ink hover:bg-slate-50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-[28px] bg-sky/40 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-ocean">Tư vấn nhanh</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">Liên hệ hotline hoặc đăng nhập để lưu chuyến đi và theo dõi lịch khởi hành.</p>
          </div>

          <div className="mt-5 grid gap-3">
            {isLoggedIn ? (
              <Button
                variant="secondary"
                onClick={() => {
                  clearToken();
                  setIsOpen(false);
                }}
              >
                Đăng xuất
              </Button>
            ) : (
              <>
                <Button asChild variant="secondary">
                  <Link href="/dang-nhap" onClick={() => setIsOpen(false)}>
                    Đăng nhập
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/dang-ky" onClick={() => setIsOpen(false)}>
                    Đăng ký ngay
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
