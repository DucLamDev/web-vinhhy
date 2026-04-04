import { BlogPreviewSection } from "@/components/sections/blog-preview-section";
import { CtaSection } from "@/components/sections/cta-section";
import { FeaturedToursSection } from "@/components/sections/featured-tours-section";
import { HeroSection } from "@/components/sections/hero-section";
import { JourneyMomentsSection } from "@/components/sections/journey-moments-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { VisualGallerySection } from "@/components/sections/visual-gallery-section";
import { WhyUsSection } from "@/components/sections/why-us-section";
import { getTours } from "@/lib/api";
import { getBlogPosts } from "@/lib/wordpress";

export default async function HomePage() {
  const [tours, posts] = await Promise.all([getTours(), getBlogPosts(3)]);

  return (
    <>
      <HeroSection />
      <FeaturedToursSection tours={tours} />
      <VisualGallerySection />
      <WhyUsSection />
      <JourneyMomentsSection />
      <TestimonialsSection />
      <BlogPreviewSection posts={posts} />
      <CtaSection />
    </>
  );
}
