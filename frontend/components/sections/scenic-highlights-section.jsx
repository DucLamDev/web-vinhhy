import { SafeImage } from "@/components/ui/safe-image";
import { scenicHighlights } from "@/lib/home-gallery-data";

export function ScenicHighlightsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Góc đẹp trên hành trình</p>
        {/* <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
          Mỗi tour đều có một kiểu hình ảnh riêng, từ biển xanh ban ngày đến không khí đêm trên vịnh.
        </h2> */}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {scenicHighlights.map((item, index) => (
          <article
            key={item.title}
            className={`overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft ${index === 1 ? "lg:translate-y-8" : ""
              }`}
          >
            <div className="relative h-72">
              <SafeImage src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent" />
              <p className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
                {item.eyebrow}
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
