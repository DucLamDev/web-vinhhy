"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { TourListCard } from "@/components/tour/tour-list-card";
import { Input } from "@/components/ui/input";

export function TourCatalogSection({ tours }) {
  const [keyword, setKeyword] = useState("");
  const [standard, setStandard] = useState("Tất cả");

  const standards = ["Tất cả", ...new Set(tours.map((tour) => tour.standard || "Tiêu chuẩn"))];

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchKeyword =
        !keyword ||
        [tour.title, tour.location, tour.summary].some((value) => value?.toLowerCase().includes(keyword.toLowerCase()));
      const matchStandard = standard === "Tất cả" || (tour.standard || "Tiêu chuẩn") === standard;
      return matchKeyword && matchStandard;
    });
  }, [keyword, standard, tours]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft xl:sticky xl:top-28">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Bộ lọc tìm tour</p>
          <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-ink">
              <Search className="h-4 w-4 text-ocean" />
              Tìm theo từ khóa
            </div>
            <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Vĩnh Hy, Hang Rái..." />
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-ink">Dòng tour</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {standards.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStandard(item)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    standard === item ? "bg-ocean text-white" : "bg-slate-100 text-slate-600 hover:bg-sky"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Chúng tôi tìm thấy <span className="font-semibold text-ocean">{filteredTours.length}</span> chương trình phù hợp cho bạn.
            </p>
            <p className="text-sm text-slate-500">Gợi ý: ưu tiên tour 1 ngày nếu bạn đi cùng gia đình có trẻ nhỏ.</p>
          </div>

          <div className="space-y-5">
            {filteredTours.map((tour) => (
              <TourListCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
