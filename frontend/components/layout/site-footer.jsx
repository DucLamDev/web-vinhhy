import Link from "next/link";
import { MapPin, PhoneCall, Send } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-8 hidden border-t border-slate-200 bg-white md:block">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Tour Vĩnh Hy</p>
          {/* <h3 className="mt-3 text-3xl font-semibold text-ink">Đi để thấy biển Ninh Thuận đẹp và dịu hơn nhiều so với tưởng tượng.</h3> */}
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
            Website chuyên tour Vĩnh Hy, Hang Rái và Ninh Chữ với giao diện xem tour thân thiện, nhiều hình ảnh và quy trình đặt chỗ rõ ràng.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Điều hướng</h4>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link href="/">Trang chủ</Link>
            <Link href="/tour">Danh sách tour</Link>
            <Link href="/blog">Cẩm nang du lịch</Link>
            <Link href="/dang-ky">Đăng ký</Link>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Liên hệ</h4>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p className="inline-flex items-start gap-2">
              <PhoneCall className="mt-0.5 h-4 w-4 text-ocean" />
              <span>09167.456.83 (Mr. Thuận)</span>
            </p>
            <p className="inline-flex items-start gap-2">
              <Send className="mt-0.5 h-4 w-4 text-ocean" />
              <span>booking@letsflytravel.vn</span>
            </p>
            <p className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-ocean" />
              <span>Vĩnh Hy, Ninh Hải, Ninh Thuận</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
