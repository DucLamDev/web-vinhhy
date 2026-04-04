import { Card, CardContent } from "@/components/ui/card";
import { advantages } from "@/lib/mock-data";

export function WhyUsSection() {
  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-[1.3rem] tracking-[0.24em] text-ocean">Vì sao nên đặt tại đây</p>
          {/* <h2 className="mt-3 text-4xl font-semibold text-ink">Mọi thông tin quan trọng của tour đều được đưa ra rõ ràng ngay từ đầu.</h2> */}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {advantages.map((item) => (
            <Card key={item.title} className="overflow-hidden border-sky/60 bg-gradient-to-br from-white to-sky/30">
              <CardContent>
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-ocean to-teal" />
                <h3 className="mt-6 text-2xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
