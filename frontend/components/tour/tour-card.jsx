import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function TourCard({ tour }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft">
      <div className="relative h-64 shrink-0 sm:h-72">
        <Image src={tour.heroImage} alt={tour.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
          {tour.standard || "Tiêu chuẩn"}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-coral sm:text-xl">{tour.title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-600">{tour.summary}</p>
        </div>
        <div className="mt-6">
          <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-ocean" />
              {tour.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-ocean" />
              {tour.duration}
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Giá từ</p>
              <p className="mt-2 whitespace-nowrap text-[2rem] font-semibold leading-none tracking-tight text-coral [font-variant-numeric:tabular-nums]">
                {formatCurrency(tour.prices.adult)}
              </p>
            </div>
            <Button asChild>
              <Link href={`/tour/${tour.slug}`}>Xem chi tiết</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
