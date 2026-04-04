import { visualSections } from "@/lib/mock-data";

export function VisualGallerySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-[34px] bg-gradient-to-br from-[#dff5ef] via-[#eef9f6] to-[#fff7ee] p-7 text-ink shadow-soft">
          <p className="text-sm font-semibold uppercase text-[1rem] tracking-[0.24em] text-ocean">Chạm vào cảm hứng du lịch</p>
          {/* <h2 className="mt-4 text-4xl font-semibold">Vĩnh Hy đẹp nhất khi được cảm nhận bằng ánh sáng, màu nước và nhịp đi chậm.</h2> */}
          <p className="mt-5 text-sm leading-8 text-slate-600">
            Từ sắc xanh của mặt vịnh đến bãi đá bắt nắng và những bữa ăn ngay gần biển, mỗi điểm dừng đều mang một bầu không khí rất riêng khiến chuyến đi trở nên đáng nhớ hơn.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {visualSections.map((item, index) => (
            <article
              key={item.title}
              className={`overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-soft ${index === 1 ? "md:translate-y-10" : ""}`}
            >
              <img src={item.image} alt={item.title} className="h-72 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
