import { extractPlainText, getPostImage } from "./blog-content";

const normalizeKeyword = (value = "") =>
  `${value || ""}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const includesKeyword = (source = "", keyword = "") => {
  const normalizedSource = normalizeKeyword(source);
  const normalizedKeyword = normalizeKeyword(keyword);
  if (!normalizedSource || !normalizedKeyword) return false;
  return normalizedSource.includes(normalizedKeyword);
};

const stripHtml = (value = "") => `${value || ""}`.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const collectHeadings = (post = {}) =>
  (post.contentSections || [])
    .filter((section) => section.type === "heading" || /<h[1-6]\b/i.test(section.body || ""))
    .map((section) => stripHtml(section.body || ""));

const collectLinks = (post = {}) => {
  const html = (post.contentSections || []).map((section) => section.body || "").join(" ");
  return Array.from(html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)).map((match) => match[1]);
};

export const getSeoScore = (post = {}, focusKeyword = "") => {
  const keyword = focusKeyword || post.seo?.metaTitle || post.title || "";
  const contentText = extractPlainText(post);
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const title = post.title || "";
  const slug = post.slug || "";
  const metaTitle = post.seo?.metaTitle || "";
  const metaDescription = post.seo?.metaDescription || "";
  const excerpt = post.excerpt || "";
  const headings = collectHeadings(post);
  const links = collectLinks(post);
  const image = getPostImage(post);

  const checks = [
    {
      label: "Tu khoa chinh da duoc xac dinh",
      passed: Boolean(keyword.trim()),
      points: 10,
      detail: keyword.trim() ? `Dang danh gia theo "${keyword}".` : "Hay nhap focus keyword de cham diem chinh xac hon."
    },
    {
      label: "Tieu de co chua focus keyword",
      passed: includesKeyword(title, keyword),
      points: 15,
      detail: includesKeyword(title, keyword) ? "Tot cho muc do lien quan." : "Nen dua focus keyword vao title."
    },
    {
      label: "Slug co lien quan den keyword",
      passed: includesKeyword(slug.replace(/-/g, " "), keyword),
      points: 10,
      detail: includesKeyword(slug.replace(/-/g, " "), keyword) ? "Slug de hieu va co lien quan." : "Nen rut gon slug va gan voi keyword."
    },
    {
      label: "Meta title co do dai tot",
      passed: metaTitle.length >= 35 && metaTitle.length <= 65,
      points: 10,
      detail: metaTitle ? `${metaTitle.length} ky tu.` : "Chua co meta title."
    },
    {
      label: "Meta description dat chuan",
      passed: metaDescription.length >= 120 && metaDescription.length <= 160,
      points: 10,
      detail: metaDescription ? `${metaDescription.length} ky tu.` : "Chua co meta description."
    },
    {
      label: "Noi dung du do dai",
      passed: wordCount >= 300,
      points: 15,
      detail: `${wordCount} tu. Nen tu 300+ tu cho bai huong dan.`
    },
    {
      label: "Doan mo dau/excerpt co keyword",
      passed: includesKeyword(`${excerpt} ${contentText.slice(0, 260)}`, keyword),
      points: 10,
      detail: includesKeyword(`${excerpt} ${contentText.slice(0, 260)}`, keyword)
        ? "Keyword da xuat hien som trong noi dung."
        : "Nen dua keyword vao excerpt hoac doan mo dau."
    },
    {
      label: "Co heading phu de chia noi dung",
      passed: headings.length >= 2,
      points: 8,
      detail: `${headings.length} heading phu.`
    },
    {
      label: "Co anh va alt text",
      passed: Boolean(image?.url && image?.alt),
      points: 6,
      detail: image?.url ? (image?.alt ? "Anh da co alt text." : "Anh da co nhung chua co alt text.") : "Chua co anh noi bat/noi dung."
    },
    {
      label: "Co lien ket noi bo ho tro dieu huong",
      passed: links.some((href) => href.startsWith("/") || href.includes("tourvinhhy")),
      points: 6,
      detail: links.length > 0 ? `${links.length} lien ket trong noi dung.` : "Chua co lien ket nao trong noi dung."
    }
  ];

  const total = checks.reduce((sum, item) => sum + item.points, 0);
  const earned = checks.reduce((sum, item) => sum + (item.passed ? item.points : 0), 0);
  const score = Math.round((earned / total) * 100);

  return {
    focusKeyword: keyword,
    score,
    checks,
    summary:
      score >= 80
        ? "SEO kha tot, co the publish sau khi doc lai lan cuoi."
        : score >= 60
          ? "Noi dung da co nen tang tot, nen toi uu them title/meta va bo cuc."
          : "Can bo sung them keyword, mo ta SEO va cau truc noi dung de de len top hon."
  };
};
