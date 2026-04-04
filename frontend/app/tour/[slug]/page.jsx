import { notFound } from "next/navigation";

import { TourDetailShell } from "@/components/tour/tour-detail-shell";
import { getTourBySlug, getTours } from "@/lib/api";
import { buildMetadata, getTourStructuredData } from "@/lib/seo";

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    return buildMetadata({
      title: "Không tìm thấy tour | Tour Vĩnh Hy",
      path: `/tour/${slug}`
    });
  }

  return buildMetadata({
    title: tour.seo?.metaTitle || `${tour.title} | Tour Vĩnh Hy`,
    description: tour.seo?.metaDescription || tour.summary,
    path: `/tour/${tour.slug}`,
    image: tour.heroImage
  });
}

export default async function TourDetailPage({ params }) {
  const { slug } = await params;
  const tour = await getTourBySlug(slug);

  if (!tour) {
    notFound();
  }

  const structuredData = getTourStructuredData(tour);

  return (
    <>
      <TourDetailShell tour={tour} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
