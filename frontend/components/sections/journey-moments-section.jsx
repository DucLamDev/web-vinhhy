import { SafeImage } from "@/components/ui/safe-image";
import { homeJourneyMoments } from "@/lib/home-gallery-data";

export function JourneyMomentsSection() {
  return (
    <section className="bg-sky/40 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[1.3rem] tracking-[0.24em] text-ocean">Trải nghiệm đáng nhớ</p>
            {/* <h4 className="mt-3 text-4xl font-semibold text-ink">Một chuyến đi đẹp thường đến từ những khoảnh khắc rất nhỏ.</h4> */}
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Có thể là lúc nắng vừa lên ở Hang Rái, lúc tàu lướt qua làn nước trong veo hay một bữa trưa hải sản kéo dài hơn vì khung cảnh quá dễ chịu.
            </p>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {homeJourneyMoments.map((item) => (
            <article key={item.title} className="grid overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-soft md:grid-cols-[0.92fr_1.08fr]">
              <div className="relative h-72 w-full md:h-full">
                <SafeImage src={item.image} alt={item.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-3xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-4 text-sm leading-8 text-slate-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
