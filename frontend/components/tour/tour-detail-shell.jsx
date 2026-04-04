"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Ticket,
  UtensilsCrossed,
  Waves,
  X,
  XCircle
} from "lucide-react";

import { BookingForm } from "@/components/tour/booking-form";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const sectionTabs = [
  { id: "tong-quan", label: "Tổng quan" },
  { id: "bang-gia", label: "Bảng giá" },
  { id: "dich-vu", label: "Dịch vụ" },
  { id: "lich-trinh", label: "Lịch trình" },
  { id: "gallery", label: "Gallery" }
];

export function TourDetailShell({ tour }) {
  const galleryImages = useMemo(
    () => getUniqueImages([{ url: tour.heroImage, alt: tour.title }, ...(tour.galleryImages || [])]),
    [tour]
  );
  const heroSlides = galleryImages.slice(0, 5);
  const gallerySlides = galleryImages.slice(1);
  const currentHero = heroSlides[0];
  const containerClass = "mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8";
  const heroHighlights = (tour.tripFacts?.length ? tour.tripFacts : tour.inclusions || []).slice(0, 3);

  const [activeTab, setActiveTab] = useState(sectionTabs[0].id);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [bookingSummary, setBookingSummary] = useState({
    total: tour.prices?.adult || 0,
    travelerCount: 1,
    packageLabel: tour.packageOptions?.[0]?.label || ""
  });

  const sectionRefs = useRef({});

  useEffect(() => {
    const sections = sectionTabs
      .map((tab) => document.getElementById(tab.id))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveTab(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.22, 0.4, 0.65]
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }

      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => ((current ?? 0) + 1) % galleryImages.length);
      }

      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => ((current ?? 0) - 1 + galleryImages.length) % galleryImages.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [galleryImages.length, lightboxIndex]);

  const scrollToSection = (id) => {
    const target = sectionRefs.current[id] || document.getElementById(id);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeHeroSlide = heroSlides[activeHeroIndex] || currentHero;

  return (
    <div className="page-transition-enter pb-24 md:pb-16">
      <section className={`${containerClass} pt-4 sm:pt-6`}>
        <div className="overflow-hidden rounded-[32px] border border-[#d9ebf1] bg-[linear-gradient(180deg,#eef9fd_0%,#ffffff_100%)] shadow-[0_30px_90px_rgba(21,48,74,0.08)] sm:rounded-[40px]">
          <div className="relative min-h-[320px] bg-[#dff4fb] sm:min-h-[420px] lg:min-h-[520px] xl:min-h-[560px]">
            <Image
              src={activeHeroSlide.url}
              alt={activeHeroSlide.alt || tour.title}
              fill
              priority
              quality={96}
              className="scale-[1.01] object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1600px"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.72),transparent_28%),linear-gradient(180deg,rgba(7,64,90,0.04)_0%,rgba(7,64,90,0.12)_38%,rgba(8,33,52,0.26)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.02)_48%,rgba(255,255,255,0)_100%)]" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-6 lg:p-8">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/65 bg-white/78 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-ocean shadow-[0_16px_40px_rgba(15,142,164,0.12)] backdrop-blur-md sm:px-4 sm:text-xs">
                <Sparkles className="h-4 w-4" />
                {(tour.trustBadges || []).join(" • ")}
              </div>

              {heroSlides.length > 1 ? (
                <div className="hidden items-center gap-2 md:flex">
                  <button
                    type="button"
                    onClick={() => setActiveHeroIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/86 text-ocean shadow-[0_16px_42px_rgba(21,48,74,0.16)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveHeroIndex((current) => (current + 1) % heroSlides.length)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/86 text-ocean shadow-[0_16px_42px_rgba(21,48,74,0.16)] backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
                    aria-label="Ảnh sau"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="relative z-10 -mt-16 px-3 pb-3 sm:-mt-20 sm:px-5 sm:pb-5 lg:-mt-24 lg:px-8 lg:pb-8">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
              <div className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-[0_28px_70px_rgba(21,48,74,0.14)] backdrop-blur-xl sm:p-6 lg:max-w-4xl lg:p-8">
                <div className="flex flex-wrap gap-2 text-sm">
                  <HeroMeta icon={<Clock3 className="h-4 w-4" />} label={tour.duration} />
                  <HeroMeta icon={<MapPin className="h-4 w-4" />} label={tour.location} />
                  <HeroMeta icon={<Ticket className="h-4 w-4" />} label={`Mã tour: ${tour.tourCode || "VHY01"}`} />
                </div>

                <h1 className="mt-4 max-w-4xl text-[2.2rem] font-semibold leading-[1.02] text-ink sm:text-[3rem] lg:text-[4rem]">
                  {tour.title}
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8 lg:text-lg lg:leading-9">
                  {tour.summary}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => scrollToSection("booking-panel")}
                    className="inline-flex h-12 items-center justify-center rounded-full bg-coral px-6 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(255,122,26,0.28)] transition hover:bg-[#ff8a35] lg:h-14 lg:px-7 lg:text-base"
                  >
                    Đặt tour ngay
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollToSection("lich-trinh")}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-ink shadow-[0_12px_28px_rgba(21,48,74,0.08)] transition hover:border-ocean/30 hover:text-ocean lg:h-14 lg:px-7 lg:text-base"
                  >
                    Xem lịch trình
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(243,251,255,0.95)_100%)] p-5 shadow-[0_20px_60px_rgba(21,48,74,0.12)] backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">Điểm nhấn chuyến đi</p>
                  <div className="mt-4 space-y-3">
                    {heroHighlights.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-[18px] bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-[0_8px_24px_rgba(21,48,74,0.05)]">
                        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-coral" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 xl:grid-cols-1">
                  <OverlayFactCard label="Giá tham khảo" value={`${formatCurrency(tour.prices?.adult || 0)} / khách`} />
                  <OverlayFactCard label="Khởi hành" value={tour.departureDates?.[0] ? formatDate(tour.departureDates[0]) : "Liên hệ"} />
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 pb-3 sm:px-5 sm:pb-5 lg:px-8 lg:pb-8">
            <div className="rounded-[28px] border border-[#d9ebf1] bg-white p-3 shadow-[0_20px_55px_rgba(21,48,74,0.06)] sm:p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ocean">Kho ảnh nổi bật</p>
                  <p className="mt-1 text-sm text-slate-500">Thiết kế lại theo kiểu gallery rõ ràng hơn, dễ chọn hơn trên cả điện thoại lẫn desktop.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(activeHeroIndex)}
                  className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-[0_12px_28px_rgba(21,48,74,0.08)] transition hover:border-ocean/25 hover:text-ocean sm:inline-flex"
                >
                  <Camera className="h-4 w-4" />
                  Xem gallery
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
                {heroSlides.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setActiveHeroIndex(index)}
                    className={cn(
                      "group relative overflow-hidden rounded-[22px] border bg-white p-1 text-left transition",
                      index === activeHeroIndex
                        ? "border-coral bg-[#fff9f4] shadow-[0_18px_36px_rgba(255,122,26,0.16)]"
                        : "border-slate-200 shadow-[0_10px_28px_rgba(21,48,74,0.05)] hover:-translate-y-0.5 hover:border-ocean/25"
                    )}
                  >
                    <div className="relative aspect-[1.04/1] overflow-hidden rounded-[18px]">
                      <Image
                        src={image.url}
                        alt={image.alt || tour.title}
                        fill
                        quality={88}
                        className={cn(
                          "object-cover transition duration-500",
                          index === activeHeroIndex ? "scale-[1.03]" : "group-hover:scale-105"
                        )}
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
                            Ảnh {String(index + 1).padStart(2, "0")}
                          </span>
                          {index === activeHeroIndex ? (
                            <span className="rounded-full bg-coral px-2.5 py-1 text-[11px] font-semibold shadow-[0_10px_20px_rgba(255,122,26,0.28)]">
                              Đang xem
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="tab-bar hidden md:block">
        <div className={`${containerClass} scrollbar-hide flex gap-6 overflow-x-auto`}>
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className={cn("tab-bar-link", activeTab === tab.id && "active")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <section className={`${containerClass} grid gap-6 pt-6 lg:grid-cols-[minmax(0,1fr)_580px] xl:grid-cols-[minmax(0,1fr)_610px] xl:gap-8`}>
        <div className="order-2 space-y-6 lg:order-1 xl:space-y-8">
          <ContentSection
            id="tong-quan"
            title="Tổng quan chương trình"
            eyebrow="Giới thiệu"
            setSectionRef={(node) => (sectionRefs.current["tong-quan"] = node)}
          >
            <div className="grid gap-4 xl:grid-cols-[1.04fr_0.96fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft lg:p-7">
                <p className="text-sm leading-8 text-slate-600 lg:text-[15px]">{tour.description}</p>
                <div className="mt-6 grid gap-3">
                  {(tour.tripFacts || []).map((item) => (
                    <div key={item} className="flex items-start gap-3 rounded-[20px] bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                {(tour.featureHighlights || []).map((item, index) => (
                  <div key={item.title} className="animate-fade-in-up rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft lg:p-7">
                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky text-ocean">
                      {index === 0 ? <Sparkles className="h-5 w-5" /> : index === 1 ? <Waves className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    </span>
                    <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ContentSection>

          <ContentSection
            id="bang-gia"
            title="Bảng giá theo từng option"
            eyebrow="Giá chuẩn"
            setSectionRef={(node) => (sectionRefs.current["bang-gia"] = node)}
          >
            <div className="scroll-snap-x scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 xl:grid-cols-3">
              {(tour.packageOptions || []).map((option) => (
                <article key={option.id} className="min-w-[292px] rounded-[30px] border border-slate-200 bg-white p-5 shadow-soft sm:min-w-0 lg:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{option.guestLabel}</p>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{option.label}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{option.note}</p>

                  <div className="mt-5 grid gap-3">
                    <ComparisonRow label="Người lớn" value={option.adultPrice} />
                    <ComparisonRow label="Trẻ em" value={option.childPrice} />
                    <ComparisonRow label="Em bé" value={option.infantPrice} isFree={option.infantPrice === 0} />
                  </div>
                </article>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            id="dich-vu"
            title="Dịch vụ trong tour"
            eyebrow="Bao gồm gì?"
            setSectionRef={(node) => (sectionRefs.current["dich-vu"] = node)}
          >
            <div className="scroll-snap-x scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:px-0">
              <ServicePanel title="Bữa trưa hải sản" eyebrow="Thực đơn" icon={<UtensilsCrossed className="h-5 w-5" />} items={tour.menu || []} tone="coral" />
              <ServicePanel title="Bao gồm" eyebrow="Dịch vụ" icon={<CheckCircle2 className="h-5 w-5" />} items={tour.inclusions || []} tone="ocean" />
              <ServicePanel title="Không bao gồm" eyebrow="Lưu ý" icon={<XCircle className="h-5 w-5" />} items={tour.exclusions || []} tone="slate" />
            </div>
          </ContentSection>

          <ContentSection
            id="lich-trinh"
            title="Lịch trình 1 ngày"
            eyebrow="Timeline"
            setSectionRef={(node) => (sectionRefs.current["lich-trinh"] = node)}
          >
            <div className="space-y-4">
              {(tour.itinerary || []).map((item, index) => (
                <div key={`${item.time}-${item.title}`} className="timeline-connector rounded-[30px] border border-slate-200 bg-white p-5 shadow-soft sm:p-6 lg:p-7">
                  <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)]">
                    <div className="flex gap-4">
                      <span className="timeline-dot bg-coral/10 text-coral">
                        {index === 0 ? <Clock3 className="h-5 w-5" /> : index === 1 ? <MapPin className="h-5 w-5" /> : index === 2 ? <Waves className="h-5 w-5" /> : <UtensilsCrossed className="h-5 w-5" />}
                      </span>
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[0.96fr_1.04fr]">
                      {item.image ? (
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(galleryImages.findIndex((image) => image.url === item.image))}
                          className="relative min-h-[220px] overflow-hidden rounded-[24px] text-left lg:min-h-[280px]"
                        >
                          <Image
                            src={item.image}
                            alt={item.imageAlt || item.title}
                            fill
                            quality={92}
                            className="object-cover transition duration-500 hover:scale-[1.03]"
                            sizes="(max-width: 1280px) 100vw, 40vw"
                          />
                        </button>
                      ) : null}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">{item.time}</p>
                        <h3 className="mt-2 text-2xl font-semibold text-ink lg:text-[2rem]">{item.title}</h3>
                        <p className="mt-4 text-sm leading-8 text-slate-600 lg:text-[15px]">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            id="gallery"
            title="Gallery thực tế"
            eyebrow="Khoảnh khắc đẹp"
            setSectionRef={(node) => (sectionRefs.current["gallery"] = node)}
          >
            <div className="gallery-grid grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {gallerySlides.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index + 1)}
                  className={cn(
                    "group relative min-h-[220px] overflow-hidden rounded-[28px] text-left shadow-soft transition hover:-translate-y-1 lg:min-h-[280px]",
                    index === 0 ? "sm:col-span-2 xl:col-span-2 xl:min-h-[360px]" : ""
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || tour.title}
                    fill
                    quality={92}
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 1280px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-medium">{image.alt || tour.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </ContentSection>
        </div>

        <div
          id="booking-panel"
          ref={(node) => (sectionRefs.current["booking-panel"] = node)}
          className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start"
        >
          <BookingForm tour={tour} onSummaryChange={setBookingSummary} />
        </div>
      </section>

      <div className={cn("booking-mobile-bar md:hidden", bookingSummary.total ? "visible" : "")}>
        <div className={`${containerClass} flex items-center justify-between gap-4 !px-0`}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Tạm tính</p>
            <p className="mt-1 text-lg font-semibold text-ink">{formatCurrency(bookingSummary.total)}</p>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection("booking-panel")}
            className="inline-flex h-11 items-center justify-center rounded-full bg-coral px-5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(255,122,26,0.2)]"
          >
            Đặt Tour
          </button>
        </div>
      </div>

      {lightboxIndex !== null ? (
        <div className="fixed inset-0 z-[80] bg-slate-950/85 p-4 backdrop-blur-sm" onClick={() => setLightboxIndex(null)}>
          <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="glass absolute right-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-full text-white"
              aria-label="Đóng gallery"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((current) => ((current ?? 0) - 1 + galleryImages.length) % galleryImages.length);
              }}
              className="glass absolute left-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white md:flex"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="relative h-[78vh] w-full overflow-hidden rounded-[28px]" onClick={(event) => event.stopPropagation()}>
              <Image
                src={galleryImages[lightboxIndex].url}
                alt={galleryImages[lightboxIndex].alt || tour.title}
                fill
                quality={95}
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxIndex((current) => ((current ?? 0) + 1) % galleryImages.length);
              }}
              className="glass absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white md:flex"
              aria-label="Ảnh sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ContentSection({ id, eyebrow, title, children, setSectionRef }) {
  return (
    <section id={id} ref={setSectionRef}>
      <div className="mb-4 lg:mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean">{eyebrow}</p>
        <h2 className="mt-2 text-[1.9rem] font-semibold text-ink lg:text-[2.6rem]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function HeroMeta({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-ink shadow-[0_10px_26px_rgba(8,33,52,0.06)]">
      {icon}
      {label}
    </span>
  );
}

function OverlayFactCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-[#d9ebf1] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbfe_100%)] px-4 py-4 shadow-[0_14px_34px_rgba(21,48,74,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-semibold leading-6 text-ink xl:text-lg">{value}</p>
    </div>
  );
}

function ComparisonRow({ label, value, isFree = false }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] bg-slate-50 px-4 py-4 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <span className={cn("font-semibold", isFree ? "text-emerald-600" : "text-coral")}>{isFree ? "Miễn phí" : formatCurrency(value)}</span>
    </div>
  );
}

function ServicePanel({ title, eyebrow, icon, items, tone }) {
  const toneClass =
    tone === "coral"
      ? "border-coral/15 bg-[#fff8f2]"
      : tone === "ocean"
        ? "border-ocean/15 bg-[#f5fbfe]"
        : "border-slate-200 bg-slate-50";
  const dotClass = tone === "slate" ? "bg-coral" : "bg-emerald-500";

  return (
    <div className={cn("min-w-[280px] rounded-[30px] border p-5 shadow-soft lg:min-w-0", toneClass)}>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-coral shadow-[0_12px_24px_rgba(21,48,74,0.08)]">{icon}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{eyebrow}</p>
          <h3 className="mt-1 text-2xl font-semibold text-ink">{title}</h3>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-[18px] bg-white px-4 py-3 text-sm leading-7 text-slate-700">
            <span className={cn("mt-2 h-2.5 w-2.5 shrink-0 rounded-full", dotClass)} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getUniqueImages(images) {
  return Array.from(new Map(images.filter(Boolean).map((image) => [image.url, image])).values());
}
