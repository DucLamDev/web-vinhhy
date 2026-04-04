import { absoluteUrl, stripHtml } from "./utils";

export const siteConfig = {
  name: "Tour Vĩnh Hy",
  description:
    "Website đặt tour Vĩnh Hy với giao diện hiện đại, lịch trình rõ ràng, hình ảnh đẹp và trải nghiệm đặt chỗ thân thiện trên di động.",
  defaultImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
};

export const buildMetadata = ({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.defaultImage
}) => {
  const resolvedImage = image?.startsWith("/") ? absoluteUrl(image) : image;

  return {
    title,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    alternates: {
      canonical: path
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      images: [{ url: resolvedImage }],
      locale: "vi_VN",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedImage]
    }
  };
};

export const getBlogMetadata = (post) =>
  buildMetadata({
    title: post.yoastTitle || `${post.title} | Blog du lich Vinh Hy`,
    description: post.yoastDescription || stripHtml(post.excerpt),
    path: `/blog/${post.slug}`,
    image: post.featuredImage
  });

export const getTourStructuredData = (tour) => ({
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: tour.title,
  description: tour.seo?.metaDescription || tour.summary,
  image: [tour.heroImage, ...(tour.galleryImages || []).map((item) => item.url)].map((image) =>
    image?.startsWith("/") ? absoluteUrl(image) : image
  ),
  touristType: ["Family", "Couple", "Group"],
  itinerary: (tour.itinerary || []).map((item) => ({
    "@type": "ListItem",
    name: item.title,
    description: item.description
  })),
  offers: {
    "@type": "Offer",
    priceCurrency: "VND",
    price: String(tour.prices?.adult || 0),
    availability: "https://schema.org/InStock",
    url: absoluteUrl(`/tour/${tour.slug}`)
  }
});
