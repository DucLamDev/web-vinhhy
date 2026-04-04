import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  })
    .format(value || 0)
    .replace(/\s?₫/, "đ");

export const formatDate = (value) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));

export const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, "").trim();

export const absoluteUrl = (path = "/") => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(path, siteUrl).toString();
};
