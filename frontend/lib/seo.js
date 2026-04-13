import { getPostImage } from "./blog-content";
import { absoluteUrl, stripHtml } from "./utils";

export const siteConfig = {
  name: "Tour Vinh Hy",
  description:
    "Website dat tour Vinh Hy voi giao dien hien dai, thong tin ro rang, blog du lich chuan SEO va trai nghiem mobile toi uu.",
  defaultImage:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
};

const isAbsoluteUrl = (value = "") => /^https?:\/\//i.test(value);

const resolveUrl = (value = "/") => (isAbsoluteUrl(value) ? value : absoluteUrl(value));

const resolveImageUrl = (image) => {
  if (!image) return siteConfig.defaultImage;

  if (typeof image === "string") {
    return resolveUrl(image);
  }

  if (image.url) {
    return resolveUrl(image.url);
  }

  return siteConfig.defaultImage;
};

export const buildMetadata = ({
  title,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.defaultImage,
  canonical,
  type = "website",
  publishedTime,
  modifiedTime
}) => {
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
  const canonicalUrl = canonical ? resolveUrl(canonical) : resolveUrl(path);
  const resolvedImage = resolveImageUrl(image);

  return {
    title,
    description,
    metadataBase,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type,
      images: [
        {
          url: resolvedImage
        }
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {})
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedImage]
    },
    icons: {
      icon: "/logo.jpg",
      apple: "/logo.jpg"
    }
  };
};

export const getBlogMetadata = (post) => {
  const fallbackImage = getPostImage(post);

  return buildMetadata({
    title: post?.seo?.metaTitle || `${post?.title || "Blog du lich"} | Tour Vinh Hy`,
    description: post?.seo?.metaDescription || stripHtml(post?.excerpt || siteConfig.description),
    path: `/blog/${post?.slug || ""}`,
    canonical: post?.seo?.canonicalUrl || `/blog/${post?.slug || ""}`,
    image: post?.seo?.ogImage || fallbackImage || siteConfig.defaultImage,
    type: "article",
    publishedTime: post?.publishedAt || post?.date,
    modifiedTime: post?.updatedAt || post?.publishedAt || post?.date
  });
};

export const getBlogPostingStructuredData = (post) => {
  const cover = getPostImage(post);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo?.metaDescription || post.excerpt,
    image: cover?.url ? [resolveImageUrl(cover)] : [siteConfig.defaultImage],
    datePublished: post.publishedAt || post.date,
    dateModified: post.updatedAt || post.publishedAt || post.date,
    mainEntityOfPage: resolveUrl(post.seo?.canonicalUrl || `/blog/${post.slug}`),
    author: {
      "@type": "Person",
      name: post.author?.name || siteConfig.name
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.jpg")
      }
    }
  };
};

export const getBreadcrumbStructuredData = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: resolveUrl(item.href || "/")
  }))
});

export const getTourStructuredData = (tour) => ({
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: tour.title,
  description: tour.seo?.metaDescription || tour.summary,
  image: [tour.heroImage, ...(tour.galleryImages || []).map((item) => item.url)]
    .filter(Boolean)
    .map((image) => resolveUrl(image)),
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
