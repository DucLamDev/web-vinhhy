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

  return (
    <div className="page-transition-enter pb-24 md:pb-16">
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

      <section className={`${containerClass} grid gap-6 pt-6 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr] xl:gap-8`}>
        <div className="order-2 space-y-6 lg:order-1 xl:space-y-8">
          <ContentSection
            id="tong-quan"
            title="Tổng quan chương trình"
            eyebrow="Giới thiệu"
            setSectionRef={(node) => (sectionRefs.current["tong-quan"] = node)}
          >
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-xl sm:p-8">
                <p className="text-base leading-relaxed text-slate-700 sm:text-lg">{tour.description}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {(tour.tripFacts || []).map((item, index) => (
                    <div key={item} className="flex items-start gap-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 text-sm leading-relaxed text-slate-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-1">
                {(tour.featureHighlights || []).map((item, index) => (
                  <div key={item.title} className="group rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 sm:p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transition-transform group-hover:scale-110">
                        {index === 0 ? <Sparkles className="h-6 w-6" /> : index === 1 ? <Waves className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{item.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ContentSection>

          <ContentSection
            id="dich-vu"
            title="Dịch vụ trong tour"
            eyebrow="Bao gồm gì?"
            setSectionRef={(node) => (sectionRefs.current["dich-vu"] = node)}
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ServicePanel title="Bữa trưa hải sản" eyebrow="Thực đơn" icon={<UtensilsCrossed className="h-6 w-6" />} items={tour.menu || []} tone="coral" />
              <ServicePanel title="Bao gồm" eyebrow="Dịch vụ" icon={<CheckCircle2 className="h-6 w-6" />} items={tour.inclusions || []} tone="ocean" />
              <ServicePanel title="Không bao gồm" eyebrow="Lưu ý" icon={<XCircle className="h-6 w-6" />} items={tour.exclusions || []} tone="slate" />
            </div>
          </ContentSection>

          <ContentSection
            id="lich-trinh"
            title="Lịch trình 1 ngày"
            eyebrow="Timeline"
            setSectionRef={(node) => (sectionRefs.current["lich-trinh"] = node)}
          >
            <div className="space-y-6">
              {(tour.itinerary || []).map((item, index) => (
                <div key={`${item.time}-${item.title}`} className="group relative rounded-3xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 sm:p-8">
                  <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)]">
                    <div className="flex gap-4">
                      <div className="timeline-connector relative">
                        <span className="timeline-dot bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
                          {index === 0 ? <Clock3 className="h-6 w-6" /> : index === 1 ? <MapPin className="h-6 w-6" /> : index === 2 ? <Waves className="h-6 w-6" /> : <UtensilsCrossed className="h-6 w-6" />}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
                      {item.image ? (
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(galleryImages.findIndex((image) => image.url === item.image))}
                          className="group/image relative min-h-[240px] overflow-hidden rounded-2xl text-left shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 sm:min-h-[280px]"
                        >
                          <Image
                            src={item.image}
                            alt={item.imageAlt || item.title}
                            fill
                            quality={92}
                            className="object-cover transition-all duration-500 group-hover/image:scale-105"
                            sizes="(max-width: 1280px) 100vw, 40vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover/image:opacity-100" />
                        </button>
                      ) : null}

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">{item.time}</p>
                        <h3 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">{item.title}</h3>
                        <p className="mt-4 text-base leading-relaxed text-slate-700">{item.description}</p>
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
                    "group relative min-h-[280px] overflow-hidden rounded-3xl text-left shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 sm:min-h-[320px]",
                    index === 0 ? "sm:col-span-2 xl:col-span-2 xl:min-h-[400px]" : ""
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || tour.title}
                    fill
                    quality={92}
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    sizes="(max-width: 1280px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-lg font-bold drop-shadow-lg">{image.alt || tour.title}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm font-medium">Xem chi tiết</span>
                    </div>
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
    <span className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/20 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/30">
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
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-50 to-gray-50 p-4 text-sm shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      <span className="font-semibold text-slate-700">{label}</span>
      <span className={cn("font-bold text-lg", isFree ? "text-green-600" : "text-orange-600")}>
        {isFree ? "Miễn phí" : formatCurrency(value)}
      </span>
    </div>
  );
}

function ServicePanel({ title, eyebrow, icon, items, tone }) {
  const toneClass =
    tone === "coral"
      ? "border-orange-200/60 bg-gradient-to-br from-orange-50 to-red-50"
      : tone === "ocean"
        ? "border-blue-200/60 bg-gradient-to-br from-blue-50 to-indigo-50"
        : "border-slate-200/60 bg-gradient-to-br from-slate-50 to-gray-50";
  const dotClass = tone === "slate" ? "bg-red-500" : "bg-green-500";

  return (
    <div className={cn("rounded-3xl border p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1", toneClass)}>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{eyebrow}</p>
          <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h3>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-4 rounded-2xl bg-white/60 p-4 text-sm leading-relaxed text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl">
            <div className={cn("mt-1 h-3 w-3 shrink-0 rounded-full shadow-lg", dotClass)} />
            <span className="font-medium">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getUniqueImages(images) {
  return Array.from(new Map(images.filter(Boolean).map((image) => [image.url, image])).values());
}
