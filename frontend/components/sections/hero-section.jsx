"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Clock3, MapPin, Waves } from "lucide-react";

import { Button } from "@/components/ui/button";
import { heroSlides } from "@/lib/mock-data";

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-hero-glow">
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.image}
            className="absolute inset-0 bg-cover transition-opacity duration-1000"
            style={{
              backgroundImage: `linear-gradient(105deg, rgba(255,255,255,0.92) 8%, rgba(255,255,255,0.78) 42%, rgba(255,255,255,0.2) 100%), url(${slide.image})`,
              backgroundPosition: slide.imagePosition || "center center",
              opacity: activeIndex === index ? 1 : 0
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-16 lg:pt-16">
        <div className="self-center lg:min-h-[520px] lg:pt-10">
          <h2 className="hidden text-xs font-semibold uppercase text-[1.3rem] tracking-[0.28em] text-ocean sm:block">{activeSlide.eyebrow}</h2>

          {/* Desktop title — visible md+ */}
          <div className="hidden min-h-[300px] md:block lg:min-h-[350px]">
            {/* <h4 className="mt-4 max-w-2xl text-[2.4rem] font-bold leading-[1.12] tracking-tight text-ink lg:text-[3rem]">
              {activeSlide.title}
            </h4> */}
            <p className="mt-4 max-w-2xl text-[1.1rem] leading-7 text-slate-500">
              {activeSlide.title} <br />
              {activeSlide.description}
            </p>
          </div>


          {/* CTA buttons — desktop style */}
          <div className="mt-4 hidden gap-3 sm:flex">
            <Button asChild size="lg" className="w-auto">
              <Link href="/tour">
                Xem các chương trình tour
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-auto">
              <Link href="/blog">Xem cẩm nang du lịch</Link>
            </Button>
          </div>

          {/* CTA buttons — mobile: compact pill buttons side-by-side */}
          <div className="flex gap-2 sm:hidden">
            <Button asChild size="sm" className="flex-1 text-xs">
              <Link href="/tour">
                Xem tour
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm" className="flex-1 text-xs">
              <Link href="/blog">Cẩm nang</Link>
            </Button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-full px-4 py-2 text-sm transition ${activeIndex === index ? "bg-ocean text-white" : "bg-white/80 text-slate-500 shadow-[0_10px_28px_rgba(21,48,74,0.08)]"
                  }`}
              >
                0{index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 self-end">
          <div className="overflow-hidden rounded-[34px] border border-white/60 bg-white/70 p-3 shadow-soft backdrop-blur sm:p-4">
            <div className="relative h-[440px] overflow-hidden rounded-[28px] sm:h-[520px]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                style={{
                  backgroundImage: `url(${activeSlide.image})`,
                  backgroundPosition: activeSlide.imagePosition || "center center"
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-4 text-white sm:p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">{activeSlide.stat}</p>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-sun" />
                    Vĩnh Hy, Ninh Thuận
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-sun" />
                    Tour 1 ngày và 2N1Đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden gap-4 sm:grid sm:grid-cols-3">
            {[
              ["3+", "Chương trình nổi bật"],
              ["Mỗi ngày", "Có lịch khởi hành"],
              ["Nhiều ảnh", "Dễ chọn tour phù hợp"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-[28px] border border-white/60 bg-white/78 p-5 shadow-[0_16px_35px_rgba(21,48,74,0.08)] backdrop-blur">
                <div className="inline-flex rounded-full bg-sky p-3 text-ocean">
                  <Waves className="h-4 w-4" />
                </div>
                <p className="mt-4 text-2xl font-semibold text-ink">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
