import { TourCatalogSection } from "@/components/sections/tour-catalog-section";
import { buildMetadata } from "@/lib/seo";
import { getTours } from "@/lib/api";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Danh sách tour Vĩnh Hy | Tour Vĩnh Hy",
  description: "Xem danh sách tour Vĩnh Hy, lịch khởi hành, giá tour, điểm đón và lịch trình chi tiết.",
  path: "/tour"
});

export default async function ToursPage() {
  const tours = await getTours();

  return (
    <div className="pb-10">
      {/* <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[36px] bg-gradient-to-r from-sky via-white to-sand px-6 py-10 shadow-soft sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Danh sách chương trình tour</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-ink sm:text-5xl">Chọn hành trình phù hợp nhất cho chuyến đi Vĩnh Hy của bạn.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600">
            Mỗi chương trình đều hiển thị rõ giá tour, lịch khởi hành, điểm đón và phương tiện để bạn dễ so sánh trước khi chọn.
          </p>
        </div>
      </section> */}
      <TourCatalogSection tours={tours} />
    </div>
  );
}
