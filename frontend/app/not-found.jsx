import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Không tìm thấy nội dung</p>
        <h1 className="mt-3 text-4xl font-semibold text-ink">Trang bạn đang tìm có thể đã đổi đường dẫn.</h1>
        <p className="mt-4 text-sm leading-8 text-slate-600">
          Bạn có thể quay về trang chủ hoặc xem ngay danh sách tour đang mở bán để tiếp tục lên kế hoạch cho chuyến đi.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/tour">Xem tour</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
