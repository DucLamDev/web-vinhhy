"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  UtensilsCrossed,
  Waves,
  X,
  XCircle
} from "lucide-react";

import { BookingForm } from "@/components/tour/booking-form";
import { TourCard } from "@/components/tour/tour-card";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { cn, formatCurrency } from "@/lib/utils";

const sectionTabs = [
  { id: "dich-vu", label: "Dịch vụ" },
  { id: "lich-trinh", label: "Lịch trình" },
  { id: "gallery", label: "Gallery" }
];

export function TourDetailShell({ tour }) {
  const router = useRouter();
  const galleryImages = useMemo(
    () => getUniqueImages([{ url: tour.heroImage, alt: tour.title }, ...(tour.galleryImages || [])]),
    [tour]
  );
  const gallerySlides = galleryImages.slice(1);
  const containerClass = "mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8";

  const [activeTab, setActiveTab] = useState(sectionTabs[0].id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [bookingSummary, setBookingSummary] = useState({
    total: tour.prices?.adult || 0,
    travelerCount: 1,
    packageLabel: tour.packageOptions?.[0]?.label || ""
  });

  const activeImage = galleryImages[activeImageIndex] || galleryImages[0] || null;
  const lightboxImage = lightboxIndex === null ? null : galleryImages[lightboxIndex] || null;
  const sectionRefs = useRef({});

  useEffect(() => {
    setActiveImageIndex(0);
  }, [tour.slug]);

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

  const handlePrevImage = () => {
    setActiveImageIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % galleryImages.length);
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

      <button
        type="button"
        onClick={() => router.back()}
        className="fixed left-4 top-24 z-50 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-4 py-2 text-sm font-semibold text-ink shadow-[0_12px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại
      </button>

      <section className={`${containerClass} pt-4 md:pt-5`}>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.72fr)] xl:gap-6">
          <div className="space-y-5">
            <div className="reveal-scale visible rounded-[2rem] border border-slate-200/70 bg-white p-3 shadow-sm sm:p-4">
              <div className="grid gap-3 xl:grid-cols-[170px_minmax(0,1fr)]">
                {galleryImages.length > 1 ? (
                  <div className="order-2 flex gap-3 overflow-x-auto pb-1 xl:order-1 xl:max-h-[760px] xl:flex-col xl:overflow-y-auto xl:overflow-x-hidden xl:pb-0 xl:pr-1">
                    {galleryImages.slice(0, 3).map((image, index) => (
                      <button
                        key={`${image.url}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={cn(
                          "relative h-24 w-28 shrink-0 overflow-hidden rounded-[1.4rem] border-2 transition sm:h-28 sm:w-32 xl:h-[142px] xl:w-full",
                          index === activeImageIndex
                            ? "border-coral shadow-[0_12px_28px_rgba(255,122,26,0.2)]"
                            : "border-transparent opacity-85 hover:-translate-y-1 hover:opacity-100"
                        )}
                        aria-label={`Xem ảnh ${index + 1}`}
                      >
                        <SafeImage
                          src={image.url}
                          alt={image.alt || tour.title}
                          fill
                          quality={100}
                          className="object-cover"
                          sizes="180px"
                        />
                        {index === 4 && galleryImages.length > 5 ? (
                          <span className="absolute inset-0 flex items-center justify-center bg-slate-950/45 text-xl font-semibold text-white">
                            +{galleryImages.length - 5}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="order-1">
                  <div className="group relative aspect-[16/10] overflow-hidden rounded-[1.9rem] bg-slate-100">
                    {activeImage ? (
                      <button type="button" onClick={() => setLightboxIndex(activeImageIndex)} className="block h-full w-full">
                        <SafeImage
                          src={activeImage.url}
                          alt={activeImage.alt || tour.title}
                          fill
                          priority
                          quality={100}
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                          sizes="(max-width: 1024px) 100vw, 72vw"
                        />
                      </button>
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/18 via-transparent to-transparent" />

                    {galleryImages.length > 1 ? (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevImage}
                          className="glass absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white md:flex"
                          aria-label="Ảnh trước"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleNextImage}
                          className="glass absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-white md:flex"
                          aria-label="Ảnh sau"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="stagger-children visible grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
              <div className="rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
                  <Star className="h-3.5 w-3.5" />
                  Tour nổi bật tại {tour.location || "Vĩnh Hy"}
                </div>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-[2.25rem]">{tour.title}</h1>
                {tour.summary ? <p className="mt-4 text-[15px] leading-8 text-slate-600">{tour.summary}</p> : null}

                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {tour.location ? <InfoChip icon={<MapPin className="h-4 w-4" />} label={tour.location} /> : null}
                  {tour.duration ? <InfoChip icon={<Clock3 className="h-4 w-4" />} label={tour.duration} /> : null}
                  {tour.transport ? <InfoChip icon={<Waves className="h-4 w-4" />} label={tour.transport} /> : null}
                  {tour.pickupPlace ? <InfoChip icon={<CheckCircle2 className="h-4 w-4" />} label={tour.pickupPlace} /> : null}
                </div>

                <div className="stagger-children visible grid gap-3">
                  {(tour.tripFacts || []).slice(0, 4).map((item) => (
                    <div key={item} className="card-hover rounded-[1.6rem] border border-slate-200/70 bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <p className="text-sm leading-7 text-slate-600">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <SeoHighlightCard
                  title="Điểm nhấn hành trình"
                  content={`Tour ${tour.title} phù hợp cho khách muốn trải nghiệm biển xanh, cảnh đẹp và lịch trình gọn trong ${tour.duration || "thời gian ngắn"}.`}
                />
                <SeoHighlightCard
                  title="Phù hợp nhóm khách"
                  content={`Lựa chọn linh hoạt cho khách lẻ, gia đình nhỏ hoặc nhóm bạn đang tìm tour ${tour.location || "Vĩnh Hy"} có giá rõ ràng và dịch vụ trọn gói.`}
                />
                <SeoHighlightCard
                  title="Giá từ"
                  content={`${formatCurrency(tour.prices?.adult || 0)} / khách, dễ đặt nhanh ngay trên trang để giữ chỗ.`}
                  accent
                />
              </div>
            </div>
          </div>

          <div id="booking-panel" ref={(node) => (sectionRefs.current["booking-panel"] = node)} className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <BookingForm tour={tour} onSummaryChange={setBookingSummary} compact />
          </div>
        </div>
      </section>

      <section className={`${containerClass} pt-5 xl:pt-6`}>
        <div className="space-y-6">
          <ContentSection
            id="dich-vu"
            title="Dịch vụ"
            setSectionRef={(node) => (sectionRefs.current["dich-vu"] = node)}
          >
            <div className="stagger-children visible grid gap-4 lg:grid-cols-3">
              <ServicePanel title="Thực đơn hải sản" icon={<UtensilsCrossed className="h-4 w-4" />} items={tour.menu || []} tone="coral" />
              <ServicePanel title="Bao gồm trong giá" icon={<CheckCircle2 className="h-4 w-4" />} items={tour.inclusions || []} tone="ocean" />
              <ServicePanel title="Chưa bao gồm" icon={<XCircle className="h-4 w-4" />} items={tour.exclusions || []} tone="slate" />
            </div>
          </ContentSection>

          <ContentSection
            id="lich-trinh"
            title="Lịch trình"
            setSectionRef={(node) => (sectionRefs.current["lich-trinh"] = node)}
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(230,247,251,0.78),rgba(255,255,255,0.96))] p-4 shadow-sm sm:p-5 xl:p-6">
              <div className="space-y-3">
                {(tour.itinerary || []).map((item, index) => (
                  <article
                    key={`${item.time}-${item.title}`}
                    className={cn(
                      "card-hover group relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/90 p-3.5 shadow-[0_14px_35px_rgba(21,48,74,0.07)] backdrop-blur sm:p-4"
                    )}
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-500 to-ocean" />

                    <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
                      {item.image ? (
                        <button
                          type="button"
                          onClick={() => {
                            const nextIndex = galleryImages.findIndex((image) => image.url === item.image);
                            if (nextIndex >= 0) {
                              setLightboxIndex(nextIndex);
                            }
                          }}
                          className="img-zoom relative h-full min-h-[140px] overflow-hidden rounded-[1.2rem] bg-slate-100 text-left shadow-sm sm:min-h-[160px]"
                        >
                          <SafeImage
                            src={item.image}
                            alt={item.imageAlt || item.title}
                            fill
                            quality={100}
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 220px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                        </button>
                      ) : null}

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ocean text-sm font-bold text-white">
                            {index + 1}
                          </span>
                          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
                            <Clock3 className="h-3.5 w-3.5" />
                            {item.time}
                          </div>
                        </div>
                        <h3 className="text-2xl font-semibold leading-tight text-ink">{item.title}</h3>
                        <p className="text-[15px] leading-8 text-slate-600">{item.description}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-coral">Check-in đẹp</span>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">Trải nghiệm biển</span>
                          {/* <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">Phù hợp SEO nội dung tour</span> */}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </ContentSection>

          <ContentSection
            id="gallery"
            title="Thư Viện Ảnh"
            setSectionRef={(node) => (sectionRefs.current["gallery"] = node)}
          >
            <div className="stagger-children visible gallery-grid grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {gallerySlides.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setLightboxIndex(index + 1)}
                  className={cn(
                    "group relative h-full min-h-[240px] overflow-hidden rounded-[1.8rem] text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,48,74,0.16)] sm:min-h-[280px]",
                    index === 0 ? "sm:col-span-2 xl:col-span-2 xl:min-h-[360px]" : ""
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.alt || tour.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-900/10 to-transparent opacity-70 transition-opacity group-hover:opacity-85" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-base font-semibold drop-shadow-lg">{image.alt || tour.title}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">Hình ảnh thực tế</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ContentSection>
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
            className="btn-shine inline-flex h-10 items-center justify-center rounded-full bg-coral px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(255,122,26,0.18)]"
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
                quality={100}
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

      <RecentlyViewedTours currentTour={tour} />
    </div>
  );
}

function RecentlyViewedTours({ currentTour }) {
  const [recentTours, setRecentTours] = useState([]);

  useEffect(() => {
    try {
      if (!currentTour || !currentTour.slug) return;

      const stored = localStorage.getItem("vinhhy_recent_tours");
      let parsed = stored ? JSON.parse(stored) : [];

      const isExist = parsed.some(t => t.id === currentTour.id || t.slug === currentTour.slug);

      let updated = [...parsed];
      if (!isExist) {
        const briefTour = {
          id: currentTour.id,
          slug: currentTour.slug,
          title: currentTour.title,
          heroImage: currentTour.heroImage,
          prices: currentTour.prices || {},
          duration: currentTour.duration,
          location: currentTour.location,
          summary: currentTour.summary,
          standard: currentTour.standard,
        };
        updated = [briefTour, ...parsed].slice(0, 4);
        localStorage.setItem("vinhhy_recent_tours", JSON.stringify(updated));
      }

      setRecentTours(updated.filter(t => t.slug !== currentTour.slug));
    } catch (err) {
      console.error(err);
    }
  }, [currentTour]);

  if (!recentTours || recentTours.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 mt-16 pb-8 reveal visible">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-ink sm:text-2xl">Các tour đã xem</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recentTours.map(tour => (
          <TourCard key={tour.slug} tour={tour} />
        ))}
      </div>
    </section>
  );
}

function ContentSection({ id, title, children, setSectionRef }) {
  return (
    <section id={id} ref={setSectionRef} className="reveal visible">
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InfoChip({ icon, label }) {
  return (
    <div className="card-hover flex items-start gap-2.5 rounded-2xl bg-slate-50 px-3.5 py-3 text-sm text-slate-700">
      <span className="mt-0.5 shrink-0 text-ocean">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function SeoHighlightCard({ title, content, accent = false }) {
  return (
    <div
      className={cn(
        "card-hover rounded-[1.6rem] border p-4 shadow-sm",
        accent ? "border-orange-100 bg-gradient-to-br from-orange-50 to-white" : "border-slate-200/70 bg-white"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className={cn("mt-2 text-sm leading-7", accent ? "text-ink" : "text-slate-600")}>{content}</p>
    </div>
  );
}

function ServicePanel({ title, icon, items, tone }) {
  const toneClass =
    tone === "coral"
      ? "border-orange-100 bg-orange-50/50"
      : tone === "ocean"
        ? "border-blue-100 bg-blue-50/50"
        : "border-slate-100 bg-slate-50/60";
  const dotClass = tone === "slate" ? "bg-red-400" : "bg-green-400";

  return (
    <div className={cn("card-hover rounded-[1.9rem] border p-5 shadow-sm", toneClass)}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-sky-100">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-xl bg-white/80 px-3.5 py-3 text-[13px] leading-relaxed text-slate-600">
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
