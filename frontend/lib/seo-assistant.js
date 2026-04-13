import { createSection } from "./blog-content";

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const truncate = (value = "", max = 160) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}...`;
};

export const buildSeoDraft = ({
  title = "",
  primaryKeyword = "",
  secondaryKeyword = "",
  location = "Vinh Hy",
  audience = "du khach tu tuc",
  tone = "thuc te"
}) => {
  const effectiveKeyword = primaryKeyword || title || `du lich ${location}`;
  const effectiveTitle = title || `${effectiveKeyword}: kinh nghiem chi tiet`;
  const seoTitle = truncate(`${effectiveKeyword} ${location} | Kinh nghiem va lich trinh`, 60);
  const metaDescription = truncate(
    `${effectiveTitle}. Bai viet huong dan cho ${audience}, tap trung vao kinh nghiem thuc te, lich trinh, chi phi va meo di ${location}.`,
    158
  );

  return {
    metaTitle: seoTitle,
    metaDescription,
    excerpt: truncate(
      `${effectiveTitle} voi thong tin ${tone}, de ap dung: thoi diem dep, cach di chuyen, diem nen di, chi phi va meo toi uu lich trinh.`,
      170
    ),
    introHtml: `<p><strong>${effectiveKeyword}</strong> la chu de duoc tim kiem nhieu khi len ke hoach di ${location}. Bai viet nay tong hop kinh nghiem ${tone}, de doc va de ap dung ngay cho ${audience}.</p>`,
    faqJsonLd: JSON.stringify(
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `${effectiveKeyword} co gi hay?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${location} noi bat boi canh dep, cac trai nghiem gan bien va nhieu diem tham quan phu hop cho lich trinh ngan ngay.`
            }
          },
          {
            "@type": "Question",
            name: `Nen di ${location} vao thoi gian nao?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Nen uu tien ngay nang dep, bien em va dat truoc cac dich vu quan trong de co trai nghiem on dinh hon.`
            }
          }
        ]
      },
      null,
      2
    ),
    outlineSections: [
      {
        ...createSection("heading"),
        headingLevel: "h2",
        body: `${stripHtml(effectiveKeyword)} co gi dac biet?`
      },
      {
        ...createSection("text"),
        body: `<p>Mo dau bang mot doan mo ta ngan ve ly do nguoi doc nen quan tam den chu de nay, ket hop tu khoa chinh <strong>${effectiveKeyword}</strong> mot cach tu nhien.</p>`
      },
      {
        ...createSection("heading"),
        headingLevel: "h2",
        body: `Kinh nghiem di ${location} cho ${audience}`
      },
      {
        ...createSection("text"),
        body: `<p>Trinh bay thoi diem di dep, cach di chuyen, muc chi phi tham khao va cac luu y thuc te de nguoi doc co the len ke hoach nhanh.</p>`
      },
      {
        ...createSection("image"),
        caption: `${effectiveKeyword} - anh minh hoa cho bai viet`
      },
      {
        ...createSection("heading"),
        headingLevel: "h2",
        body: `Lich trinh goi y va meo toi uu chi phi`
      },
      {
        ...createSection("text"),
        body: `<p>De xuat lich trinh 1 ngay hoac 2 ngay 1 dem, uu tien diem den hop ly, cach sap xep gio giac va meo tiet kiem chi phi.</p>`
      },
      {
        ...createSection("heading"),
        headingLevel: "h2",
        body: `Cau hoi thuong gap ve ${secondaryKeyword || effectiveKeyword}`
      },
      {
        ...createSection("html"),
        body: `<div class="faq-block"><h3>${effectiveKeyword} phu hop voi ai?</h3><p>Tra loi ngan gon, ro y va co tu khoa lien quan.</p><h3>Can dat truoc gi?</h3><p>Neu co tour, xe hoac luu tru, nen dat truoc vao cao diem.</p></div>`
      }
    ]
  };
};
