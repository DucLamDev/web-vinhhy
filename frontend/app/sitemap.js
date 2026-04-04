import { getTours } from "@/lib/api";
import { absoluteUrl } from "@/lib/utils";
import { getBlogPosts } from "@/lib/wordpress";

export default async function sitemap() {
  const [tours, posts] = await Promise.all([getTours(), getBlogPosts(20)]);

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date()
    },
    {
      url: absoluteUrl("/tour"),
      lastModified: new Date()
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: new Date()
    },
    ...tours.map((tour) => ({
      url: absoluteUrl(`/tour/${tour.slug}`),
      lastModified: new Date()
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.date)
    }))
  ];
}
