import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function FeaturedToursSection({ tours }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-[1.2rem] tracking-[0.24em] text-ocean">Chương trình nổi bật</p>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Những hành trình dễ đi, ảnh đẹp và phù hợp cho cả cặp đôi, gia đình lẫn nhóm bạn.
          </p>
        </div>
      </div>

      {/* Mobile: horizontal snap scroll */}
      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:hidden">
        {tours.slice(0, 3).map((tour) => (
          <article
            key={tour.slug}
            className="flex w-[82vw] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-soft"
          >
            <div className="relative h-48 shrink-0">
              <Image src={tour.heroImage} alt={tour.title} fill className="object-cover" sizes="340px" />
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ocean">
                {tour.standard || "Tiêu chuẩn"}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="line-clamp-2 text-base font-bold leading-snug text-coral">{tour.title}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-500">{tour.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-ocean" />
                  {tour.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3 text-ocean" />
                  {tour.duration}
                </span>
              </div>
              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">Giá từ</p>
                  <p className="text-lg font-bold leading-none text-coral">{formatCurrency(tour.prices.adult)}</p>
                </div>
                <Button asChild size="sm">
                  <Link href={`/tour/${tour.slug}`}>Xem chi tiết</Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Desktop: 3-column grid */}
      <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-3">
        {tours.slice(0, 3).map((tour) => (
          <article
            key={tour.slug}
            className="flex h-full flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft"
          >
            <div className="relative h-64 shrink-0">
              <Image src={tour.heroImage} alt={tour.title} fill className="object-cover" sizes="33vw" />
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
        ))}
      </div>
    </section>
  );
}
