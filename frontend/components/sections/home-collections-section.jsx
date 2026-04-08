import { SafeImage } from "@/components/ui/safe-image";
import { homeCollections } from "@/lib/home-gallery-data";

export function HomeCollectionsSection() {
  return (
    <section className="bg-white/70 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ocean">Bộ sưu tập ảnh đẹp</p>
          {/* <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">Trang chủ nhiều ảnh hơn, rõ chất biển và chất địa phương hơn.</h2> */}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {homeCollections.map((collection) => (
            <article key={collection.title} className="overflow-hidden rounded-[30px] border border-slate-200 bg-[#fdfdfb] shadow-soft">
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1">
                {collection.images.map((image) => (
                  <div key={image} className="relative h-40 overflow-hidden rounded-[22px] sm:h-48">
                    <SafeImage src={image} alt={collection.title} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 16vw" />
                  </div>
                ))}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-ink">{collection.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{collection.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
