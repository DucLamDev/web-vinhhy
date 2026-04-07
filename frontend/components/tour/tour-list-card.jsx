import Link from "next/link";
import { CalendarDays, CarFront, MapPin, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { formatCurrency } from "@/lib/utils";

export function TourListCard({ tour }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_16px_35px_rgba(21,48,74,0.08)]">
      <div className="grid lg:grid-cols-[320px_1fr]">
        <div className="relative min-h-[210px]">
          <SafeImage src={tour.heroImage} alt={tour.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 320px" />
          <div className="absolute bottom-4 left-4 rounded-full bg-ocean px-4 py-2 text-xs font-semibold text-white">
            {tour.standard || "Tiêu chuẩn"}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-[1.55rem] font-semibold leading-tight text-ink sm:text-2xl">{tour.title}</h3>
              <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                <Info icon={<Ticket className="h-4 w-4 text-ocean" />} label={`Mã tour: ${tour.tourCode || "VHY00"}`} />
                <Info icon={<MapPin className="h-4 w-4 text-ocean" />} label={`Điểm đón: ${tour.pickupPlace || "Phan Rang"}`} />
                <Info icon={<CalendarDays className="h-4 w-4 text-ocean" />} label={`Thời gian: ${tour.duration}`} />
                <Info icon={<CarFront className="h-4 w-4 text-ocean" />} label={`Phương tiện: ${tour.transport || "Xe du lịch"}`} />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{tour.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-xl border border-coral/40 bg-coral/5 px-3 py-1.5 text-xs font-semibold text-coral">
                  Mở hằng tuần
                </span>
              </div>
            </div>

            <div className="rounded-[24px] bg-sand p-4 sm:p-5 xl:min-w-[220px]">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá từ</p>
              <p className="mt-2 whitespace-nowrap text-[1.75rem] font-semibold leading-none tracking-tight text-coral [font-variant-numeric:tabular-nums] sm:text-3xl">
                {formatCurrency(tour.prices.adult)}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">Đã bao gồm các dịch vụ cơ bản trong tour.</p>
              <Button asChild className="mt-5 w-full">
                <Link href={`/tour/${tour.slug}`} prefetch>
                  Xem chi tiết
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Info({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2">
      {icon}
      {label}
    </span>
  );
}
