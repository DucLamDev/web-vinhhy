"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  Waves,
  X,
  XCircle
} from "lucide-react";

import { BookingForm } from "@/components/tour/booking-form";
import { SafeImage } from "@/components/ui/safe-image";
import { cn, formatCurrency } from "@/lib/utils";

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
  const gallerySlides = galleryImages.slice(1);
  const containerClass = "mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8";

  const [activeTab, setActiveTab] = useState(sectionTabs[0].id);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [bookingSummary, setBookingSummary] = useState({
    total: tour.prices?.adult || 0,
    travelerCount: 1,
    packageLabel: tour.packageOptions?.[0]?.label || ""
  });
  const lightboxImage = lightboxIndex === null ? null : galleryImages[lightboxIndex] || null;

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

      <section className={`${containerClass} grid gap-5 pt-5 lg:grid-cols-[1fr_1fr] xl:gap-6`}>
        <div className="order-2 space-y-5 lg:order-1 xl:space-y-6">
          <ContentSection
            id="tong-quan"
            title="Tổng quan"
            setSectionRef={(node) => (sectionRefs.current["tong-quan"] = node)}
          >
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                <p className="text-sm leading-relaxed text-slate-600 sm:text-[15px]">{tour.description}</p>
                {(tour.tripFacts || []).length > 0 && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {(tour.tripFacts || []).map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-xl bg-blue-50/60 px-3 py-2.5 text-[13px] leading-relaxed text-slate-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {(tour.featureHighlights || []).length > 0 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {(tour.featureHighlights || []).map((item, index) => (
                    <div key={item.title} className="group rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                          {index === 0 ? <Sparkles className="h-4 w-4" /> : index === 1 ? <Waves className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ContentSection>

          <ContentSection
            id="dich-vu"
            title="Dịch vụ"
            setSectionRef={(node) => (sectionRefs.current["dich-vu"] = node)}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ServicePanel title="Thực đơn" icon={<UtensilsCrossed className="h-4 w-4" />} items={tour.menu || []} tone="coral" />
              <ServicePanel title="Bao gồm" icon={<CheckCircle2 className="h-4 w-4" />} items={tour.inclusions || []} tone="ocean" />
              <ServicePanel title="Không bao gồm" icon={<XCircle className="h-4 w-4" />} items={tour.exclusions || []} tone="slate" />
            </div>
          </ContentSection>

          <ContentSection
            id="lich-trinh"
            title="Lịch trình"
            setSectionRef={(node) => (sectionRefs.current["lich-trinh"] = node)}
          >
            <div className="space-y-4">
              {(tour.itinerary || []).map((item, index) => (
                <div key={`${item.time}-${item.title}`} className="group relative rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
                  <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)]">
                    <div className="flex gap-3">
                      <div className="timeline-connector relative">
                        <span className="timeline-dot bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                          {index === 0 ? <Clock3 className="h-5 w-5" /> : index === 1 ? <MapPin className="h-5 w-5" /> : index === 2 ? <Waves className="h-5 w-5" /> : <UtensilsCrossed className="h-5 w-5" />}
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
                      {item.image ? (
                        <button
                          type="button"
                          onClick={() => {
                            const nextIndex = galleryImages.findIndex((image) => image.url === item.image);
                            if (nextIndex >= 0) {
                              setLightboxIndex(nextIndex);
                            }
                          }}
                          className="group/image relative min-h-[200px] overflow-hidden rounded-xl text-left shadow-sm transition-shadow hover:shadow-md sm:min-h-[220px]"
                        >
                          <SafeImage
                            src={item.image}
                            alt={item.imageAlt || item.title}
                            fill
                            quality={95}
                            className="object-cover transition-transform duration-500 group-hover/image:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity group-hover/image:opacity-100" />
                        </button>
                      ) : null}

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{item.time}</p>
                        <h3 className="mt-1.5 text-lg font-bold text-gray-900 sm:text-xl">{item.title}</h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ContentSection>

          <ContentSection
            id="gallery"
            title="Gallery"
            setSectionRef={(node) => (sectionRefs.current["gallery"] = node)}
          >
            <div className="gallery-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {gallerySlides.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index + 1)}
                  className={cn(
                    "group relative min-h-[220px] overflow-hidden rounded-2xl text-left shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 sm:min-h-[260px]",
                    index === 0 ? "sm:col-span-2 xl:col-span-2 xl:min-h-[340px]" : ""
                  )}
                >
                  <SafeImage
                    src={image.url}
                    alt={image.alt || tour.title}
                    fill
                    quality={95}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-50 transition-opacity group-hover:opacity-70" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="text-sm font-semibold drop-shadow-lg">{image.alt || tour.title}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Xem chi tiết</span>
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
            <p className="mt-0.5 text-lg font-semibold text-ink">{formatCurrency(bookingSummary.total)}</p>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection("booking-panel")}
            className="inline-flex h-10 items-center justify-center rounded-full bg-coral px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,122,26,0.18)]"
          >
            Đặt Tour
          </button>
        </div>
      </div>

      {lightboxImage ? (
        <div className="fixed inset-0 z-[80] bg-slate-950/85 p-4 backdrop-blur-sm" onClick={() => setLightboxIndex(null)}>
          <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="glass absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full text-white"
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
              className="glass absolute left-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white md:flex"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="relative h-[78vh] w-full overflow-hidden rounded-2xl" onClick={(event) => event.stopPropagation()}>
              <SafeImage
                src={lightboxImage.url}
                alt={lightboxImage.alt || tour.title}
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
              className="glass absolute right-5 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white md:flex"
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

function ContentSection({ id, title, children, setSectionRef }) {
  return (
    <section id={id} ref={setSectionRef}>
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ServicePanel({ title, icon, items, tone }) {
  const toneClass =
    tone === "coral"
      ? "border-orange-100 bg-orange-50/40"
      : tone === "ocean"
        ? "border-blue-100 bg-blue-50/40"
        : "border-slate-100 bg-slate-50/40";
  const dotClass = tone === "slate" ? "bg-red-400" : "bg-green-400";

  return (
    <div className={cn("rounded-2xl border p-4 transition-shadow hover:shadow-sm", toneClass)}>
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2.5 rounded-lg bg-white/70 px-3 py-2 text-[13px] leading-relaxed text-slate-600">
            <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dotClass)} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getUniqueImages(images) {
  return Array.from(
    new Map(
      images
        .filter((image) => image?.url && typeof image.url === "string")
        .map((image) => [image.url, image])
    ).values()
  );
}
