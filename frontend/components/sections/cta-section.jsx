import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[38px] bg-gradient-to-r from-ocean via-teal to-[#6fd5dd] px-6 py-10 text-white shadow-soft sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Sẵn sàng lên lịch cho chuyến đi</p>
            {/* <h2 className="mt-3 text-4xl font-semibold">Chọn tour phù hợp và để phần còn lại cho biển trời Vĩnh Hy lo.</h2> */}
            <p className="mt-4 text-sm leading-8 text-white/80">
              Dù bạn thích một ngày nhẹ nhàng trên vịnh hay hành trình 2 ngày 1 đêm kết hợp Hang Rái và Ninh Chữ, luôn có một chương trình phù hợp với nhịp nghỉ của bạn.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="secondary" size="lg">
              <Link href="/tour">Xem danh sách tour</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dang-ky">Tạo tài khoản</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
