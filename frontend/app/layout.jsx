import "./globals.css";

import { Montserrat, Manrope } from "next/font/google";

import { FloatingContactButtons } from "@/components/layout/floating-contact-buttons";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QueryProvider } from "@/components/providers/query-provider";
import { buildMetadata, siteConfig } from "@/lib/seo";

const bodyFont = Manrope({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

const titleFont = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-title"
});

export const metadata = buildMetadata({
  title: `${siteConfig.name} | Đặt tour Vĩnh Hy với giao diện hiện đại`,
  description: siteConfig.description,
  path: "/"
});

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${bodyFont.variable} ${titleFont.variable}`}>
        <QueryProvider>
          <SiteHeader />
          <main className="min-h-screen pb-24 md:pb-0">{children}</main>
          <SiteFooter />
          <FloatingContactButtons />
          <MobileBottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
