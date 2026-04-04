import { absoluteUrl } from "@/lib/utils";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
