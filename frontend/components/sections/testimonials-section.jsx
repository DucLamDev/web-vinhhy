import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/lib/mock-data";

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase text-[1.3rem] tracking-[0.24em] text-ocean">Đánh giá từ du khách</p>
        {/* <h2 className="mt-3 text-4xl font-semibold text-ink">Cảm giác an tâm đến từ cách thông tin được trình bày rõ và đẹp.</h2> */}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {testimonials.map((item) => (
          <Card key={item.name} className="border-slate-200 bg-white">
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-ocean to-teal text-sm font-semibold text-white">
                  {item.avatar}
                </div>
                <div>
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-8 text-slate-600">“{item.quote}”</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
